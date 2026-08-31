-- ============================================================
-- 0007 — Las consultas que el asistente no supo responder (A-12).
--
-- Es la parte del asistente que lo hace mejorar. Cuando alguien pregunta algo
-- y la respuesta es roja, lo que falta no es una respuesta mejor: es saber
-- qué le hace falta a la gente y no está en el material. Esta tabla es ese
-- registro.
--
-- Guarda también la consulta original y el organismo elegido, porque sin eso
-- una entrada dice «no encontré nada» y no se puede hacer nada con ella.
--
-- El correo es opcional a propósito: dejar la duda no debería costar dar el
-- mail. Quien lo deja es porque quiere que le avisen.
--
-- Mismo criterio de seguridad que `consultas` y `alertas`: cualquiera puede
-- dejar una, nadie puede leer la lista. Un formulario público que devuelve lo
-- que escribieron otros es una filtración, y acá el texto puede traer
-- cualquier cosa.
--
-- Se puede correr más de una vez sin romper.
-- ============================================================

create table if not exists consultas_sin_respuesta (
  id uuid primary key default gen_random_uuid(),
  -- Lo que la persona escribió, tal cual.
  consulta text not null,
  -- Sobre qué concurso preguntaba. `ambos` es «no estoy seguro», que también
  -- es un dato: si se repite, el material no está distinguiendo bien.
  organismo organismo_interes not null,
  -- Opcional. Sólo para avisarle cuando la respuesta exista.
  email citext,
  -- Si llegó por el estado rojo del asistente o por el formulario de abajo,
  -- que está siempre disponible. Son dos momentos distintos y conviene poder
  -- separarlos.
  origen text not null default 'asistente',
  -- Se marca a mano cuando la consulta se convirtió en material.
  resuelta boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists consultas_sin_respuesta_created_at_idx
  on consultas_sin_respuesta (created_at desc);

-- Para leer de un vistazo qué es lo que más falta.
create index if not exists consultas_sin_respuesta_pendientes_idx
  on consultas_sin_respuesta (organismo, created_at desc)
  where not resuelta;

alter table consultas_sin_respuesta enable row level security;

drop policy if exists "consultas sin respuesta, alta anónima" on consultas_sin_respuesta;
create policy "consultas sin respuesta, alta anónima"
  on consultas_sin_respuesta for insert with check (true);

-- RLS filtra filas, no columnas. El grant por columna es lo que impide que
-- alguien se marque su propia consulta como resuelta al insertarla.
revoke all on consultas_sin_respuesta from anon, authenticated;
grant insert (consulta, organismo, email, origen)
  on consultas_sin_respuesta to anon, authenticated;
