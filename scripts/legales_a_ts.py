#!/usr/bin/env python3
"""Convierte los textos legales de markdown a contenido tipado.

Los .md de content/legales/ son la fuente: llegaron redactados y no se tocan.
Retipearlos en un .ts sería la forma más rápida de que en algún momento el
sitio publique algo que el texto legal no dice, así que se generan.

`tests/legales.test.ts` vuelve a correr esto en memoria y compara: si alguien
edita el .ts a mano, o edita el .md y no regenera, el test falla.

Uso:
    python3 scripts/legales_a_ts.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ORIGEN = Path("content/legales")
DESTINO = Path("content/legales.generado.ts")

DOCS = [
    ("terminos", "terminos-y-condiciones.md"),
    ("privacidad", "politica-de-privacidad.md"),
]


def parsear(md: str) -> dict:
    """Markdown a bloques. Sólo el subconjunto que usan estos dos documentos."""
    titulo = ""
    actualizado = ""
    firma: list[str] = []
    bloques: list[dict] = []
    actual: dict | None = None
    parrafo: list[str] = []
    lista: list[str] = []
    tras_regla = False

    def cerrar_parrafo():
        nonlocal parrafo
        if parrafo and actual is not None:
            actual["p"].append(" ".join(parrafo).strip())
        parrafo = []

    def cerrar_lista():
        nonlocal lista
        if lista and actual is not None:
            actual.setdefault("lista", []).extend(lista)
        lista = []

    def cerrar_bloque():
        nonlocal actual
        cerrar_parrafo()
        cerrar_lista()
        if actual is not None:
            bloques.append(actual)
        actual = None

    for linea in md.splitlines():
        cruda, linea = linea, linea.strip()

        if linea == "---":
            # La regla cierra la sección en curso: lo que sigue ya no le
            # pertenece. Sin esto la firma del final quedaba pegada al último
            # párrafo de «Contacto».
            cerrar_bloque()
            tras_regla = True
            continue

        if not linea:
            cerrar_parrafo()
            cerrar_lista()
            continue

        if linea.startswith("# "):
            titulo = linea[2:].strip()
            continue

        if linea.startswith("## "):
            cerrar_bloque()
            actual = {"h": linea[3:].strip(), "p": []}
            continue

        if linea.startswith("- "):
            cerrar_parrafo()
            # Tal cual: el «;» del final es parte de la redacción.
            lista.append(linea[2:].strip())
            continue

        # La fecha de actualización es el primer párrafo en negrita del documento.
        if not bloques and actual is None and linea.startswith("**") and not actualizado:
            actualizado = linea.strip("*").strip()
            continue

        # Después de la última regla horizontal viene la firma.
        if tras_regla and actual is None:
            firma.append(linea.strip("*").strip())
            continue

        if actual is None:
            actual = {"h": "", "p": []}
        parrafo.append(linea)

    cerrar_bloque()
    # El bloque sin encabezado del principio es la entradilla.
    entradilla = []
    if bloques and not bloques[0]["h"]:
        entradilla = bloques.pop(0)["p"]

    return {
        "titulo": titulo,
        "actualizado": actualizado,
        "entradilla": entradilla,
        "bloques": bloques,
        "firma": firma,
    }


def a_ts(nombre: str, doc: dict) -> str:
    return f"export const {nombre} = {json.dumps(doc, ensure_ascii=False, indent=2)} as const;\n"


def generar() -> str:
    partes = [
        "// GENERADO POR scripts/legales_a_ts.py — NO EDITAR A MANO.\n"
        "//\n"
        "// La fuente son los .md de content/legales/, que llegaron redactados y no\n"
        "// se tocan. Para cambiar un texto se edita el .md y se vuelve a correr:\n"
        "//\n"
        "//     python3 scripts/legales_a_ts.py\n"
        "//\n"
        "// tests/legales.test.ts compara este archivo contra los .md y falla si se\n"
        "// separaron.\n"
    ]
    for nombre, archivo in DOCS:
        doc = parsear((ORIGEN / archivo).read_text(encoding="utf-8"))
        partes.append(a_ts(nombre, doc))
    return "\n".join(partes)


if __name__ == "__main__":
    DESTINO.write_text(generar(), encoding="utf-8")
    print(f"escrito {DESTINO}")
    for nombre, archivo in DOCS:
        d = parsear((ORIGEN / archivo).read_text(encoding="utf-8"))
        listas = sum(1 for b in d["bloques"] if "lista" in b)
        print(f"  {nombre:12} «{d['titulo'][:38]}» · {len(d['bloques'])} bloques"
              f" · {listas} con lista · {d['actualizado']}")
