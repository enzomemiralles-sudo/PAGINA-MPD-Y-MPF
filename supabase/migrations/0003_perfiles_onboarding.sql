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

create type tipo_perfil_usuario as enum ('abogado', 'estudiante', 'otro');
create type conocio_por as enum ('recomendacion', 'redes', 'aula', 'otro');
create type trabajo_juridico as enum ('no', 'estudio', 'juzgado', 'ministerio_publico', 'otro');

alter table profiles
  alter column nombre drop not null,
  alter column apellido drop not null;

alter table profiles rename column perfil to marca;
alter table profiles alter column marca drop not null;

alter table profiles
  add column tipo_perfil tipo_perfil_usuario,

  -- abogado / profesional
  add column anio_egreso smallint check (anio_egreso between 1950 and 2100),
  add column fuero text,
  add column matriculado boolean,
  add column area_ejercicio text,

  -- estudiante
  add column anio_ingreso smallint check (anio_ingreso between 1950 and 2100),
  add column como_conocio conocio_por,
  add column trabaja_juridico trabajo_juridico,

  -- comunes, opcionales
  add column dni text,
  add column telefono text,

  -- aceptación de condiciones: lo único obligatorio del modal
  add column fecha_aceptacion timestamptz,
  add column onboarding_completado boolean not null default false,
  add column updated_at timestamptz not null default now();

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

create trigger profiles_updated_at
  before update on profiles
  for each row execute function tocar_updated_at();
