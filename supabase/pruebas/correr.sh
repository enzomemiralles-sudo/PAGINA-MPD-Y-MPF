#!/usr/bin/env bash
# Corre las migraciones contra un PostgreSQL descartable y comprueba que la
# seguridad haga lo que dice: que nadie sin sesión pueda leer las respuestas
# correctas ni la lista de mails, y que cada persona vea sólo lo suyo.
#
# No toca el proyecto de Supabase. Es para saber, antes de aplicar nada en
# producción, que las migraciones corren y que las políticas funcionan.
#
#   sudo apt-get install -y postgresql
#   bash supabase/pruebas/correr.sh
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BIN="$(ls -d /usr/lib/postgresql/*/bin | tail -1)"
DIR=/var/lib/postgresql/prueba-nexo
PUERTO=${PUERTO:-5433}

correr() { su postgres -c "psql -p $PUERTO -d nexo -v ON_ERROR_STOP=1 -q -f $1"; }

# Si quedó un cluster de una corrida anterior, se lo baja antes de empezar.
if [ -d "$DIR/data" ]; then
  su postgres -c "$BIN/pg_ctl -D $DIR/data stop" >/dev/null 2>&1 || true
  sleep 1
fi

rm -rf "$DIR"; mkdir -p "$DIR"; chown postgres:postgres "$DIR"
su postgres -c "$BIN/initdb -D $DIR/data -A trust --locale=C.UTF-8 -E UTF8" >/dev/null
su postgres -c "$BIN/pg_ctl -D $DIR/data -l $DIR/pg.log -o '-p $PUERTO' start" >/dev/null
sleep 3
trap 'su postgres -c "$BIN/pg_ctl -D $DIR/data stop" >/dev/null 2>&1 || true' EXIT

su postgres -c "createdb -p $PUERTO nexo"
cp "$RAIZ"/supabase/pruebas/*.sql "$RAIZ"/supabase/migrations/*.sql /tmp/ && chmod 644 /tmp/*.sql

correr /tmp/00-andamiaje.sql
for f in "$RAIZ"/supabase/migrations/*.sql; do
  correr "/tmp/$(basename "$f")"
  echo "  OK  $(basename "$f")"
done
correr /tmp/01-datos.sql

su postgres -c "psql -p $PUERTO -d nexo -f /tmp/02-seguridad.sql"
su postgres -c "psql -p $PUERTO -d nexo -f /tmp/03-estructura.sql"
