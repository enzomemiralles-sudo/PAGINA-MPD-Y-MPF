#!/usr/bin/env python3
"""Convierte los dos corpus de dudas en content/asistente/corpus.generado.ts.

Los corpus son de personas, no de máquinas: `material/mpffaq.md` sale de la
mesa de ayuda del examen del MPF y `material/mpd-preguntas.md` es el manual de
los grupos de WhatsApp del MPD. Tienen formatos distintos y, sobre todo,
**convenciones de confianza distintas**, y las dos se respetan tal como están:

- El MPF marca cada entrada con `confianza alta`, `confianza media` o
  `REQUIERE VERIFICACIÓN`.
- El MPD no marca confianza: marca lo que NO está confirmado con `[AC …]`, y
  su propia regla dice «si el dato dice AC, NO se responde como seguro».

Nada de esto se inventa acá. Lo único que agrega el conversor es detectar qué
entradas citan algo verificable —una URL oficial o una norma con número—,
porque de eso depende que el asistente pueda mostrar el botón «Ver fuente →»
sin mentir.

    python3 scripts/faq_a_ts.py
"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "content" / "asistente" / "corpus.generado.ts"

URL_OFICIAL = re.compile(
    r"https?://[^\s)\]]*(?:mpf\.gob\.ar|mpd\.gov\.ar|mpdefensa\.gob\.ar|mpba\.gov\.ar"
    r"|argentina\.gob\.ar|infoleg\.gob\.ar|csjn\.gov\.ar)[^\s)\]]*",
    re.I,
)
NORMA = re.compile(
    r"\b(?:ley|resoluci[óo]n|res\.|decreto|acordada)\s*(?:n[°º]\s*)?\d[\d.]*"
    r"|\bart[íi]culos?\s*\d+"
    r"|\bReglamento (?:de|para el) [Ii]ngreso\b"
    r"|\bR[ée]gimen Jur[íi]dico del MPD\b"
    r"|\bConstituci[óo]n Nacional\b",
    re.I,
)


def citas(texto: str) -> list[str]:
    """Lo verificable que menciona una respuesta, sin repetir."""
    vistas: list[str] = []
    for m in list(URL_OFICIAL.finditer(texto)) + list(NORMA.finditer(texto)):
        c = m.group(0).rstrip(".,;)")
        if c not in vistas:
            vistas.append(c)
    return vistas


def limpiar(t: str) -> str:
    return re.sub(r"[ \t]+", " ", t.replace("\\", "")).strip()


# ---------------------------------------------------------------------------
# MPF: ## categoría / ### pregunta / <sub>meta</sub> / cuerpo / <details> variantes
# ---------------------------------------------------------------------------
def leer_mpf() -> list[dict]:
    texto = (RAIZ / "material" / "mpffaq.md").read_text(encoding="utf-8")
    entradas: list[dict] = []
    categoria = ""

    for bloque in re.split(r"^(?=##+ )", texto, flags=re.M):
        if bloque.startswith("## ") and not bloque.startswith("### "):
            categoria = bloque.split("\n")[0][3:].strip()
        if not bloque.startswith("### "):
            continue

        pregunta = bloque.split("\n")[0][4:].strip()
        meta = re.search(r"^<sub>`([a-z]+-\d+)`(.*?)</sub>$", bloque, re.M)
        if not meta:
            continue

        resto = bloque[meta.end():]
        cuerpo, _, cola = resto.partition("<details>")

        # El <sub>_…_</sub> suelto del final del cuerpo es una advertencia, no
        # parte de la respuesta: viaja aparte para poder mostrarla distinto.
        nota = None
        aviso = re.search(r"<sub>_(.+?)_</sub>", cuerpo, re.S)
        if aviso:
            nota = limpiar(aviso.group(1))
            cuerpo = cuerpo[: aviso.start()]

        campos = meta.group(2)
        confianza = (
            "alta" if "confianza alta" in campos
            else "media" if "confianza media" in campos
            else "requiere_verificacion"
        )
        n = lambda p: int(m.group(1)) if (m := re.search(rf"(\d+) {p}", campos)) else 0

        respuesta = limpiar("\n".join(l for l in cuerpo.split("\n") if l.strip()))
        entradas.append({
            "id": meta.group(1),
            "organismo": "mpf",
            "categoria": categoria,
            "pregunta": pregunta,
            "respuesta": respuesta,
            "nota": nota,
            "consultas": n("consultas?"),
            "personas": n("personas?"),
            "confianza": confianza,
            "atadaALaConvocatoria": "atada a la convocatoria" in campos,
            # Cómo lo preguntó la gente de verdad. Es lo que hace que el
            # buscador encuentre «hasta que hora hay tiempo» y no sólo la
            # redacción prolija de la pregunta.
            "variantes": [limpiar(v) for v in re.findall(r"^- _(.+?)_$", cola, re.M)],
            "citas": citas(respuesta),
        })
    return entradas


# ---------------------------------------------------------------------------
# MPD: ## sección / **¿pregunta?** respuesta, con [AC …] como marca de duda
# ---------------------------------------------------------------------------
AMBITOS = {"Nación (MPD / DGN)": "nacion", "PBA (Ministerio Público bonaerense)": "pba",
           "CABA (MPD de la Ciudad)": "caba"}


def leer_mpd() -> list[dict]:
    texto = (RAIZ / "material" / "mpd-preguntas.md").read_text(encoding="utf-8")
    entradas: list[dict] = []
    seccion = ""
    n = 0

    for bloque in re.split(r"^(?=## )", texto, flags=re.M):
        primera = bloque.split("\n")[0]
        if primera.startswith("## "):
            seccion = primera[3:].strip()
        # La fórmula de transparencia es una plantilla de respuesta, no una duda.
        if seccion.startswith("Fórmula de transparencia"):
            continue

        for m in re.finditer(r"^\*\*(.+?)\*\*\s*(.*?)$", bloque, re.M):
            pregunta, respuesta = limpiar(m.group(1)), limpiar(m.group(2))
            if not respuesta:
                continue
            n += 1
            # La regla del propio corpus: «si el dato dice AC, NO se responde
            # como seguro». Lo demás, quien lo escribió lo da por confirmado.
            ac = "[AC" in respuesta or "AC en cada" in respuesta
            entradas.append({
                "id": f"mpd-{n:03d}",
                "organismo": "mpd",
                "ambito": AMBITOS.get(seccion, "nacion"),
                "categoria": seccion,
                "pregunta": pregunta.rstrip(":"),
                "respuesta": respuesta,
                "nota": None,
                "consultas": 0,
                "personas": 0,
                "confianza": "requiere_verificacion" if ac else "alta",
                "atadaALaConvocatoria": ac,
                "variantes": [],
                "citas": citas(respuesta),
            })
    return entradas


CABECERA = '''/**
 * El corpus del asistente. NO SE EDITA A MANO: sale de scripts/faq_a_ts.py.
 *
 * Las respuestas son las de `material/mpffaq.md` y `material/mpd-preguntas.md`,
 * palabra por palabra. El asistente no redacta: elige una de estas entradas y
 * la muestra con su nivel de confianza y sus fuentes, o dice que no sabe.
 *
 * `confianza` es la del corpus, no una estimación nuestra:
 * el MPF marca alta/media/REQUIERE VERIFICACIÓN por entrada, y el MPD marca
 * con [AC] lo que no está confirmado.
 */

export type Confianza = "alta" | "media" | "requiere_verificacion";

export type EntradaFaq = {
  id: string;
  organismo: "mpd" | "mpf";
  /** Sólo el MPD: su corpus cubre Nación, PBA y CABA, que son sistemas distintos. */
  ambito?: "nacion" | "pba" | "caba";
  categoria: string;
  pregunta: string;
  respuesta: string;
  /** Advertencia propia de la entrada, cuando el corpus la trae. */
  nota: string | null;
  consultas: number;
  personas: number;
  confianza: Confianza;
  atadaALaConvocatoria: boolean;
  /** Cómo lo preguntó la gente en el chat. Es lo que hace andar la búsqueda. */
  variantes: string[];
  /** URLs oficiales y normas con número que la respuesta menciona. */
  citas: string[];
};

export const CORPUS: EntradaFaq[] = '''


if __name__ == "__main__":
    entradas = leer_mpf() + leer_mpd()
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(
        CABECERA + json.dumps(entradas, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    import collections
    c = collections.Counter((e["organismo"], e["confianza"]) for e in entradas)
    con_cita = sum(1 for e in entradas if e["citas"])
    print(f"{SALIDA.relative_to(RAIZ)}: {len(entradas)} entradas")
    for k, v in sorted(c.items()):
        print(f"  {k[0]}  {k[1]:<22} {v}")
    print(f"  con alguna cita verificable: {con_cita}")
    print(f"  variantes de chat totales:   {sum(len(e['variantes']) for e in entradas)}")
