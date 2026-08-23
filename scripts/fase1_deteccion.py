#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 1 - Deteccion de dudas y clustering.

    python3 scripts/fase1_deteccion.py --organismo MPF

Lee data/<prefijo>/mensajes.jsonl (salida de la fase 0) y produce:
  data/<prefijo>/preguntas.jsonl  una fila por mensaje que plantea una duda
  data/<prefijo>/clusters.json    una duda canonica + sus variantes + frecuencia
  data/<prefijo>/reporte-fase1.json

El clustering es lexico (tf-idf + coseno, agrupando por lider). No inventa
nada: solo junta formulaciones parecidas. La consolidacion semantica fina
queda para la fase 2.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nlp_es  # noqa: E402
import wa_lib as W  # noqa: E402

LARGO_MAXIMO = 600      # arriba de esto suele ser un pegado de la web, no una duda
MIN_TOKENS = 2


def detectar(msgs: list[dict], lex: nlp_es.Lexico) -> tuple[list[dict], Counter]:
    preguntas: list[dict] = []
    motivos = Counter()
    for m in msgs:
        texto = m["texto"]
        fuertes, debiles = lex.senales_de_duda(texto)
        if not fuertes:
            motivos["sin_senal"] += 1
            continue
        if len(texto) > LARGO_MAXIMO:
            motivos["pegado_largo"] += 1
            continue
        if lex.es_coordinacion(texto):
            motivos["coordinacion"] += 1
            continue
        tokens = lex.tokenizar(texto)
        if len(tokens) < MIN_TOKENS:
            motivos["sin_contenido"] += 1
            continue
        categoria, _ = lex.categorizar(tokens)
        preguntas.append(
            {
                "id": m["id"],
                "timestamp": m["timestamp"],
                "autor_hash": m["autor_hash"],
                "texto": texto,
                "senales": sorted(set(fuertes)),
                "senales_debiles": sorted(set(debiles)),
                "tokens": tokens,
                "categoria_msg": categoria,
            }
        )
    return preguntas, motivos


def main() -> None:
    ap = argparse.ArgumentParser(description="Fase 1: deteccion de dudas y clustering")
    ap.add_argument("--organismo", required=True)
    ap.add_argument("--umbral", type=float, default=0.42, help="coseno minimo para entrar a un cluster")
    ap.add_argument("--umbral-fusion", type=float, default=0.62, help="coseno minimo para fusionar clusters")
    args = ap.parse_args()

    org = W.cargar_organismo(args.organismo)
    prefijo = org["prefijo_id"]
    dir_datos = os.path.join(W.RAIZ, "data", prefijo)
    msgs = W.leer_jsonl(os.path.join(dir_datos, "mensajes.jsonl"))
    lex = nlp_es.Lexico()

    preguntas, motivos = detectar(msgs, lex)
    W.escribir_jsonl(os.path.join(dir_datos, "preguntas.jsonl"), preguntas)

    docs = [p["tokens"] for p in preguntas]
    conceptos = set(lex.forma_a_lema.values())
    vectores, df = nlp_es.construir_vectores(docs, conceptos=conceptos)
    idx = nlp_es.indice_invertido(vectores, df)

    # Lidera la formulacion mas explicita: mas tokens de contenido y mas larga.
    orden = sorted(
        range(len(preguntas)),
        key=lambda i: (-len(set(docs[i])), -len(preguntas[i]["texto"])),
    )
    crudos = nlp_es.agrupar_por_lider(vectores, orden, args.umbral, idx)
    fusion = nlp_es.fusionar_clusters(crudos, vectores, args.umbral_fusion)

    clusters = []
    for c in fusion:
        miembros = sorted(c["miembros"], key=lambda i: preguntas[i]["timestamp"])
        tokens_todos = [t for i in miembros for t in docs[i]]
        categoria, puntajes = lex.categorizar(tokens_todos)
        textos = [p["texto"] for p in preguntas]
        lider = nlp_es.lider_central(miembros, vectores, textos)
        # la variante mas explicita encabeza la lista
        variantes = sorted(miembros, key=lambda i: -len(set(docs[i])))
        clusters.append(
            {
                "cluster_id": None,
                "categoria": categoria,
                "frecuencia": len(miembros),
                "autores_distintos": len({preguntas[i]["autor_hash"] for i in miembros}),
                "texto_lider": preguntas[lider]["texto"],
                "terminos_clave": [t for t, _ in Counter(tokens_todos).most_common(8)],
                "primera": preguntas[miembros[0]]["timestamp"],
                "ultima": preguntas[miembros[-1]]["timestamp"],
                "variantes": [preguntas[i]["texto"] for i in variantes[:12]],
                "mensajes": [preguntas[i]["id"] for i in miembros],
                "puntajes_categoria": {k: round(v, 1) for k, v in puntajes.items()},
            }
        )
    clusters.sort(key=lambda c: (-c["frecuencia"], c["primera"]))
    for n, c in enumerate(clusters, start=1):
        c["cluster_id"] = f"{prefijo}-c{n:03d}"

    with open(os.path.join(dir_datos, "clusters.json"), "w", encoding="utf-8") as fh:
        json.dump(clusters, fh, ensure_ascii=False, indent=2)

    por_cat = Counter()
    preg_por_cat = Counter()
    for c in clusters:
        por_cat[c["categoria"]] += 1
        preg_por_cat[c["categoria"]] += c["frecuencia"]
    tam = Counter()
    for c in clusters:
        f = c["frecuencia"]
        tam["1 (unica)" if f == 1 else "2-4" if f < 5 else "5-9" if f < 10 else "10-24" if f < 25 else "25+"] += 1

    reporte = {
        "organismo": org["codigo"],
        "mensajes_analizados": len(msgs),
        "preguntas_detectadas": len(preguntas),
        "descartes_deteccion": dict(motivos.most_common()),
        "clusters": len(clusters),
        "umbral": args.umbral,
        "umbral_fusion": args.umbral_fusion,
        "clusters_por_categoria": dict(por_cat.most_common()),
        "preguntas_por_categoria": dict(preg_por_cat.most_common()),
        "distribucion_tamano": dict(tam),
        "top_20": [
            {"id": c["cluster_id"], "frecuencia": c["frecuencia"],
             "categoria": c["categoria"], "lider": c["texto_lider"][:110]}
            for c in clusters[:20]
        ],
    }
    with open(os.path.join(dir_datos, "reporte-fase1.json"), "w", encoding="utf-8") as fh:
        json.dump(reporte, fh, ensure_ascii=False, indent=2)

    volcado_md(os.path.join(dir_datos, "clusters.md"), org, clusters)

    imprimir(reporte)


def volcado_md(ruta: str, org: dict, clusters: list[dict]) -> None:
    """Volcado legible de los clusters, para revisar a ojo antes de la fase 2."""
    with open(ruta, "w", encoding="utf-8") as fh:
        fh.write(f"# Clusters de dudas — {org['codigo']}\n\n")
        fh.write("Salida intermedia de la fase 1. El agrupamiento es lexico: "
                 "junta formulaciones parecidas, todavia no consolida sentido.\n\n")
        por_cat: dict[str, list[dict]] = {}
        for c in clusters:
            por_cat.setdefault(c["categoria"], []).append(c)
        for cat in sorted(por_cat, key=lambda k: -sum(x["frecuencia"] for x in por_cat[k])):
            grupo = por_cat[cat]
            fh.write(f"\n## {cat}  ({len(grupo)} clusters / "
                     f"{sum(c['frecuencia'] for c in grupo)} planteos)\n\n")
            for c in grupo:
                if c["frecuencia"] < 2:
                    continue
                fh.write(f"### {c['cluster_id']} — {c['frecuencia']} planteos "
                         f"({c['autores_distintos']} personas)\n")
                fh.write(f"**{c['texto_lider'].strip()}**\n\n")
                fh.write(f"- términos: {', '.join(c['terminos_clave'])}\n")
                fh.write(f"- período: {c['primera'][:10]} → {c['ultima'][:10]}\n")
                for v in c["variantes"][1:6]:
                    fh.write(f"  - _{v.strip()[:180]}_\n")
                fh.write("\n")
            unicas = [c for c in grupo if c["frecuencia"] == 1]
            if unicas:
                fh.write(f"<details><summary>{len(unicas)} planteos únicos</summary>\n\n")
                for c in unicas:
                    fh.write(f"- `{c['cluster_id']}` {c['texto_lider'].strip()[:200]}\n")
                fh.write("\n</details>\n\n")


def imprimir(r: dict) -> None:
    print("=" * 70)
    print(f"FASE 1 - DETECCION Y CLUSTERING  |  {r['organismo']}")
    print("=" * 70)
    print(f"\nMensajes analizados   : {r['mensajes_analizados']}")
    print(f"Dudas detectadas      : {r['preguntas_detectadas']}")
    for k, v in r["descartes_deteccion"].items():
        print(f"    descartado {k:18s} {v:6d}")
    print(f"\nClusters (dudas unicas): {r['clusters']}"
          f"   [umbral {r['umbral']} / fusion {r['umbral_fusion']}]")
    print("\nTamano de cluster")
    for k in ["1 (unica)", "2-4", "5-9", "10-24", "25+"]:
        if k in r["distribucion_tamano"]:
            print(f"    {k:12s} {r['distribucion_tamano'][k]:5d}")
    print("\nPor categoria (clusters / planteos)")
    for cat, n in r["clusters_por_categoria"].items():
        print(f"    {cat:46s} {n:5d} / {r['preguntas_por_categoria'][cat]:5d}")
    print("\nTop 20 por frecuencia")
    for c in r["top_20"]:
        print(f"    {c['frecuencia']:4d}  [{c['categoria'][:26]:26s}] {c['lider'][:90]}")
    print()


if __name__ == "__main__":
    main()
