-- ============================================================
-- 0004 — Las consultas del formulario de contacto.
--
-- Mismo criterio que `alertas`: cualquiera puede dejar una, nadie puede leer
-- la lista. Un formulario público que además devuelve lo que escribieron otros
-- es una filtración de datos personales, y acá el mensaje puede traer
-- cualquier cosa.
--
-- Se puede correr más de una vez sin romper.
-- ============================================================

do $$ begin
  create type motivo_consulta as enum (
    'informacion_general',
    'ingreso_democratico',
    'simulador',
    'material',
    'tecnico',
    'otra'
  );
exception when duplicate_object then null;
end $$;

create table if not exists consultas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email citext not null,
  motivo motivo_consulta not null,
  mensaje text not null,
  -- De dónde salió. Sirve para separar el contacto general de lo que más
  -- adelante entre por el asistente, sin tener que adivinar por el texto.
  origen text not null default 'contacto',
  -- Se marca a mano cuando alguien la respondió. Sin esto no hay forma de
  -- saber qué quedó sin contestar salvo acordarse.
  respondida boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists consultas_created_at_idx on consultas (created_at desc);

alter table consultas enable row level security;

-- Dejar una consulta: sí. Leerlas, cambiarlas o borrarlas: sólo el servidor
-- con la clave de servicio, que saltea RLS.
drop policy if exists "consultas, alta anónima" on consultas;
create policy "consultas, alta anónima" on consultas for insert with check (true);

revoke all on consultas from anon, authenticated;
grant insert (nombre, email, motivo, mensaje, origen) on consultas to anon, authenticated;
