\set ON_ERROR_STOP off
\pset pager off
\echo '=== 1 · anon intenta leer la respuesta correcta (tiene que FALLAR) ==='
set role anon;
select respuesta_correcta from questions;
\echo ''
\echo '=== 2 · anon intenta select * en questions (tiene que FALLAR: * incluye la respuesta) ==='
select * from questions;
\echo ''
\echo '=== 3 · anon lee la vista questions_public (tiene que ANDAR, sin la respuesta) ==='
select id, orden, enunciado from questions_public;
\echo ''
\echo '=== 4 · anon intenta leer la lista de mails (tiene que devolver CERO filas) ==='
reset role; insert into alertas (email, organismo) values ('secreto@ejemplo.org','mpd');
set role anon;
select count(*) as mails_visibles_para_anon from alertas;
\echo ''
\echo '=== 5 · anon intenta dejar su mail (tiene que ANDAR) ==='
insert into alertas (email, organismo) values ('nuevo@ejemplo.org','mpd');
\echo ''
\echo '=== 6 · Ana logueada ve su propio perfil y NO el de Beto ==='
reset role; set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select count(*) as perfiles_visibles_para_ana from profiles;
select tipo_perfil, marca from profiles;
\echo ''
\echo '=== 7 · Ana intenta ver los intentos de otros (sólo tiene que ver el suyo) ==='
reset role; insert into attempts (user_id, exam_id) values ('22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333');
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select count(*) as intentos_visibles_para_ana from attempts;
\echo ''
\echo '=== 8 · Ana intenta editar el perfil de Beto (tiene que afectar CERO filas) ==='
update profiles set dni = '00000000' where user_id = '22222222-2222-2222-2222-222222222222';
\echo ''
\echo '=== 9 · el servidor con service_role sí lee la respuesta (para corregir) ==='
reset role; set role service_role;
select respuesta_correcta from questions;
reset role;
\echo ''
\echo '=== 10 · anon deja una consulta de contacto (tiene que ANDAR) ==='
set role anon;
insert into consultas (nombre, email, motivo, mensaje)
  values ('Quien Sea', 'quien@ejemplo.org', 'tecnico', 'No me llega el mail de confirmación.');
\echo ''
\echo '=== 11 · anon intenta leer las consultas (tiene que dar PERMISO DENEGADO) ==='
select count(*) from consultas;
\echo ''
\echo '=== 12 · anon intenta borrarlas (tiene que dar PERMISO DENEGADO) ==='
delete from consultas;
reset role;
