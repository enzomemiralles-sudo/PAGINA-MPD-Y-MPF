\pset pager off
\echo '=== el rename perfil -> marca ==='
select column_name from information_schema.columns
 where table_name='profiles' and column_name in ('perfil','marca');
\echo ''
\echo '=== columnas que tienen que aceptar nulo ==='
select column_name, is_nullable from information_schema.columns
 where table_name='profiles' and column_name in ('nombre','apellido','marca','tipo_perfil','dni','telefono','fecha_aceptacion')
 order by column_name;
\echo ''
\echo '=== el trigger de updated_at funciona ==='
update profiles set dni='12345678' where user_id='11111111-1111-1111-1111-111111111111';
select (updated_at > created_at) as updated_at_se_movio from profiles
 where user_id='11111111-1111-1111-1111-111111111111';
\echo ''
\echo '=== la fecha de aceptación se puede guardar y onboarding arranca en false ==='
select onboarding_completado, fecha_aceptacion is null as sin_aceptar_todavia
 from profiles where user_id='22222222-2222-2222-2222-222222222222';
\echo ''
\echo '=== columnas que expone la vista publica (no tiene que estar la respuesta) ==='
select string_agg(column_name, ', ' order by ordinal_position) as columnas
 from information_schema.columns where table_name='questions_public';
\echo ''
\echo '=== RLS activo en todas las tablas ==='
select tablename, rowsecurity from pg_tables
 where schemaname='public' order by tablename;
\echo ''
\echo '=== las cuatro instancias de 0005 (una fila por modalidad) ==='
select c.organismo, e.instancia, e.modalidad, e.duracion_minutos, e.cantidad_preguntas,
       e.puntos_correcta, e.puntos_incorrecta, e.puntaje_inicial, e.puntaje_minimo
  from exams e join concursos c on c.id = e.concurso_id
 order by c.organismo, e.instancia;
\echo ''
\echo '=== correr 0005 dos veces no duplica exámenes (tienen que seguir siendo 4) ==='
select count(*) as exams from exams;
