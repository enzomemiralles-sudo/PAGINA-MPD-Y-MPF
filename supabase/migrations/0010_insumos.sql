-- ============================================================
-- EL BUCKET DE INSUMOS DE ESTUDIO
--
-- Los PDF y planillas que se leen para preparar el examen. Público de sólo
-- lectura: bajar puede cualquiera —el material es normativa y bibliografía,
-- no hay nada que proteger— y subir, nadie con la clave anónima.
--
-- El registro de qué hay y dónde está en `content/insumos.ts`, no en la base:
-- es una lista que cambia cuando cambia el programa del examen, y ponerla acá
-- obligaría a una migración por cada PDF nuevo.
--
-- Va envuelto en una comprobación de que exista el esquema `storage`, que lo
-- trae Supabase y no un PostgreSQL pelado. Sin eso, correr las migraciones
-- contra la base de pruebas de supabase/pruebas/ da error acá y ensucia la
-- salida de algo que sí está bien.
--
-- Idempotente, como todas: se puede correr dos veces.
-- ============================================================

do $$
begin
  if to_regclass('storage.buckets') is null then
    raise notice 'sin esquema storage: se saltea el bucket de insumos';
    return;
  end if;

  insert into storage.buckets (id, name, public)
  values ('insumos', 'insumos', true)
  on conflict (id) do update set public = true;

  -- Lectura para todo el mundo. Y nada más: sin política de insert, update ni
  -- delete, subir sólo se puede con la clave de servicio, que no sale del
  -- servidor.
  begin
    create policy "insumos: cualquiera puede bajar"
      on storage.objects for select
      using (bucket_id = 'insumos');
  exception when duplicate_object then null;
  end;
end $$;
