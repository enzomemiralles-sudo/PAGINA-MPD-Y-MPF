#!/usr/bin/env python3
"""Convierte material/preguntas/json/*.json en supabase/preguntas.sql.

Por qué SQL y no un script que le pegue a la API: insertar en `questions`
necesita saltarse RLS, o sea la service role. Esa clave no está —ni tiene que
estar— en esta máquina. Un archivo que se pega en el SQL Editor hace lo mismo
sin que la clave salga del panel, y es el mismo camino por el que ya se
instala todo lo demás.

    python3 scripts/preguntas_a_sql.py

Dos cosas que el archivo generado respeta:

- **`revisada` sale del JSON, y hoy es false en las 259.** Ninguna pregunta se
  publica sin que una persona la haya mirado. La política de la base lo hace
  cumplir sola, así que cargarlas no las publica.
- **`orden` es estable.** Cada fuente tiene su bloque de mil, así que agregar
  preguntas nuevas no renumera las viejas ni pisa los intentos ya rendidos.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "material" / "preguntas" / "json"
SALIDA = RAIZ / "supabase" / "preguntas.sql"

# (organismo, sección del JSON) -> (instancia, modalidad) de `exams`.
DESTINO = {
    ("mpd", "teorico"): ("teorico", "multiple_choice"),
    ("mpf", "teorico"): ("teorico", "multiple_choice"),
    ("mpf", "practico"): ("practico", "investigacion"),
}

BLOQUE = 1000


def citar(texto: str) -> str:
    """Comillas de dólar: el texto trae comillas simples, acentos y saltos."""
    tag = "q"
    while f"${tag}$" in texto:
        tag += "q"
    return f"${tag}${texto}${tag}$"


def cargar() -> list[dict]:
    fuentes = sorted(p.stem for p in ENTRADA.glob("*.json"))
    preguntas = []
    for indice, fuente in enumerate(fuentes, start=1):
        base = indice * BLOQUE
        for q in json.loads((ENTRADA / f"{fuente}.json").read_text(encoding="utf-8")):
            clave = (q["organismo"], q["seccion"])
            if clave not in DESTINO:
                raise SystemExit(f"{fuente}: no sé a qué examen va {clave}")
            preguntas.append({**q, "orden_estable": base + q["orden"], "destino": DESTINO[clave]})
    return preguntas


TEXTOS_TIPEO = RAIZ / "material" / "tipeo" / "textos.json"

CABECERA = """\
-- ============================================================
-- LAS PREGUNTAS — pegá TODO esto en el SQL Editor de Supabase, después de
-- instalar.sql, y apretá Run.
--
-- Se puede correr las veces que haga falta: las preguntas se identifican por
-- (examen, orden) y volver a correrlo las actualiza en vez de duplicarlas.
--
-- IMPORTANTE: esto NO publica nada. Las preguntas entran con revisada =
-- false, que es como están en el repositorio, y la política de la base no las
-- deja leer hasta que alguien las revise una por una. El simulador va a
-- funcionar de punta a punta y no va a mostrar ninguna hasta entonces. Es a
-- propósito.
--
-- NO SE EDITA A MANO. Sale de scripts/preguntas_a_sql.py.
-- ============================================================

"""

SQL_EXAMEN = """\
with examen as (
  select e.id from exams e
    join concursos c on c.id = e.concurso_id
   where c.organismo = '{org}' and c.cargo = 'Técnico administrativo' and c.anio = 2026
     and e.instancia = '{instancia}' and e.modalidad = '{modalidad}'
)
insert into questions (
  exam_id, orden, enunciado, tipo, opciones, respuesta_correcta,
  fuente_normativa, tema, confianza, revisada
) values
{filas}
on conflict (exam_id, orden) do update set
  enunciado        = excluded.enunciado,
  tipo             = excluded.tipo,
  opciones         = excluded.opciones,
  respuesta_correcta = excluded.respuesta_correcta,
  fuente_normativa = excluded.fuente_normativa,
  -- El tema tampoco se pisa: si alguien lo corrigió a mano al revisar, la
  -- propuesta de la regla no tiene por qué ganarle.
  tema             = coalesce(questions.tema, excluded.tema),
  confianza        = excluded.confianza,
  -- revisada NO se pisa: si alguien ya revisó una pregunta a mano, volver a
  -- correr esto no le saca el tilde.
  revisada         = questions.revisada;
"""


SQL_TIPEO = """\
with examen as (
  select e.id from exams e
    join concursos c on c.id = e.concurso_id
   where c.organismo = 'mpd' and c.cargo = 'Técnico administrativo' and c.anio = 2026
     and e.instancia = 'practico' and e.modalidad = 'tipeo'
)
insert into questions (
  exam_id, orden, enunciado, tipo, opciones, respuesta_correcta,
  fuente_normativa, tema, confianza, revisada
)
select (select id from examen), t.orden, t.texto, 'tipeo', '[]'::jsonb, t.texto,
       t.fuente, 'Tipeo', 'media', true
from (values
{filas}
) as t(orden, texto, fuente)
on conflict (exam_id, orden) do update set
  enunciado        = excluded.enunciado,
  tipo             = excluded.tipo,
  opciones         = excluded.opciones,
  respuesta_correcta = excluded.respuesta_correcta,
  fuente_normativa = excluded.fuente_normativa,
  tema             = coalesce(questions.tema, excluded.tema),
  confianza        = excluded.confianza,
  revisada         = questions.revisada;
"""


def fila(q: dict) -> str:
    opciones = json.dumps(q["opciones"], ensure_ascii=False)
    return (
        f"  ((select id from examen), {q['orden_estable']}, "
        f"{citar(q['enunciado'])}, 'multiple_choice', {citar(opciones)}::jsonb, "
        f"{citar(q['respuesta_correcta'])}, {citar(q['fuente'])}, "
        f"{citar(q['tema']) if q.get('tema') else 'null'}, "
        f"'{q['confianza']}', {str(q['revisada']).lower()})"
    )


def construir() -> str:
    preguntas = cargar()
    partes = [CABECERA]

    for (org, seccion), (instancia, modalidad) in sorted(DESTINO.items()):
        grupo = [q for q in preguntas if q["organismo"] == org and q["seccion"] == seccion]
        if not grupo:
            continue
        grupo.sort(key=lambda q: q["orden_estable"])
        fuentes = sorted({q["fuente"] for q in grupo})
        partes.append(
            f"\n-- {org.upper()} · {instancia} · {modalidad}\n"
            f"-- fuentes: {', '.join(fuentes)}\n"
            + SQL_EXAMEN.format(
                org=org,
                instancia=instancia,
                modalidad=modalidad,
                filas=",\n".join(fila(q) for q in grupo),
            )
        )

    # ---------------------------------------------------------------------
    # Los textos del tipeo.
    #
    # Van con revisada = true porque no hay nada que revisar: lo que hay que
    # copiar es lo mismo que se muestra, así que no puede haber una respuesta
    # mal cargada. Lo que sí está sin confirmar es la metodología, y eso la
    # pantalla lo dice. Son varios para que practicar dos veces no sea copiar
    # el mismo párrafo: `cantidad_preguntas = 1` sortea uno por intento.
    # ---------------------------------------------------------------------
    textos = json.loads(TEXTOS_TIPEO.read_text(encoding="utf-8"))
    partes.append(
        "\n-- MPD · practico · tipeo\n"
        f"-- {len(textos)} textos de práctica, no oficiales. Ver PLAN-SIMULADOR.md §6.\n"
        # El texto va una sola vez y se usa dos: es lo que hay que copiar y es
        # también la respuesta correcta. Repetirlo duplicaría el archivo y
        # abriría la posibilidad de que las dos copias dejen de coincidir.
        + SQL_TIPEO.format(
            filas=",\n".join(
                f"  ({i}, {citar(t['texto'])}, {citar('texto de práctica: ' + t['titulo'])})"
                for i, t in enumerate(textos, start=1)
            )
        )
    )
    return "".join(partes)


if __name__ == "__main__":
    SALIDA.write_text(construir(), encoding="utf-8")
    total = len(cargar())
    textos = len(json.loads(TEXTOS_TIPEO.read_text(encoding="utf-8")))
    print(f"{SALIDA.relative_to(RAIZ)}: {total} preguntas + {textos} textos de tipeo")
