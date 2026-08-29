-- ============================================================
-- El simulador necesita distinguir las cuatro instancias reales (S-15) y
-- poder puntuar el tipeo, que arranca en 100 y resta.
--
-- La idea que ordena el archivo: **una fila de `exams` es una modalidad, no
-- un examen fijo**. El MPF teórico es una sola fila con todas sus preguntas
-- colgando, y `cantidad_preguntas` pasa a significar «cuántas se sortean por
-- intento». Es lo único compatible con S-11 (intentos ilimitados) y con S-09
-- (la base cambia todo el tiempo): un cuestionario fijo se agota, un banco no.
--
-- Se puede correr más de una vez sin romper, como las anteriores.
-- ============================================================

-- ---------- tipos ----------
do $$ begin
  create type instancia_examen as enum ('teorico', 'practico');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type modalidad_examen as enum ('multiple_choice', 'investigacion', 'tipeo');
exception when duplicate_object then null;
end $$;

-- ---------- exámenes ----------
alter table exams add column if not exists instancia instancia_examen not null default 'teorico';
alter table exams add column if not exists modalidad modalidad_examen not null default 'multiple_choice';

-- El tipeo parte de 100 y resta 5 por error. Sin esta columna habría que
-- tratarlo como caso especial en el código, y S-13 dice justo lo contrario:
-- los puntajes salen de la tabla, nunca del código.
alter table exams add column if not exists puntaje_inicial smallint not null default 0;

comment on column exams.cantidad_preguntas is
  'Cuántas preguntas se sortean por intento. No es el tamaño del banco.';
comment on column exams.puntaje_inicial is
  'Puntaje de partida. 0 en opción múltiple; 100 en el tipeo, que resta.';

-- Una modalidad por concurso e instancia: es lo que hace que cargar las
-- preguntas dos veces no duplique exámenes.
create unique index if not exists exams_concurso_instancia_modalidad
  on exams (concurso_id, instancia, modalidad);

-- ---------- respuestas de un intento ----------
-- El orden del sorteo. Sin esto, un intento que sacó 20 de 176 no sabe en qué
-- orden mostrarlas, y «pregunta 7 de 20» cambiaría entre recargas.
alter table attempt_answers add column if not exists orden smallint not null default 0;

-- ---------- la vista pública gana el organismo ----------
-- Se puede saber de qué organismo es una pregunta sin poder ver su respuesta.
-- Hasta ahora había que ir a buscarlo a exams -> concursos a mano, y la
-- métrica de la portada consultaba una columna que la vista no tenía.
drop view if exists questions_public;
create view questions_public
  with (security_invoker = true) as
  select q.id, q.exam_id, q.orden, q.enunciado, q.tipo, q.opciones,
         q.fuente_normativa, q.tema, q.subtema, q.dificultad, q.destacada_home,
         q.confianza,
         c.organismo, e.instancia, e.modalidad
  from questions q
  join exams e     on e.id = q.exam_id
  join concursos c on c.id = e.concurso_id;

grant select on questions_public to anon, authenticated;

comment on view questions_public is
  'Preguntas sin respuesta_correcta ni explicacion. Es la única puerta de
   lectura para el cliente: la corrección corre en el servidor con service
   role. security_invoker mantiene RLS y los grants por columna.';

-- ============================================================
-- Las cuatro instancias
--
-- Los números del MPD salen del instructivo de la DGN y están confirmados
-- contra un examen real. El MPF no publica su puntaje: usa la escala del MPD
-- por decisión del proyecto, y la pantalla lo dice.
--
-- publicado/revisado en true: la configuración está revisada. Lo que sigue
-- cerrado es cada pregunta, con revisada = false, que es donde tiene que
-- estar el freno.
-- ============================================================
insert into exams (
  concurso_id, titulo, instancia, modalidad,
  duracion_minutos, cantidad_preguntas,
  puntos_correcta, puntos_incorrecta, puntos_blanco,
  puntaje_inicial, puntaje_minimo, tipo, publicado, revisado
)
select c.id, v.titulo, v.instancia::instancia_examen, v.modalidad::modalidad_examen,
       v.duracion, v.cantidad, v.correcta, v.incorrecta, 0,
       v.inicial, 60, 'practica'::tipo_examen, true, true
from (values
  ('mpf', 'Examen teórico',            'teorico',  'multiple_choice', 30, 20,  10, -10,   0),
  -- SUPUESTO: el MPF no publica cuántos ejercicios trae el práctico. Diez de
  -- los que hay. Se corrige con un update, no tocando código (S-13).
  ('mpf', 'Examen práctico',           'practico', 'investigacion',   15, 10,  10, -10,   0),
  ('mpd', 'Examen teórico',            'teorico',  'multiple_choice', 30, 10,  10, -10,   0),
  -- Tipeo: un texto por intento, se parte de 100 y cada error resta 5.
  ('mpd', 'Examen práctico de tipeo',  'practico', 'tipeo',           30,  1,   0,  -5, 100)
) as v(org, titulo, instancia, modalidad, duracion, cantidad, correcta, incorrecta, inicial)
join concursos c
  on c.organismo = v.org::organismo and c.cargo = 'Técnico administrativo' and c.anio = 2026
on conflict (concurso_id, instancia, modalidad) do update set
  titulo             = excluded.titulo,
  duracion_minutos   = excluded.duracion_minutos,
  cantidad_preguntas = excluded.cantidad_preguntas,
  puntos_correcta    = excluded.puntos_correcta,
  puntos_incorrecta  = excluded.puntos_incorrecta,
  puntaje_inicial    = excluded.puntaje_inicial,
  puntaje_minimo     = excluded.puntaje_minimo,
  publicado          = excluded.publicado,
  revisado           = excluded.revisado;
