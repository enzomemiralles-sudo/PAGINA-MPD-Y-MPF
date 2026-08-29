-- Dos usuarios y contenido de ejemplo, cargado como superusuario.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111','ana@ejemplo.org'),
  ('22222222-2222-2222-2222-222222222222','beto@ejemplo.org');

insert into profiles (user_id, tipo_perfil, marca, consent_datos)
values ('11111111-1111-1111-1111-111111111111','estudiante','nexo',true),
       ('22222222-2222-2222-2222-222222222222','abogado','na',true);

-- El examen ya no lo inventa la prueba: desde 0005 hay una fila por instancia
-- y modalidad, y la prueba usa la misma que existe en producción. Se le fija
-- el id para que el resto de las pruebas lo pueda nombrar.
update exams e set id = '33333333-3333-3333-3333-333333333333'
  from concursos c
 where c.id = e.concurso_id and c.organismo = 'mpd'
   and e.instancia = 'teorico' and e.modalidad = 'multiple_choice';

insert into questions (id, exam_id, orden, enunciado, opciones, respuesta_correcta, explicacion, revisada)
values ('44444444-4444-4444-4444-444444444444','33333333-3333-3333-3333-333333333333',1,
  'La autonomía funcional del MPD surge del:', '["a","b","c"]'::jsonb, 'b',
  'Artículo 120 de la Constitución Nacional.', true);

insert into attempts (id, user_id, exam_id) values
  ('55555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333');
