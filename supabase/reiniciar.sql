-- ============================================================
-- BORRAR TODO Y EMPEZAR DE NUEVO
--
-- Sólo si la instalación falló a la mitad y querés reintentar. Borra las
-- tablas del proyecto y todo lo que tengan adentro. NO toca las cuentas de
-- usuario: eso vive en el esquema auth, que maneja Supabase.
--
-- Después de correr esto, pegá supabase/instalar.sql de nuevo.
-- ============================================================

drop view if exists questions_public;

drop table if exists attempt_answers cascade;
drop table if exists attempts cascade;
drop table if exists questions cascade;
drop table if exists exams cascade;
drop table if exists concursos cascade;
drop table if exists profiles cascade;
drop table if exists alertas cascade;
drop table if exists resources cascade;
drop table if exists videos cascade;
drop table if exists events cascade;

drop function if exists tocar_updated_at() cascade;

drop type if exists organismo cascade;
drop type if exists perfil_organizacion cascade;
drop type if exists organismo_interes cascade;
drop type if exists estado_concurso cascade;
drop type if exists tipo_examen cascade;
drop type if exists tipo_pregunta cascade;
drop type if exists nivel_confianza cascade;
drop type if exists estado_intento cascade;
drop type if exists tipo_perfil_usuario cascade;
drop type if exists conocio_por cascade;
drop type if exists trabajo_juridico cascade;
