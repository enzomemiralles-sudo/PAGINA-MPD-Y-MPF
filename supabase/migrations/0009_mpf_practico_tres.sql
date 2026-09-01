-- ============================================================
-- El práctico del MPF trae TRES consignas, no diez.
--
-- La 0005 lo dejó en diez con este comentario:
--
--   «SUPUESTO: el MPF no publica cuántos ejercicios trae el práctico. Diez de
--    los que hay. Se corrige con un update, no tocando código (S-13).»
--
-- Éste es ese update. El dato llegó confirmado: el práctico son 3 consignas
-- en 15 minutos, dentro de una ventana total de una hora que comparte con el
-- teórico (20 preguntas en 30 minutos).
--
-- Se corrige acá y no en la 0005 porque las migraciones son historia: lo que
-- ya corrió, corrió. La instalación desde cero pasa por las dos y termina en
-- el mismo lugar.
--
-- No toca las preguntas cargadas: siguen siendo diez en el banco y el
-- simulador sortea tres por intento. `cantidad_preguntas` es cuántas trae el
-- intento, no el tamaño del banco.
-- ============================================================

update exams e
   set cantidad_preguntas = 3
  from concursos c
 where c.id = e.concurso_id
   and c.organismo = 'mpf'
   and e.instancia = 'practico'
   and e.modalidad = 'investigacion'
   and e.cantidad_preguntas <> 3;
