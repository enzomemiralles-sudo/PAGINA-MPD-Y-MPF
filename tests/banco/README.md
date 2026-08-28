# tests/banco/

Un Supabase de juguete para recorrer el sitio con sesión iniciada.

## Por qué existe

El proyecto real tiene **la confirmación por correo prendida**. Eso está bien
para producción, pero significa que un alta nueva no devuelve sesión hasta que
alguien abre un mail, y sin sesión no hay forma de ver `/elegir-perfil`, `/app`
ni `/mi-perfil`. La otra alternativa —tener la clave `service_role` a mano para
crear usuarios ya confirmados— es peor: esa clave saltea toda la seguridad y no
tiene por qué estar en una máquina de desarrollo.

Esto implementa lo mínimo que usa `@supabase/ssr` (alta, ingreso, `/user`,
refresh, logout) más los endpoints de PostgREST que toca la app. Todo en
memoria: se apaga y no queda nada.

## Cómo se usa

```bash
node tests/banco/supabase-falso.mjs &            # queda escuchando en :54321

# Los NEXT_PUBLIC_* se incrustan en el build, no se leen en tiempo de
# ejecución: hay que reconstruir apuntando al banco.
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=clave-de-juguete \
NEXT_PUBLIC_SITIO_URL=http://localhost:3000 \
npm run build && npm run start
```

`GET /__log` devuelve todas las llamadas que recibió, que es la forma más rápida
de ver si la app está hablando con quien creés.

**Antes de desplegar hay que reconstruir sin esas variables**, o el sitio queda
apuntando a un servidor que sólo existe en tu máquina.

## Lo que no hace

No valida nada: no hay RLS, no hay permisos por columna, no hay tokens de
verdad. Sirve para recorrer pantallas, no para probar seguridad. Eso se prueba
contra un PostgreSQL real, con `supabase/pruebas/`.
