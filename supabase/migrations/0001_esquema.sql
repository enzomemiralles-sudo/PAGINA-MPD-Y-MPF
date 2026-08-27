-- ============================================================
-- Esquema base. RLS en todas las tablas.
--
-- Se puede correr más de una vez sin romper: los tipos van envueltos, las
-- tablas usan "if not exists" y las políticas se borran antes de crearse.
-- Eso importa porque quien lo corre lo hace desde el SQL Editor y es normal
-- apretar Run dos veces.
--
-- Regla que ordena todo el archivo: el contenido publicado se lee sin
-- registro, cada persona ve solo sus propios intentos, y las respuestas
-- correctas no salen nunca por la anon key.
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------- tipos ----------
do $$ begin
  create type organismo as enum ('mpd', 'mpf');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type perfil_organizacion as enum ('nexo', 'na');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type organismo_interes as enum ('mpd', 'mpf', 'ambos');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type estado_concurso as enum (
    'sin_convocatoria', 'convocatoria_abierta', 'inscripcion_abierta',
    'fecha_confirmada', 'finalizado'
  );
exception when duplicate_object then null;
end $$;
do $$ begin
  create type tipo_examen as enum ('oficial_reconstruido', 'practica');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type tipo_pregunta as enum ('multiple_choice', 'tipeo');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type nivel_confianza as enum ('alta', 'media', 'baja');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type estado_intento as enum ('en_curso', 'finalizado', 'expirado');
exception when duplicate_object then null;
end $$;

-- ---------- perfiles ----------
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  perfil perfil_organizacion not null,
  jurisdiccion text,
  organismo_interes organismo_interes not null default 'ambos',
  universidad text,
  anio_cursada smallint check (anio_cursada between 1 and 8),
  matricula text,
  whatsapp text,
  consent_datos boolean not null default false,
  consent_wsp boolean not null default false,
  origen text,
  created_at timestamptz not null default now()
);

-- ---------- concursos ----------
create table if not exists concursos (
  id uuid primary key default gen_random_uuid(),
  organismo organismo not null,
  cargo text not null,
  anio smallint not null,
  estado estado_concurso not null default 'sin_convocatoria',
  fecha_examen date,
  fecha_cierre_inscripcion date,
  url_oficial text,
  created_at timestamptz not null default now(),
  unique (organismo, cargo, anio)
);

-- ---------- exámenes ----------
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  concurso_id uuid not null references concursos(id) on delete cascade,
  titulo text not null,
  duracion_minutos smallint not null check (duracion_minutos > 0),
  cantidad_preguntas smallint not null check (cantidad_preguntas > 0),
  puntos_correcta smallint not null,
  puntos_incorrecta smallint not null,
  puntos_blanco smallint not null default 0,
  puntaje_minimo smallint not null,
  tipo tipo_examen not null default 'practica',
  publicado boolean not null default false,
  revisado boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- preguntas ----------
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  orden smallint not null,
  enunciado text not null,
  tipo tipo_pregunta not null default 'multiple_choice',
  opciones jsonb not null default '[]'::jsonb,
  respuesta_correcta text not null,
  explicacion text,
  fuente_normativa text,
  tema text,
  subtema text,
  dificultad smallint check (dificultad between 1 and 5),
  destacada_home boolean not null default false,
  confianza nivel_confianza not null default 'media',
  revisada boolean not null default false,
  created_at timestamptz not null default now(),
  unique (exam_id, orden)
);

-- ---------- intentos ----------
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id uuid not null references exams(id) on delete cascade,
  iniciado_en timestamptz not null default now(),
  finalizado_en timestamptz,
  puntaje smallint,
  estado estado_intento not null default 'en_curso'
);
create index on attempts (user_id, exam_id);

create table if not exists attempt_answers (
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  respuesta text,
  -- Sin esta columna no se puede calcular, en la pantalla de resultados,
  -- qué habría pasado dejando en blanco las dudosas.
  marcada boolean not null default false,
  correcta boolean,
  tiempo_segundos integer,
  actualizado_en timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

-- ---------- captura de mails ----------
create table if not exists alertas (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  organismo organismo not null,
  consent_wsp boolean not null default false,
  created_at timestamptz not null default now(),
  unique (email, organismo)
);

-- ---------- contenido abierto ----------
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  titulo text not null,
  cuerpo text,
  url text,
  organismo organismo,
  publicado boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  youtube_id text not null,
  organismo organismo,
  orden smallint not null default 0,
  publicado boolean not null default false
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha timestamptz not null,
  url text,
  publicado boolean not null default false
);

-- ============================================================
-- RLS
-- ============================================================
alter table profiles         enable row level security;
alter table concursos        enable row level security;
alter table exams            enable row level security;
alter table questions        enable row level security;
alter table attempts         enable row level security;
alter table attempt_answers  enable row level security;
alter table alertas          enable row level security;
alter table resources        enable row level security;
alter table videos           enable row level security;
alter table events           enable row level security;

-- perfiles: cada quien el suyo
drop policy if exists "perfil propio, lectura" on profiles;
create policy "perfil propio, lectura" on profiles for select using (auth.uid() = user_id);
drop policy if exists "perfil propio, alta" on profiles;
create policy "perfil propio, alta"    on profiles for insert with check (auth.uid() = user_id);
drop policy if exists "perfil propio, cambio" on profiles;
create policy "perfil propio, cambio"  on profiles for update using (auth.uid() = user_id);

-- concursos: el estado de los concursos es información pública
drop policy if exists "concursos, lectura pública" on concursos;
create policy "concursos, lectura pública" on concursos for select using (true);

-- exámenes: solo lo publicado y revisado
drop policy if exists "exámenes publicados, lectura pública" on exams;
create policy "exámenes publicados, lectura pública" on exams
  for select using (publicado and revisado);

-- preguntas: la política deja pasar las filas publicadas y revisadas, pero el
-- acceso a las COLUMNAS con la respuesta se corta más abajo con un GRANT por
-- columna. RLS filtra filas, no columnas: sin el grant, cualquiera con la anon
-- key podría leer respuesta_correcta.
drop policy if exists "preguntas publicadas, lectura de filas" on questions;
create policy "preguntas publicadas, lectura de filas" on questions
  for select using (
    revisada and exists (
      select 1 from exams e
      where e.id = questions.exam_id and e.publicado and e.revisado
    )
  );

-- intentos: cada usuario ve únicamente los suyos
drop policy if exists "intentos propios, lectura" on attempts;
create policy "intentos propios, lectura" on attempts for select using (auth.uid() = user_id);
drop policy if exists "intentos propios, alta" on attempts;
create policy "intentos propios, alta"    on attempts for insert with check (auth.uid() = user_id);
drop policy if exists "intentos propios, cambio" on attempts;
create policy "intentos propios, cambio"  on attempts for update using (auth.uid() = user_id);

drop policy if exists "respuestas propias, lectura" on attempt_answers;
create policy "respuestas propias, lectura" on attempt_answers for select
  using (exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid()));
drop policy if exists "respuestas propias, alta" on attempt_answers;
create policy "respuestas propias, alta" on attempt_answers for insert
  with check (exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid()));
drop policy if exists "respuestas propias, cambio" on attempt_answers;
create policy "respuestas propias, cambio" on attempt_answers for update
  using (exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid()));

-- alertas: se puede dejar el mail, no se puede leer la lista.
drop policy if exists "alertas, alta anónima" on alertas;
create policy "alertas, alta anónima" on alertas for insert with check (true);

-- contenido abierto
drop policy if exists "recursos publicados" on resources;
create policy "recursos publicados" on resources for select using (publicado);
drop policy if exists "videos publicados" on videos;
create policy "videos publicados"   on videos    for select using (publicado);
drop policy if exists "eventos publicados" on events;
create policy "eventos publicados"  on events    for select using (publicado);

-- ============================================================
-- Las respuestas correctas no salen al cliente
-- ============================================================
revoke all on questions from anon, authenticated;

-- Grant por columna: es lo que de verdad impide leer la respuesta. Un
-- select respuesta_correcta from questions falla acá, no en el código.
grant select (
  id, exam_id, orden, enunciado, tipo, opciones,
  fuente_normativa, tema, subtema, dificultad, destacada_home, confianza, revisada
) on questions to anon, authenticated;

-- La vista es la comodidad: security_invoker respeta RLS y los grants de arriba.
drop view if exists questions_public;
create view questions_public
  with (security_invoker = true) as
  select id, exam_id, orden, enunciado, tipo, opciones,
         fuente_normativa, tema, subtema, dificultad, destacada_home, confianza
  from questions;

grant select on questions_public to anon, authenticated;

comment on view questions_public is
  'Preguntas sin respuesta_correcta ni explicacion. Es la única puerta de lectura
   para el cliente: la corrección corre en el servidor con service role.';
