#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 2a - Reconstruccion de hilos y candidatos a respuesta.

    python3 scripts/fase2_hilos.py --organismo MPF

El export de WhatsApp no trae el metadato de cita, asi que el hilo se
reconstruye por proximidad (mismo grupo, mensajes siguientes, ventana de
tiempo) y por solapamiento lexico con la duda. Cada candidato queda con su
puntaje y el rol de quien lo escribio; nada se da por respuesta cierta.

Salidas:
  data/<prefijo>/roles.json   autor_hash -> rol (organizacion | referente | participante)
  data/<prefijo>/hilos.json   por cluster, los candidatos a respuesta rankeados
  data/<prefijo>/hilos.md     digest legible para curar la fase 2b
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nlp_es  # noqa: E402
import wa_lib as W  # noqa: E402

VENTANA_MENSAJES = 40
VENTANA_MINUTOS = 90
MAX_CANDIDATOS_POR_DUDA = 6
MAX_CANDIDATOS_POR_CLUSTER = 10

RX_AFIRMATIVA = re.compile(
    r"^\W*(si|sip|sii+|no|nop|exacto|claro|correcto|obvio|tal cual|asi es|"
    r"depende|en realidad|igual|ojo|mira|mira que|te cuento|segun|"
    r"ten[eé]s que|tenes que|hay que|se puede|no se puede|pod[eé]s|puedes|"
    r"debes|deb[eé]s|ten[eé]s|es\b|son\b|era\b|van\b|va\b|entr[aá]|and[aá]|"
    r"fijate|fij[aá]te|primero|cuando|una vez|el|la|los|las|en el|en la)\b",
    re.IGNORECASE,
)
RX_ENLACE_OFICIAL = None  # se arma con el dominio del organismo


def ts(v: str) -> datetime:
    return datetime.fromisoformat(v)


def grupo_de(mid: str) -> str:
    return mid.rsplit("-", 1)[0]


def calcular_roles(org: dict, autores: set[str]) -> dict:
    """Rol por autor. El nombre real solo se usa aca, en local, y no sale al output."""
    roles = {a: "participante" for a in autores}
    ruta = os.path.join(W.RAIZ, "private", org["prefijo_id"], "mapeo-autores.json")
    if os.path.exists(ruta):
        with open(ruta, encoding="utf-8") as fh:
            mapeo = json.load(fh)
        marcadores = [m.lower() for m in org.get("marcadores_rol_organizador", [])]
        for a in mapeo["autores"]:
            nombre = a["nombre_en_export"].lower()
            if any(m in nombre for m in marcadores) and a["autor_hash"] in roles:
                roles[a["autor_hash"]] = "organizacion"
    return roles


def main() -> None:
    ap = argparse.ArgumentParser(description="Fase 2a: hilos y candidatos a respuesta")
    ap.add_argument("--organismo", required=True)
    args = ap.parse_args()

    org = W.cargar_organismo(args.organismo)
    prefijo = org["prefijo_id"]
    dir_datos = os.path.join(W.RAIZ, "data", prefijo)
    msgs = W.leer_jsonl(os.path.join(dir_datos, "mensajes.jsonl"))
    preguntas = W.leer_jsonl(os.path.join(dir_datos, "preguntas.jsonl"))
    with open(os.path.join(dir_datos, "clusters.json"), encoding="utf-8") as fh:
        clusters = json.load(fh)
    lex = nlp_es.Lexico()

    dominios = "|".join(re.escape(d) for d in org.get("dominios_oficiales", []))
    rx_oficial = re.compile(dominios, re.IGNORECASE) if dominios else None

    # --- indice por grupo -------------------------------------------------
    por_grupo: dict[str, list[dict]] = defaultdict(list)
    for m in msgs:
        por_grupo[grupo_de(m["id"])].append(m)
    for g in por_grupo:
        por_grupo[g].sort(key=lambda m: m["timestamp"])
    posicion = {m["id"]: i for g in por_grupo for i, m in enumerate(por_grupo[g])}

    # --- roles ------------------------------------------------------------
    autores = {m["autor_hash"] for m in msgs}
    roles = calcular_roles(org, autores)
    ids_pregunta = {p["id"] for p in preguntas}
    respuestas_por_autor = Counter()
    for m in msgs:
        if m["id"] not in ids_pregunta:
            respuestas_por_autor[m["autor_hash"]] += 1
    for a, n in respuestas_por_autor.items():
        if roles.get(a) == "participante" and n >= 60:
            roles[a] = "referente"
    with open(os.path.join(dir_datos, "roles.json"), "w", encoding="utf-8") as fh:
        json.dump(
            {"roles": roles, "resumen": dict(Counter(roles.values()))},
            fh, ensure_ascii=False, indent=2,
        )

    # --- candidatos a respuesta por duda ----------------------------------
    tokens_pregunta = {p["id"]: set(p["tokens"]) for p in preguntas}

    def candidatos_de(pid: str) -> list[dict]:
        g = grupo_de(pid)
        serie = por_grupo[g]
        i = posicion[pid]
        origen = serie[i]
        t0 = ts(origen["timestamp"])
        toks = tokens_pregunta[pid]
        salida = []
        for j in range(i + 1, min(i + 1 + VENTANA_MENSAJES, len(serie))):
            cand = serie[j]
            if cand["autor_hash"] == origen["autor_hash"]:
                continue
            minutos = (ts(cand["timestamp"]) - t0).total_seconds() / 60
            if minutos > VENTANA_MINUTOS:
                break
            texto = cand["texto"]
            if len(texto) < 8:
                continue
            fuertes, _ = lex.senales_de_duda(texto)
            afirmativa = bool(RX_AFIRMATIVA.match(texto))
            if fuertes and not afirmativa:
                continue  # es otra duda, no una respuesta

            ctoks = set(lex.tokenizar(texto))
            solape = len(toks & ctoks) / max(1, len(toks))
            distancia = j - i
            puntaje = 4.0 * solape
            puntaje += 3.0 if distancia == 1 else 2.0 if distancia <= 3 else 1.0 if distancia <= 8 else 0.0
            puntaje -= min(1.5, minutos / 60)
            if roles.get(cand["autor_hash"]) == "organizacion":
                puntaje += 1.5
            elif roles.get(cand["autor_hash"]) == "referente":
                puntaje += 0.6
            if afirmativa:
                puntaje += 0.8
            if rx_oficial and rx_oficial.search(texto):
                puntaje += 0.8
            if len(texto) > 40:
                puntaje += 0.3
            if puntaje <= 0.9:
                continue
            salida.append(
                {
                    "id": cand["id"],
                    "texto": texto,
                    "autor_hash": cand["autor_hash"],
                    "rol": roles.get(cand["autor_hash"], "participante"),
                    "puntaje": round(puntaje, 2),
                    "distancia": distancia,
                    "minutos": round(minutos, 1),
                    "responde_a": pid,
                }
            )
        salida.sort(key=lambda c: -c["puntaje"])
        return salida[:MAX_CANDIDATOS_POR_DUDA]

    hilos = []
    sin_respuesta = 0
    for c in clusters:
        acumulado: dict[str, dict] = {}
        for pid in c["mensajes"]:
            for cand in candidatos_de(pid):
                clave = W.normalizar(cand["texto"])[:120]
                previo = acumulado.get(clave)
                if previo is None or cand["puntaje"] > previo["puntaje"]:
                    acumulado[clave] = cand
                else:
                    previo["puntaje"] = round(previo["puntaje"] + 0.4, 2)
        ranked = sorted(acumulado.values(), key=lambda x: -x["puntaje"])[:MAX_CANDIDATOS_POR_CLUSTER]
        if not ranked:
            sin_respuesta += 1
        hilos.append(
            {
                "cluster_id": c["cluster_id"],
                "categoria": c["categoria"],
                "frecuencia": c["frecuencia"],
                "autores_distintos": c["autores_distintos"],
                "primera": c["primera"],
                "ultima": c["ultima"],
                "texto_lider": c["texto_lider"],
                "variantes": c["variantes"],
                "mensajes": c["mensajes"],
                "terminos_clave": c["terminos_clave"],
                "candidatos": ranked,
                "roles_respondieron": sorted({r["rol"] for r in ranked}),
            }
        )

    with open(os.path.join(dir_datos, "hilos.json"), "w", encoding="utf-8") as fh:
        json.dump(hilos, fh, ensure_ascii=False, indent=2)

    escribir_digest(os.path.join(dir_datos, "hilos.md"), org, hilos)

    reporte = {
        "organismo": org["codigo"],
        "clusters": len(hilos),
        "clusters_sin_candidatos": sin_respuesta,
        "clusters_con_respuesta_organizacion": sum(
            1 for h in hilos if "organizacion" in h["roles_respondieron"]
        ),
        "roles": dict(Counter(roles.values())),
    }
    with open(os.path.join(dir_datos, "reporte-fase2a.json"), "w", encoding="utf-8") as fh:
        json.dump(reporte, fh, ensure_ascii=False, indent=2)

    print("=" * 70)
    print(f"FASE 2a - HILOS Y CANDIDATOS A RESPUESTA  |  {org['codigo']}")
    print("=" * 70)
    print(f"\nClusters                         : {reporte['clusters']}")
    print(f"Sin ningun candidato a respuesta : {reporte['clusters_sin_candidatos']}")
    print(f"Con respuesta de la organizacion : {reporte['clusters_con_respuesta_organizacion']}")
    print(f"\nRoles: {reporte['roles']}")
    conf = Counter()
    for h in hilos:
        if not h["candidatos"]:
            conf["sin respuesta"] += 1
        elif "organizacion" in h["roles_respondieron"]:
            conf["responde la organizacion"] += 1
        elif "referente" in h["roles_respondieron"]:
            conf["responde un referente"] += 1
        else:
            conf["responde un participante"] += 1
    print("\nCobertura de respuesta por cluster")
    for k, v in conf.most_common():
        print(f"    {k:28s} {v:5d}")
    print()


def escribir_digest(ruta: str, org: dict, hilos: list[dict]) -> None:
    with open(ruta, "w", encoding="utf-8") as fh:
        fh.write(f"# Hilos y candidatos a respuesta — {org['codigo']}\n\n")
        fh.write("Salida intermedia de la fase 2a. Los candidatos están rankeados por "
                 "proximidad en el hilo, solapamiento léxico y rol de quien respondió. "
                 "Ninguno está validado todavía.\n\n")
        por_cat: dict[str, list[dict]] = {}
        for h in hilos:
            por_cat.setdefault(h["categoria"], []).append(h)
        for cat in sorted(por_cat, key=lambda k: -sum(x["frecuencia"] for x in por_cat[k])):
            fh.write(f"\n## {cat}\n\n")
            for h in sorted(por_cat[cat], key=lambda x: -x["frecuencia"]):
                if h["frecuencia"] < 2 and not h["candidatos"]:
                    continue
                fh.write(f"### {h['cluster_id']} · {h['frecuencia']} planteos · "
                         f"{h['autores_distintos']} personas · {h['primera'][:10]}→{h['ultima'][:10]}\n")
                fh.write(f"P: {h['texto_lider'].strip()[:220]}\n")
                for v in h["variantes"][1:4]:
                    fh.write(f"   ~ {v.strip()[:160]}\n")
                if not h["candidatos"]:
                    fh.write("R: (sin candidatos)\n\n")
                    continue
                for c in h["candidatos"][:6]:
                    fh.write(f"R[{c['puntaje']:.1f} {c['rol'][:4]}] {c['texto'].strip()[:260]}\n")
                fh.write("\n")


if __name__ == "__main__":
    main()
