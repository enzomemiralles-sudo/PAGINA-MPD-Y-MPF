#!/usr/bin/env python3
"""Arma supabase/instalar.sql pegando las migraciones una detrás de otra.

Existe porque instalar.sql se venía manteniendo a mano y eso se desincroniza
solo: alguien agrega una migración, se olvida de copiarla, y quien instala
desde cero se queda sin una tabla. Ahora se regenera:

    python3 scripts/instalar_sql.py

El test tests/instalar.test.ts comprueba que el archivo del repo sea
exactamente lo que este script produce.
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MIGRACIONES = RAIZ / "supabase" / "migrations"
SALIDA = RAIZ / "supabase" / "instalar.sql"

CABECERA = """\
-- ============================================================
-- INSTALACIÓN COMPLETA — pegá TODO esto en el SQL Editor de Supabase
-- y apretá Run.
--
-- Se puede correr las veces que haga falta: si algo ya estaba creado, lo
-- saltea en vez de fallar. Si te quedó a medias de un intento anterior,
-- volvé a pegar esto mismo y listo.
--
-- Son todas las migraciones de supabase/migrations/ una detrás de otra, en
-- orden. No las corras además por separado: con esto ya está.
--
-- NO SE EDITA A MANO. Sale de scripts/instalar_sql.py.
-- ============================================================
"""

RAYA = "-- " + "=" * 60


def construir() -> str:
    partes = [CABECERA]
    for f in sorted(MIGRACIONES.glob("*.sql")):
        partes.append(f"\n\n{RAYA}\n-- {f.name}\n{RAYA}\n{f.read_text(encoding='utf-8').rstrip()}\n")
    return "".join(partes)


if __name__ == "__main__":
    SALIDA.write_text(construir(), encoding="utf-8")
    print(f"{SALIDA.relative_to(RAIZ)}: {len(SALIDA.read_text(encoding='utf-8').splitlines())} líneas")
