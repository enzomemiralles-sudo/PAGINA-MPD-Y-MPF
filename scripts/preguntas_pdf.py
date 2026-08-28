#!/usr/bin/env python3
"""Convierte los pregunteros en PDF a JSON cargable.

La respuesta correcta no está escrita en ninguno de los documentos de Nexo. Está
marcada visualmente, y de dos maneras distintas según el archivo:

- **Resaltada**: un rectángulo verde dibujado detrás del renglón. El parser no
  busca una marca textual —no hay— sino la superposición geométrica entre cada
  línea y esos rectángulos.
- **En verde**: el texto de la opción correcta va en color, no en negro.

En los dos casos la señal se puede verificar: cada pregunta tiene que terminar
con exactamente tres opciones y una sola marcada.

Cada documento arma la pregunta distinto, y por eso hay tres lectores:

- `mpf-preguntero-nexo.pdf`: enunciado en negrita, sin numerar, resaltado.
- `mpf-modelos-manual.pdf`: enunciado numerado en su propio renglón, sin
  negrita, resaltado, y el archivo trae dos secciones.
- `mpd-guia-preguntas.pdf`: enunciado numerado en negrita cursiva, correcta en
  verde.

Uso:
    python3 scripts/preguntas_pdf.py
"""
from __future__ import annotations

import difflib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

try:
    import pymupdf
except ImportError:  # pragma: no cover
    sys.exit("Falta pymupdf: pip install pymupdf")

CRUDO = Path("material/preguntas/crudo")
DESTINO = Path("material/preguntas/json")

# Los verdes de resaltado que aparecen entre los documentos de Nexo. Son dos
# tonos distintos porque los archivos se escribieron en momentos distintos.
VERDES = [(0.4157, 0.6588, 0.3098), (0.576, 0.765, 0.49), (0.576, 0.769, 0.49)]
TOLERANCIA_COLOR = 0.03

# El verde con el que la guía del MPD escribe la opción correcta.
VERDE_TEXTO = 0x4AA921

# Un renglón de continuación cae a ~14.5 pt del anterior; entre bloques hay más.
# Hace falta porque la negrita sola miente: en el preguntero hay un renglón de
# opción que quedó en negrita por error y abriría una pregunta fantasma.
SALTO_DE_BLOQUE = 20

NUMERO = re.compile(r"^(\d{1,3})\s*[.)]\s*(.*)$")
OPCION = re.compile(r"^([abc]|i{1,3}|iv)\s*[.)]\s*(.*)$", re.I)
SECCION = re.compile(r"MODELOS? DE EXAMEN.*PARTE\s+(PR[AÁ]CTICA|TE[OÓ]RICA)", re.I)
ROMANOS = ("i", "ii", "iii", "iv")


def es_verde(fill) -> bool:
    return bool(fill) and any(
        all(abs(a - b) < TOLERANCIA_COLOR for a, b in zip(fill, v)) for v in VERDES
    )


def limpiar(t: str) -> str:
    return re.sub(r"\s+", " ", t.replace("​", " ").replace("\xa0", " ")).strip()


def renglones(ruta: Path):
    """Cada renglón del PDF con su texto, si está en negrita y si está resaltado."""
    doc = pymupdf.open(ruta)
    for pag in doc:
        marcas = [d["rect"] for d in pag.get_drawings() if es_verde(d.get("fill"))]
        for bloque in pag.get_text("dict")["blocks"]:
            for linea in bloque.get("lines", []):
                texto = limpiar("".join(s["text"] for s in linea["spans"]))
                if not texto:
                    continue
                x0, y0, x1, y1 = linea["bbox"]
                cy = (y0 + y1) / 2
                # Resaltada si el centro del renglón cae dentro de un rectángulo
                # y comparten más de la mitad del ancho del renglón.
                resaltada = any(
                    r.y0 - 2 <= cy <= r.y1 + 2
                    and min(x1, r.x1) - max(x0, r.x0) > (x1 - x0) * 0.5
                    for r in marcas
                )
                yield {
                    "texto": texto,
                    "negrita": any(
                        s["flags"] & 16 or "bold" in s["font"].lower() for s in linea["spans"]
                    ),
                    "cursiva": any("Italic" in s["font"] for s in linea["spans"]),
                    "verde": any(
                        s["color"] == VERDE_TEXTO for s in linea["spans"] if s["text"].strip()
                    ),
                    "resaltada": resaltada,
                    "pagina": pag.number + 1,
                    "y": y0,
                }
    doc.close()


class Armador:
    """Va juntando renglones sueltos en preguntas con sus opciones."""

    def __init__(self):
        self.preguntas: list[dict] = []
        self.actual: dict | None = None
        self.opcion: dict | None = None

    def abrir(self, **campos):
        self.cerrar_pregunta()
        self.actual = {"opciones": [], "estilo": None, **campos}

    def cerrar_opcion(self):
        if self.actual and self.opcion and self.opcion["texto"]:
            self.actual["opciones"].append(self.opcion)
        self.opcion = None

    def cerrar_pregunta(self):
        self.cerrar_opcion()
        if self.actual and self.actual["opciones"]:
            self.preguntas.append(self.actual)
        self.actual = None

    def opcion_nueva(self, letra, texto, resaltada):
        self.cerrar_opcion()
        self.opcion = {"letra": letra.lower(), "texto": texto.strip(),
                       "resaltada": resaltada and bool(texto.strip())}

    def seguir(self, texto, resaltada):
        if self.opcion is not None:
            self.opcion["texto"] = (self.opcion["texto"] + " " + texto).strip()
            self.opcion["resaltada"] = self.opcion["resaltada"] or resaltada
        elif self.actual is not None:
            self.actual["enunciado"] = (self.actual["enunciado"] + " " + texto).strip()

    def marcador_valido(self, m, texto):
        """¿Este "a)" / "i)" abre una opción, o es basura del original?

        Una pregunta usa un solo estilo de viñeta. Pero el original mezcla: hay
        preguntas con a) i) ii) que son tres opciones de verdad, y hay un "i)"
        suelto en medio de una opción. Lo que las separa es si la opción en
        curso venía cortada a mitad de oración.
        """
        estilo = "romano" if m.group(1).lower() in ROMANOS else "latino"
        if self.actual["estilo"] is None:
            self.actual["estilo"] = estilo
            return True, texto
        if estilo != self.actual["estilo"] and self.opcion and not self.opcion[
            "texto"
        ].rstrip().endswith((".", "?", "!", ":")):
            return False, OPCION.sub(r"\2", texto, count=1).strip()
        return True, texto


def leer_preguntero(ruta: Path) -> list[dict]:
    """Enunciados en negrita, sin numerar, con una sección PRÁCTICO al final."""
    a = Armador()
    seccion = "teorico"
    anterior = None
    for ln in renglones(ruta):
        t = ln["texto"]
        if t in ("NEXO MPF", "PREGUNTERO"):
            anterior = ln
            continue
        if t == "PRÁCTICO":
            a.cerrar_pregunta()
            seccion = "practico"
            anterior = ln
            continue

        m = OPCION.match(t)
        separado = (
            anterior is None
            or ln["pagina"] != anterior["pagina"]
            or ln["y"] - anterior["y"] >= SALTO_DE_BLOQUE
        )
        if ln["negrita"] and not m and (separado or a.actual is None or not a.actual["opciones"]):
            if a.actual is not None and a.actual["opciones"] and separado:
                a.abrir(enunciado=t, seccion=seccion, pagina=ln["pagina"])
            elif a.actual is None:
                a.abrir(enunciado=t, seccion=seccion, pagina=ln["pagina"])
            else:
                a.actual["enunciado"] += " " + t     # enunciado de varios renglones
            anterior = ln
            continue

        if a.actual is not None:
            if m:
                ok, t = a.marcador_valido(m, t)
                if ok:
                    a.opcion_nueva(m.group(1), m.group(2), ln["resaltada"])
                else:
                    a.seguir(t, ln["resaltada"])
            else:
                a.seguir(t, ln["resaltada"])
        anterior = ln

    a.cerrar_pregunta()
    return a.preguntas


def leer_manual(ruta: Path) -> list[dict]:
    """Enunciados numerados, dos secciones declaradas por un título."""
    a = Armador()
    seccion = "practico"
    for ln in renglones(ruta):
        t = ln["texto"]
        s = SECCION.search(t)
        if s:
            a.cerrar_pregunta()
            seccion = "practico" if s.group(1).upper().startswith("PR") else "teorico"
            continue

        mn, mo = NUMERO.match(t), OPCION.match(t)
        if mn and not mo:
            a.abrir(numero=int(mn.group(1)), enunciado=mn.group(2).strip(),
                    seccion=seccion, pagina=ln["pagina"])
            continue
        if a.actual is None:
            continue
        if mo:
            ok, t = a.marcador_valido(mo, t)
            if ok:
                a.opcion_nueva(mo.group(1), mo.group(2), ln["resaltada"])
                continue
        a.seguir(t, ln["resaltada"])

    a.cerrar_pregunta()
    return a.preguntas


def leer_guia_mpd(ruta: Path) -> list[dict]:
    """Enunciados numerados en negrita, opción correcta escrita en verde."""
    a = Armador()
    ultimo = 0
    for ln in renglones(ruta):
        t = ln["texto"]
        mn, mo = NUMERO.match(t), OPCION.match(t)
        # El enunciado va en negrita y numerado. La cursiva no sirve de señal:
        # casi todos los enunciados la tienen pero alguno no, y el que no la
        # tiene quedaría pegado como texto de la opción anterior. El número
        # creciente descarta que un año o un porcentaje abra una pregunta.
        if mn and not mo and ln["negrita"] and int(mn.group(1)) > ultimo:
            ultimo = int(mn.group(1))
            a.abrir(numero=ultimo, enunciado=mn.group(2).strip(),
                    seccion="teorico", pagina=ln["pagina"])
            continue
        if a.actual is None:
            continue
        if mo:
            ok, t = a.marcador_valido(mo, t)
            if ok:
                a.opcion_nueva(mo.group(1), mo.group(2), ln["verde"])
                continue
        a.seguir(t, ln["verde"])

    a.cerrar_pregunta()
    return a.preguntas


def normalizar(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9 ]", " ", re.sub(r"\s+", " ", s)).strip()


def a_registro(p: dict, fuente: str, organismo: str, orden: int) -> dict:
    correctas = [o["letra"] for o in p["opciones"] if o["resaltada"]]
    return {
        "fuente": fuente,
        "organismo": organismo,
        "seccion": p["seccion"],
        "orden": orden,
        "enunciado": p["enunciado"],
        "tipo": "multiple_choice",
        "opciones": [{"clave": o["letra"], "texto": o["texto"]} for o in p["opciones"]],
        "respuesta_correcta": correctas[0] if len(correctas) == 1 else None,
        "confianza": "media",
        "revisada": False,
    }


def verificar(registros: list[dict]) -> list[str]:
    """Todo lo que un humano tiene que mirar antes de publicar."""
    problemas = []
    for r in registros:
        d = f"{r['fuente']}#{r['orden']}"
        if r["respuesta_correcta"] is None:
            problemas.append(f"{d}: no tiene exactamente una opción resaltada")
        if len(r["opciones"]) != 3:
            problemas.append(f"{d}: tiene {len(r['opciones'])} opciones, no 3")
        if not r["enunciado"].rstrip().endswith((":", "?", ".")):
            problemas.append(f"{d}: el enunciado parece cortado — «…{r['enunciado'][-45:]}»")
        for o in r["opciones"]:
            if not o["texto"]:
                problemas.append(f"{d}: opción {o['clave']} vacía")
    return problemas


def corroborar(registros: list[dict]) -> int:
    """Sube a `alta` la confianza de lo que dicen dos fuentes distintas.

    Una respuesta marcada por una sola fuente es la palabra de esa fuente. Cuando
    dos documentos independientes —la guía de Nexo y la captura de un examen
    real, por ejemplo— coinciden en el enunciado y en el texto de la correcta,
    deja de ser una lectura y pasa a estar cruzada.
    """
    subidas = 0
    for grupo in duplicados(registros).values():
        fuentes = {r["fuente"] for r in grupo}
        if len(fuentes) < 2:
            continue
        textos = [
            normalizar(next((o["texto"] for o in r["opciones"]
                             if o["clave"] == r["respuesta_correcta"]), ""))
            for r in grupo
        ]
        if all(difflib.SequenceMatcher(None, a, b).ratio() >= 0.85
               for a in textos for b in textos):
            for r in grupo:
                if r["confianza"] != "alta":
                    r["confianza"] = "alta"
                    subidas += 1
                r["corroborada_por"] = sorted(fuentes - {r["fuente"]})
    return subidas


def duplicados(registros: list[dict]) -> dict[str, list[dict]]:
    grupos = defaultdict(list)
    for r in registros:
        grupos[normalizar(r["enunciado"])].append(r)
    return {k: v for k, v in grupos.items() if len(v) > 1}


def main() -> int:
    DESTINO.mkdir(parents=True, exist_ok=True)
    trabajos = [
        ("mpf-preguntero-nexo.pdf", leer_preguntero, "mpf", "mpf-preguntero-nexo"),
        ("mpf-modelos-manual.pdf", leer_manual, "mpf", "mpf-modelos-manual"),
        ("mpd-guia-preguntas.pdf", leer_guia_mpd, "mpd", "mpd-guia-preguntas"),
    ]
    por_archivo: dict[str, list[dict]] = {}
    for archivo, lector, organismo, nombre in trabajos:
        ruta = CRUDO / archivo
        if not ruta.exists():
            print(f"  falta {ruta}, se saltea")
            continue
        registros = [
            a_registro(p, nombre, organismo, i)
            for i, p in enumerate(lector(ruta), 1)
        ]
        por_archivo[nombre] = registros
        print(f"{nombre}: {len(registros)} preguntas")
        for p in verificar(registros):
            print(f"    ⚠ {p}")

    # Los transcriptos a mano entran al cruce aunque no salgan de un parser.
    a_mano = DESTINO / "mpd-examen-caba.json"
    if a_mano.exists():
        por_archivo["mpd-examen-caba"] = json.loads(a_mano.read_text(encoding="utf-8"))

    todos = [r for rs in por_archivo.values() for r in rs]
    print(f"\ncorroboradas por otra fuente: {corroborar(todos)}")

    for nombre, registros in por_archivo.items():
        salida = DESTINO / f"{nombre}.json"
        salida.write_text(json.dumps(registros, ensure_ascii=False, indent=2) + "\n",
                          encoding="utf-8")
        print(f"  -> {salida}")

    reps = duplicados(todos)
    conflictos = 0
    print(f"\ntotal: {len(todos)} · enunciados repetidos: {len(reps)}")
    for v in reps.values():
        # Comparar por el TEXTO de la correcta y no por la letra: el orden de las
        # opciones cambia entre documentos, y "CN" contra "Constitución Nacional"
        # es la misma respuesta escrita distinto. Sólo interesa cuando difieren
        # de verdad.
        textos = [
            normalizar(next((o["texto"] for o in r["opciones"]
                             if o["clave"] == r["respuesta_correcta"]), ""))
            for r in v
        ]
        if any(difflib.SequenceMatcher(None, a, b).ratio() < 0.75
               for a in textos for b in textos):
            conflictos += 1
            print(f"  ⚠ mismo enunciado, distinta respuesta: «{v[0]['enunciado'][:66]}»")
            for r in v:
                t = next((o["texto"] for o in r["opciones"]
                          if o["clave"] == r["respuesta_correcta"]), "")
                print(f"      {r['fuente']}#{r['orden']}: {r['respuesta_correcta']}) {t[:66]}")
    print(f"contradicciones reales: {conflictos}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
