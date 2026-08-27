do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;
grant usage on schema public to anon, authenticated, service_role;
-- Supabase deja privilegios por defecto sobre las tablas nuevas: RLS es lo que
-- restringe, no la falta de GRANT. Se replica para que la prueba sea fiel.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
create schema if not exists auth;
create table auth.users (id uuid primary key default gen_random_uuid(), email text unique);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
