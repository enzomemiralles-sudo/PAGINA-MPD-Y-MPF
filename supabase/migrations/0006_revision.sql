-- ============================================================
-- La pantalla de revisión.
--
-- Ninguna pregunta se publica con `revisada = false`, y son 259. Sin una
-- pantalla para revisarlas, eso significa 259 idas y vueltas al Table Editor
-- de Supabase mirando una columna que se llama `respuesta_correcta` y otra
-- que se llama `opciones` en JSON. Nadie hace eso dos veces.
--
-- Lo que agrega:
--   · un rol, para que revisar no sea algo que pueda hacer cualquiera que se
--     cree una cuenta;
--   · quién revisó y cuándo, que es lo que permite volver sobre una decisión;
--   · una nota, para dejar dicho por qué una pregunta quedó frenada.
--
-- Ninguna de estas columnas entra en `questions_public` ni en el grant por
-- columna: son de gestión, no de la persona que practica.
-- ============================================================

do $$ begin
  create type rol_perfil as enum ('persona', 'revisor');
exception when duplicate_object then null;
end $$;

alter table profiles add column if not exists rol rol_perfil not null default 'persona';

comment on column profiles.rol is
  'persona: usa el sitio. revisor: además puede aprobar preguntas. Se otorga
   a mano con un update; no hay forma de auto-asignárselo desde la interfaz.';

alter table questions add column if not exists nota_revision text;
alter table questions add column if not exists revisada_por uuid references auth.users(id);
alter table questions add column if not exists revisada_en timestamptz;

comment on column questions.nota_revision is
  'Por qué una pregunta quedó frenada, en palabras de quien la revisó.';

-- Buscar «lo que falta revisar» es la consulta de toda la pantalla.
create index if not exists questions_sin_revisar on questions (exam_id, orden) where not revisada;
