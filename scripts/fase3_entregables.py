#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 3 - Entregables.

    python3 scripts/fase3_entregables.py --organismo MPF

Toma la curacion escrita a mano en curacion/<prefijo>-*.json (fase 2b) y la
cruza contra los datos de las fases 0 a 2 para emitir los entregables.

El script NO redacta: valida y ensambla. Concretamente:
  - comprueba que cada cluster citado exista;
  - comprueba que cada fragmento de "respaldo" aparezca textualmente en algun
    mensaje del chat, y falla si no. Es la garantia de que ninguna respuesta
    publicada se apoya en algo que no se dijo en el grupo;
  - calcula la frecuencia real y las variantes desde los clusters;
  - resuelve mensajes_fuente a partir de los fragmentos de respaldo.

Salidas: output/<prefijo>-faq.json, <prefijo>-faq.md, verificar.md, informe.md
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nlp_es  # noqa: E402
import wa_lib as W  # noqa: E402

CAMPOS = [
    "id", "organismo", "categoria", "pregunta_canonica", "variantes", "frecuencia",
    "respuesta", "confianza", "motivo_confianza", "respuestas_contradictorias",
    "vigencia", "mensajes_fuente",
]
CONFIANZAS = {"alta", "media", "requiere_verificacion"}
VIGENCIAS = {"permanente", "atada_a_convocatoria", "requiere_verificacion"}
ORDEN_CATEGORIAS = [
    "inscripción y trámite",
    "requisitos y documentación",
    "empadronamiento",
    "plataforma y problemas técnicos",
    "temario y material de estudio",
    "formato y modalidad del examen",
    "fechas, sede y logística",
    "resultados y orden de mérito",
    "después del examen",
    "vigencia de notas y exámenes anteriores",
    "dudas generales sobre el ingreso democrático",
]


def clave(texto: str) -> str:
    t = W.limpiar_invisibles(texto).lower()
    t = "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", t).strip()


def plural(n: int, palabra: str) -> str:
    return f"{n} {palabra}" if n == 1 else f"{n} {palabra}s"


def una_linea(texto: str, tope: int = 190) -> str:
    t = re.sub(r"\s+", " ", texto).strip()
    return t if len(t) <= tope else t[: tope - 1].rstrip() + "…"


def main() -> None:
    ap = argparse.ArgumentParser(description="Fase 3: entregables")
    ap.add_argument("--organismo", required=True)
    args = ap.parse_args()

    org = W.cargar_organismo(args.organismo)
    prefijo = org["prefijo_id"]
    dir_datos = os.path.join(W.RAIZ, "data", prefijo)
    dir_out = os.path.join(W.RAIZ, "output")
    os.makedirs(dir_out, exist_ok=True)

    mensajes = W.leer_jsonl(os.path.join(dir_datos, "mensajes.jsonl"))
    with open(os.path.join(dir_datos, "clusters.json"), encoding="utf-8") as fh:
        clusters = {c["cluster_id"]: c for c in json.load(fh)}
    with open(os.path.join(dir_datos, "hilos.json"), encoding="utf-8") as fh:
        hilos = {h["cluster_id"]: h for h in json.load(fh)}

    indice = [(clave(m["texto"]), m["id"]) for m in mensajes]
    lex = nlp_es.Lexico()

    rutas = sorted(glob.glob(os.path.join(W.RAIZ, "curacion", f"{prefijo}-*.json")))
    if not rutas:
        raise SystemExit(f"No hay curacion en curacion/{prefijo}-*.json")
    curadas: list[dict] = []
    for r in rutas:
        with open(r, encoding="utf-8") as fh:
            curadas.extend(json.load(fh))

    errores: list[str] = []
    vistos: set[str] = set()
    faq: list[dict] = []

    for e in curadas:
        eid = e.get("id", "?")
        if eid in vistos:
            errores.append(f"{eid}: id duplicado")
        vistos.add(eid)
        if e.get("confianza") not in CONFIANZAS:
            errores.append(f"{eid}: confianza invalida ({e.get('confianza')})")
        if e.get("vigencia") not in VIGENCIAS:
            errores.append(f"{eid}: vigencia invalida ({e.get('vigencia')})")
        if e.get("respuesta", "").strip() and e["confianza"] == "requiere_verificacion" \
                and not e.get("motivo_confianza"):
            errores.append(f"{eid}: falta motivo_confianza")
        if not e.get("respuesta", "").strip() and e["confianza"] != "requiere_verificacion":
            errores.append(f"{eid}: respuesta vacia deberia ser requiere_verificacion")

        # clusters -> frecuencia y variantes reales
        ids_pregunta: list[str] = []
        textos: list[str] = []
        for cid in e.get("clusters", []):
            c = clusters.get(cid)
            if c is None:
                errores.append(f"{eid}: cluster inexistente {cid}")
                continue
            ids_pregunta.extend(c["mensajes"])
            textos.extend(c["variantes"])
        ids_pregunta = list(dict.fromkeys(ids_pregunta))

        # Las variantes se eligen por cercania a la pregunta canonica, no por
        # orden de cluster: al fusionar varios clusters en una entrada, el
        # listado crudo mezcla planteos de temas vecinos.
        objetivo = set(lex.tokenizar(e["pregunta_canonica"]))
        candidatas: list[tuple[float, str]] = []
        vistas: set[str] = set()
        for t in textos:
            k = clave(t)[:80]
            if not k or k in vistas:
                continue
            vistas.add(k)
            toks = set(lex.tokenizar(t))
            if not toks:
                continue
            solape = len(objetivo & toks) / max(1, len(objetivo))
            if "?" in t:
                solape += 0.12
            if len(t) > 260:
                solape -= 0.15
            candidatas.append((solape, una_linea(t)))
        candidatas.sort(key=lambda c: -c[0])
        variantes = [t for s_, t in candidatas if s_ > 0.05][:6]

        # respaldo -> mensajes_fuente verificados
        ids_respuesta: list[str] = []
        for frag in e.get("respaldo", []):
            k = clave(frag)
            encontrados = [mid for texto, mid in indice if k in texto]
            if not encontrados:
                errores.append(f"{eid}: respaldo sin correspondencia en el chat -> {frag[:70]!r}")
                continue
            ids_respuesta.extend(encontrados[:2])
        ids_respuesta = list(dict.fromkeys(ids_respuesta))

        if e.get("respuesta", "").strip() and not ids_respuesta:
            errores.append(f"{eid}: tiene respuesta pero ningun mensaje de respaldo")

        fuente = ids_respuesta[:8] + [i for i in ids_pregunta if i not in ids_respuesta][:6]

        faq.append({
            "id": eid,
            "organismo": org["codigo"],
            "categoria": e["categoria"],
            "pregunta_canonica": e["pregunta_canonica"],
            "variantes": variantes,
            "frecuencia": len(ids_pregunta),
            "respuesta": e.get("respuesta", "").strip(),
            "confianza": e["confianza"],
            "motivo_confianza": e.get("motivo_confianza", ""),
            "respuestas_contradictorias": e.get("respuestas_contradictorias", []),
            "vigencia": e["vigencia"],
            "mensajes_fuente": fuente,
            "_clusters": e.get("clusters", []),
            "_personas": len({m["autor_hash"] for m in mensajes if m["id"] in set(ids_pregunta)}),
        })

    if errores:
        print("VALIDACION FALLIDA:\n")
        for x in errores:
            print("  -", x)
        raise SystemExit(1)

    faq.sort(key=lambda e: (ORDEN_CATEGORIAS.index(e["categoria"])
                            if e["categoria"] in ORDEN_CATEGORIAS else 99,
                            -e["frecuencia"]))

    publicable = [{k: v for k, v in e.items() if not k.startswith("_")} for e in faq]
    with open(os.path.join(dir_out, f"{prefijo}-faq.json"), "w", encoding="utf-8") as fh:
        json.dump(publicable, fh, ensure_ascii=False, indent=2)

    escribir_md(os.path.join(dir_out, f"{prefijo}-faq.md"), org, faq)
    escribir_verificar(os.path.join(dir_out, "verificar.md"), org, faq)
    escribir_informe(os.path.join(dir_out, "informe.md"), org, faq, clusters, hilos, mensajes)

    conf = Counter(e["confianza"] for e in faq)
    print("=" * 70)
    print(f"FASE 3 - ENTREGABLES  |  {org['codigo']}")
    print("=" * 70)
    print(f"\nEntradas publicadas : {len(faq)}")
    print(f"Planteos cubiertos  : {sum(e['frecuencia'] for e in faq)}")
    print(f"Clusters usados     : {len({c for e in faq for c in e['_clusters']})} de {len(clusters)}")
    print("\nConfianza")
    for k in ["alta", "media", "requiere_verificacion"]:
        print(f"    {k:22s} {conf.get(k, 0):4d}")
    print(f"\nSin respuesta (huecos): {sum(1 for e in faq if not e['respuesta'])}")
    print(f"Con contradicciones   : {sum(1 for e in faq if e['respuestas_contradictorias'])}")
    print(f"\nArchivos en output/: {prefijo}-faq.json, {prefijo}-faq.md, verificar.md, informe.md\n")


def por_categoria(faq: list[dict]) -> dict[str, list[dict]]:
    d: dict[str, list[dict]] = defaultdict(list)
    for e in faq:
        d[e["categoria"]].append(e)
    return d


BADGE = {"alta": "confianza alta", "media": "confianza media",
         "requiere_verificacion": "REQUIERE VERIFICACIÓN"}


def escribir_md(ruta: str, org: dict, faq: list[dict]) -> None:
    with open(ruta, "w", encoding="utf-8") as fh:
        fh.write(f"# Preguntas frecuentes — Ingreso democrático {org['codigo']}\n\n")
        fh.write(f"_{org['nombre']}_\n\n")
        fh.write("Base construida a partir de las consultas reales de la mesa de ayuda del "
                 "examen. Todo lo que sigue sale de ese intercambio: nada fue completado con "
                 "información externa. Las entradas marcadas **REQUIERE VERIFICACIÓN** no "
                 "deberían publicarse sin contrastarlas contra el reglamento y la "
                 "convocatoria vigente.\n\n")
        fh.write("Dentro de cada categoría, las preguntas van ordenadas por cuántas veces "
                 "se plantearon en el chat.\n\n---\n")
        for cat in ORDEN_CATEGORIAS:
            grupo = [e for e in faq if e["categoria"] == cat]
            if not grupo:
                continue
            fh.write(f"\n## {cat.capitalize()}\n")
            for e in grupo:
                fh.write(f"\n### {e['pregunta_canonica']}\n\n")
                marcas = [f"`{e['id']}`", plural(e["frecuencia"], "consulta"),
                          plural(e["_personas"], "persona"), BADGE[e["confianza"]]]
                if e["vigencia"] == "atada_a_convocatoria":
                    marcas.append("atada a la convocatoria")
                fh.write("<sub>" + " · ".join(marcas) + "</sub>\n\n")
                if e["respuesta"]:
                    fh.write(e["respuesta"] + "\n\n")
                else:
                    fh.write("> **Sin respuesta en el chat.** "
                             + e["motivo_confianza"] + "\n\n")
                if e["respuestas_contradictorias"]:
                    fh.write("**En el chat se respondió de formas incompatibles:**\n\n")
                    for r in e["respuestas_contradictorias"]:
                        fh.write(f"- {r}\n")
                    fh.write("\n")
                if e["respuesta"] and e["confianza"] != "alta":
                    fh.write(f"<sub>_{e['motivo_confianza']}_</sub>\n\n")
                if e["variantes"]:
                    fh.write("<details><summary>Cómo se preguntó en el chat</summary>\n\n")
                    for v in e["variantes"]:
                        fh.write(f"- _{v}_\n")
                    fh.write("\n</details>\n\n")
            fh.write("\n---\n")


def escribir_verificar(ruta: str, org: dict, faq: list[dict]) -> None:
    pendientes = [e for e in faq if e["confianza"] == "requiere_verificacion"]
    contradic = [e for e in pendientes if e["respuestas_contradictorias"]]
    sin_resp = [e for e in pendientes if not e["respuesta"] and e not in contradic]
    convocatoria = [e for e in faq if e["vigencia"] == "atada_a_convocatoria"]
    resto = [e for e in pendientes if e not in sin_resp and e not in contradic]

    with open(ruta, "w", encoding="utf-8") as fh:
        fh.write(f"# A verificar antes de publicar — {org['codigo']}\n\n")
        fh.write(f"{len(pendientes)} de {len(faq)} entradas necesitan un chequeo contra el "
                 "reglamento del ingreso democrático y la convocatoria vigente. "
                 "Están agrupadas por qué tipo de chequeo requieren.\n")

        fh.write(f"\n## 1. Respuestas incompatibles entre sí ({len(contradic)})\n\n")
        fh.write("Hubo dos o más respuestas que no pueden ser ciertas al mismo tiempo. "
                 "Hay que decidir cuál vale.\n\n")
        for e in sorted(contradic, key=lambda x: -x["frecuencia"]):
            fh.write(f"- **{e['pregunta_canonica']}** `{e['id']}` "
                     f"({plural(e['frecuencia'], 'consulta')})\n")
            for r in e["respuestas_contradictorias"]:
                fh.write(f"  - {r}\n")

        fh.write(f"\n## 2. Nadie respondió en el chat ({len(sin_resp)})\n\n")
        fh.write("Preguntas reales que quedaron sin contestar. Son los huecos a cubrir "
                 "con información oficial.\n\n")
        for e in sorted(sin_resp, key=lambda x: -x["frecuencia"]):
            fh.write(f"- **{e['pregunta_canonica']}** `{e['id']}` "
                     f"({plural(e['frecuencia'], 'consulta')}) — {e['motivo_confianza']}\n")

        fh.write(f"\n## 3. Respuesta única o sin respaldo claro ({len(resto)})\n\n")
        for e in sorted(resto, key=lambda x: -x["frecuencia"]):
            fh.write(f"- **{e['pregunta_canonica']}** `{e['id']}` "
                     f"({plural(e['frecuencia'], 'consulta')}) — {e['motivo_confianza']}\n")

        fh.write(f"\n## 4. Atadas a la convocatoria: caducan ({len(convocatoria)})\n\n")
        fh.write("Fechas, cupos, jurisdicciones y montos. Hay que revisarlas en cada "
                 "llamado nuevo o marcarlas con la convocatoria a la que corresponden.\n\n")
        for e in sorted(convocatoria, key=lambda x: -x["frecuencia"]):
            fh.write(f"- **{e['pregunta_canonica']}** `{e['id']}`\n")

        fh.write("\n## 5. Decisiones editoriales pendientes\n\n")
        fh.write("- Los enlaces a la carpeta de Drive de la agrupación y a sus redes "
                 "aparecen citados como fuente de material de estudio. Definir si se "
                 "publican en el sitio o si sólo se remite al apartado de documentos "
                 "del organismo.\n")
        fh.write("- El teléfono de soporte para problemas de acceso al campus circuló "
                 "en el chat y fue removido al anonimizar. Reponerlo desde la fuente "
                 "oficial si se lo quiere publicar.\n")


def escribir_informe(ruta: str, org: dict, faq: list[dict], clusters: dict,
                     hilos: dict, mensajes: list[dict]) -> None:
    cats = por_categoria(faq)
    total_planteos = sum(e["frecuencia"] for e in faq)
    top = sorted(faq, key=lambda e: -e["frecuencia"])[:15]
    contradic = [e for e in faq if e["respuestas_contradictorias"]]
    sin_resp = [e for e in faq if not e["respuesta"] and e not in contradic]
    usados = {c for e in faq for c in e["_clusters"]}
    huerfanos = [h for cid, h in hilos.items()
                 if cid not in usados and h["frecuencia"] >= 3]

    with open(ruta, "w", encoding="utf-8") as fh:
        fh.write(f"# Informe de extracción — {org['codigo']}\n\n")
        fh.write(f"_{org['nombre']}_\n\n")
        fh.write("## Resumen\n\n")
        fh.write(f"- **{len(faq)} dudas únicas** consolidadas y listas para la web.\n")
        fh.write(f"- Cubren **{total_planteos} planteos** del chat "
                 f"({len(usados)} clusters de la fase 1).\n")
        fh.write(f"- **{len(mensajes)} mensajes** útiles analizados.\n")
        conf = Counter(e["confianza"] for e in faq)
        fh.write(f"- Confianza: {conf.get('alta',0)} alta, {conf.get('media',0)} media, "
                 f"{conf.get('requiere_verificacion',0)} requiere verificación.\n")
        fh.write(f"- **{len(sin_resp)} preguntas quedaron sin ninguna respuesta** en el chat.\n")
        fh.write(f"- **{len(contradic)} recibieron respuestas incompatibles** entre sí, "
                 "sin que ninguna quedara zanjada.\n")
        fh.write(f"- **{sum(1 for e in faq if e['vigencia']=='atada_a_convocatoria')} "
                 "caducan** con la convocatoria.\n")

        fh.write("\n## Top 15 por frecuencia\n\n")
        fh.write("| # | Consultas | Personas | Categoría | Pregunta |\n")
        fh.write("|---|---|---|---|---|\n")
        for i, e in enumerate(top, 1):
            fh.write(f"| {i} | {e['frecuencia']} | {e['_personas']} | {e['categoria']} "
                     f"| {e['pregunta_canonica']} |\n")

        fh.write("\n## Dónde se concentran las consultas\n\n")
        fh.write("| Categoría | Dudas | Planteos | % |\n|---|---|---|---|\n")
        for cat in sorted(cats, key=lambda c: -sum(e["frecuencia"] for e in cats[c])):
            n = sum(e["frecuencia"] for e in cats[cat])
            fh.write(f"| {cat} | {len(cats[cat])} | {n} | "
                     f"{n*100//max(1,total_planteos)}% |\n")

        fh.write("\n## Qué preguntaron y nadie respondió\n\n")
        for e in sorted(sin_resp, key=lambda x: -x["frecuencia"]):
            fh.write(f"- **{e['pregunta_canonica']}** — {plural(e['frecuencia'], 'consulta')}, "
                     f"{plural(e['_personas'], 'persona')}. {e['motivo_confianza']}\n")

        fh.write("\n## Qué se respondió de formas incompatibles\n\n")
        fh.write("Hubo respuesta, pero más de una y contradictorias entre sí. Son las que "
                 "más conviene resolver: la gente se llevó del chat versiones opuestas.\n\n")
        for e in sorted(contradic, key=lambda x: -x["frecuencia"]):
            fh.write(f"- **{e['pregunta_canonica']}** — {plural(e['frecuencia'], 'consulta')}, "
                     f"{plural(e['_personas'], 'persona')}. {e['motivo_confianza']}\n")

        if huerfanos:
            fh.write("\n## Clusters frecuentes que no entraron a la FAQ\n\n")
            fh.write("Agrupaciones de la fase 1 con 3 o más planteos que no se "
                     "consolidaron en ninguna entrada: en general son fragmentos de hilo "
                     "sin contexto suficiente, coordinación entre participantes o "
                     "discusión sobre respuestas puntuales del examen. Se listan para "
                     "que se pueda revisar si falta algo.\n\n")
            for h in sorted(huerfanos, key=lambda x: -x["frecuencia"])[:25]:
                fh.write(f"- `{h['cluster_id']}` ({h['frecuencia']}) "
                         f"{una_linea(h['texto_lider'], 110)}\n")


if __name__ == "__main__":
    main()
