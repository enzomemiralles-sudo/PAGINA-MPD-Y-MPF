-- ============================================================
-- El perfil de la persona: qué es, qué marca ve, y los datos del onboarding.
--
-- Extiende la tabla profiles que ya existía en vez de crear una paralela.
-- Tres cosas a tener en cuenta:
--
--  1. nombre y apellido pasan a ser nullable. La fila se crea cuando la
--     persona elige perfil, mucho antes del modal, y en el modal TODOS los
--     campos son opcionales.
--  2. perfil se renombra a marca, que es lo que siempre fue. Los valores
--     quedan 'nexo' y 'na' —no 'nueva_abogacia'— para que coincidan con el
--     data-marca del HTML y no haya que traducir en el medio.
--  3. Los campos de estudiante son los del modal, no los del modelo original.
-- ============================================================

do $$ begin
  create type tipo_perfil_usuario as enum ('abogado', 'estudiante', 'otro');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type conocio_por as enum ('recomendacion', 'redes', 'aula', 'otro');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type trabajo_juridico as enum ('no', 'estudio', 'juzgado', 'ministerio_publico', 'otro');
exception when duplicate_object then null;
end $$;

alter table profiles
  alter column nombre drop not null,
  alter column apellido drop not null;

-- El rename sólo si todavía no se hizo.
do $$ begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'profiles' and column_name = 'perfil'
  ) then
    alter table profiles rename column perfil to marca;
  end if;
end $$;

alter table profiles alter column marca drop not null;

alter table profiles
  add column if not exists tipo_perfil tipo_perfil_usuario,

  -- abogado / profesional
  add column if not exists anio_egreso smallint check (anio_egreso between 1950 and 2100),
  add column if not exists fuero text,
  add column if not exists matriculado boolean,
  add column if not exists area_ejercicio text,

  -- estudiante
  add column if not exists anio_ingreso smallint check (anio_ingreso between 1950 and 2100),
  add column if not exists como_conocio conocio_por,
  add column if not exists trabaja_juridico trabajo_juridico,

  -- comunes, opcionales
  add column if not exists dni text,
  add column if not exists telefono text,

  -- aceptación de condiciones: lo único obligatorio del modal
  add column if not exists fecha_aceptacion timestamptz,
  add column if not exists onboarding_completado boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

-- consent_datos ya existía y es el checkbox de condiciones. La fecha se guarda
-- aparte porque hay que poder decir cuándo se aceptó, no sólo que se aceptó.
comment on column profiles.consent_datos is
  'Aceptación de las condiciones de uso. Obligatoria para completar el onboarding.';
comment on column profiles.marca is
  'Piel que ve la persona. Se deriva de tipo_perfil pero se guarda aparte para
   poder cambiarla sin tocar el tipo de perfil.';

-- updated_at al día sin depender de que el código se acuerde.
create or replace function tocar_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute function tocar_updated_at();
