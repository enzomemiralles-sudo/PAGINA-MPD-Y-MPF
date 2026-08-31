#!/usr/bin/env python3
"""Propone un `tema` para cada pregunta y lo escribe en los JSON.

**Es una propuesta, no una clasificación cerrada.** La hace un puñado de
reglas por palabra clave, no una persona, y por eso viaja junto con la
pregunta a la pantalla de revisión: quien revisa la confirma o la cambia en el
mismo paso en que aprueba la respuesta. Ninguna pregunta se publica sin pasar
por ahí, así que un tema mal puesto no llega a nadie.

Los temas del MPF son los que el propio organismo publica como contenidos
evaluables (material/metodologia/mpf-formato-examen.md). Los del MPD salen de
la Ley Orgánica 27.149, que es de lo que trata su examen.

    python3 scripts/temas.py            # muestra el reparto, no escribe
    python3 scripts/temas.py --escribir # escribe el campo tema en los JSON
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "material" / "preguntas" / "json"

# El orden importa: gana la primera regla que engancha. Van de lo más
# específico a lo más general, porque «Constitución» aparece en preguntas que
# en realidad son de género o de procesal penal.
REGLAS_MPF: list[tuple[str, str]] = [
    (
        "Búsqueda e investigación",
        r"realice una b[úu]squeda|busque en (el sitio|la p[áa]gina)|ingres(e|ando) a (la p[áa]gina|www|http)|"
        r"a trav[ée]s (del sitio|de la p[áa]gina) (web )?(oficial )?del",
    ),
    (
        "Problemática de género",
        r"g[ée]nero|mujer|mujeres|femicidio|violencia dom[ée]stica|identidad de g[ée]nero|"
        r"26\.?485|26\.?743|belem do par[áa]|bel[ée]m|cedaw|micaela|diversidad sexual|lgbt|"
        r"travesti|transexual|trans\b|matrimonio igualitario|aborto|interrupci[óo]n del embarazo",
    ),
    (
        "Código Procesal Penal Federal",
        r"procesal penal|cppf|acusatorio|querellante|imputad|sobreseimiento|elevaci[óo]n a juicio|"
        r"juicio abreviado|prisi[óo]n preventiva|27\.?063|27\.?150|27\.?482|"
        r"medidas de coerci[óo]n|investigaci[óo]n penal preparatoria",
    ),
    (
        "Ordenamiento del MPF",
        r"ministerio p[úu]blico fiscal|mpfn|mpf\b|procurador|procuradur[íi]a|fiscal[ íi]|fiscales|"
        r"27\.?148|26\.?861|ingreso democr[áa]tico|pgn\b|unidad fiscal|"
        r"ministerio p[úu]blico de la naci[óo]n",
    ),
    (
        "Historia argentina y latinoamericana",
        r"historia|siglo x[ivx]+|revoluci[óo]n de mayo|independencia|per[óo]n|peronis|rosas|sarmiento|"
        r"1810|1816|1853|18[5-9]\d|19[0-8]\d|dictadura|golpe de estado|conquista|colonial|virreinato|"
        r"roca\b|mitre|urquiza|yrigoyen|alberdi|san mart[íi]n|belgrano|moreno|caudillo|"
        r"unitario|federales|generaci[óo]n del 80|s[áa]enz pe[ñn]a|reforma universitaria|"
        r"radicalismo|uni[óo]n c[íi]vica radical|\bucr\b|inmigraci[óo]n|malvinas|alfons[íi]n|"
        r"proceso de reorganizaci[óo]n|guerra civil|latinoamericana|colonia",
    ),
    (
        "Sistema constitucional",
        r"constituci[óo]n|constitucional|amparo|h[áa]beas|corte suprema|"
        r"tratados internacionales|derechos humanos|convenci[óo]n americana|pacto de san jos[ée]|"
        r"75 inc|art[íi]culo 14|federalismo|divisi[óo]n de poderes|congreso|poder ejecutivo|"
        r"poder judicial|consejo de la magistratura",
    ),
]

REGLAS_MPD: list[tuple[str, str]] = [
    (
        "Régimen disciplinario",
        r"sanci[óo]n|sanciones|disciplinari|apercibimiento|cesant[íi]a|exoneraci[óo]n|"
        r"suspensi[óo]n|falta grave|sumario|procedimiento sancionatorio|prescripci[óo]n de la acci[óo]n",
    ),
    (
        "Ingreso, cargos e incompatibilidades",
        r"incompatib|no podr[áa]n ser nombrad|requisitos para|ingreso|concurso|"
        r"designaci[óo]n|nombramiento|misma dependencia|parentesco|c[óo]nyuge|"
        r"escalaf[óo]n|ordenanza|categor[íi]a",
    ),
    (
        "Deberes y derechos del personal",
        r"deberes|obligaciones|derecho a|licencia|hor(a|ario) de trabajo|"
        r"conducta|decoro|reserva|secreto|capacitaci[óo]n|evaluaci[óo]n de desempe[ñn]o",
    ),
    (
        "Estructura y autonomía del MPD",
        r"defensor[íi]a general|defensor general|autonom[íi]a|autarqu[íi]a|"
        r"art[íi]culo 120|120 de la constituci[óo]n|27\.?149|estructura|"
        r"recursos propios|presupuesto|remoci[óo]n|tribunal de enjuiciamiento|"
        r"instrucciones|unidad de actuaci[óo]n",
    ),
    (
        "Defensa pública y acceso a la justicia",
        r"defensa p[úu]blica|asistencia jur[íi]dica|acceso a la justicia|"
        r"vulnerab|ni[ñn]os|ni[ñn]as|adolescentes|migrante|privad(a|o)s de (la )?libertad|"
        r"curador|tutor|asistido",
    ),
]

GENERAL = {"mpf": "Sistema constitucional", "mpd": "Estructura y autonomía del MPD"}


def tema_de(pregunta: dict) -> str:
    # El práctico del MPF no es un tema de estudio: es una forma de resolver.
    # Sale de la sección y no de las palabras, así que acá no se adivina.
    if pregunta["organismo"] == "mpf" and pregunta["seccion"] == "practico":
        return "Búsqueda e investigación"

    texto = pregunta["enunciado"] + " " + " ".join(o["texto"] for o in pregunta.get("opciones", []))
    texto = texto.lower()
    reglas = REGLAS_MPF if pregunta["organismo"] == "mpf" else REGLAS_MPD
    for tema, patron in reglas:
        if re.search(patron, texto):
            return tema
    return GENERAL[pregunta["organismo"]]


def main() -> None:
    escribir = "--escribir" in sys.argv
    cuenta: Counter[tuple[str, str]] = Counter()

    for archivo in sorted(ENTRADA.glob("*.json")):
        preguntas = json.loads(archivo.read_text(encoding="utf-8"))
        for q in preguntas:
            tema = tema_de(q)
            cuenta[(q["organismo"], tema)] += 1
            if escribir:
                # No hace falta marcar que es una propuesta: mientras
                # `revisada` sea false, TODO en la pregunta es una propuesta.
                # Cuando alguien la aprueba, aprueba también el tema.
                q["tema"] = tema
        if escribir:
            archivo.write_text(
                json.dumps(preguntas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )

    for (org, tema), n in sorted(cuenta.items()):
        print(f"{org}  {tema:<45} {n}")
    print(f"\n{'escritas' if escribir else 'sin escribir'}: {sum(cuenta.values())} preguntas")


if __name__ == "__main__":
    main()
