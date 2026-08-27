# Pruebas de las migraciones

Corren las migraciones contra un PostgreSQL descartable y comprueban que las
políticas hagan lo que dicen. No tocan el proyecto de Supabase.

```bash
sudo apt-get install -y postgresql
bash supabase/pruebas/correr.sh
```

`00-andamiaje.sql` replica lo que Supabase ya trae en un proyecto nuevo: los
roles `anon`, `authenticated` y `service_role`, los privilegios por defecto
sobre las tablas del esquema `public`, el esquema `auth` con su tabla `users`, y
`auth.uid()` leyendo una variable de sesión en vez del JWT.

Eso último importa: en Supabase **las tablas nuevas nacen con GRANT para `anon`
y `authenticated`**, y lo que restringe es RLS, no la falta de permisos. Sin
replicarlo, la prueba diría que todo está protegido cuando en realidad no se
habría probado nada.

`02-seguridad.sql` es la parte que vale. Comprueba, con roles reales:

| | Esperado |
|---|---|
| `anon` leyendo `questions.respuesta_correcta` | permission denied |
| `anon` haciendo `select *` en `questions` | permission denied |
| `anon` leyendo `questions_public` | anda, sin la respuesta |
| `anon` contando filas de `alertas` | 0 |
| `anon` insertando en `alertas` | anda |
| una persona leyendo `profiles` | sólo su fila |
| una persona leyendo `attempts` | sólo los suyos |
| una persona editando el perfil de otra | 0 filas afectadas |
| `service_role` leyendo la respuesta correcta | anda, es quien corrige |
