# Conectar Supabase, paso a paso

Esto se hace una sola vez. Son cuatro pasos y no hace falta saber programar.

Al terminar, la gente va a poder crear cuenta y entrar en
https://peron-delta.vercel.app

> **Para el despliegue que ya está andando, los pasos 1, 2 y 3 están hechos.**
> El proyecto vive en la region `sa-east-1`, las diez tablas estan instaladas
> con sus dieciseis politicas, y la URL y la clave publica quedaron en
> `.env.production`. Lo que falta es el paso 4. Los cuatro pasos siguen escritos
> completos porque son las instrucciones para levantar el sitio de cero: otro
> entorno, otra cuenta, o rehacerlo si algun dia hay que empezar de nuevo.

---

## Paso 1 · Crear el proyecto

1. Entrá a **supabase.com** y creá una cuenta (podés entrar con GitHub, es lo
   más rápido).
2. Botón verde **New project**.
3. Te pide cuatro cosas:
   - **Organization**: la que te haya creado sola. Sirve.
   - **Name**: `nexo-na` o lo que quieras. Es interno.
   - **Database Password**: apretá **Generate a password** y **guardala en
     algún lado**. No la vas a necesitar para esto, pero si algún día la
     perdés no se recupera.
   - **Region**: elegí **South America (São Paulo)**. Es la más cerca, y de eso
     depende que la página responda rápido acá.
4. **Create new project**. Tarda uno o dos minutos en quedar listo.

---

## Paso 2 · Crear las tablas

1. En la barra de la izquierda, **SQL Editor**.
2. **New query**.
3. Abrí el archivo `supabase/instalar.sql` de este repo, copiá **todo** el
   contenido y pegalo ahí.
4. **Run** (o `Ctrl`/`Cmd` + `Enter`).

Tiene que decir **Success**. Con eso quedaron las 10 tablas, las políticas de
seguridad y la vista que protege las respuestas correctas.

> **Si te dio error, o si ya lo habías intentado antes:** volvé a pegar este
> mismo archivo y apretá Run de nuevo. Está hecho para poder correrse las veces
> que haga falta: lo que ya existe lo saltea en vez de fallar. Lo probamos
> corriéndolo cuatro veces seguidas.
>
> Sólo si aun así no sale, está `supabase/reiniciar.sql`, que borra todo para
> empezar de cero. Es el último recurso, no el primero.

**No corras además los archivos de `supabase/migrations/` por separado.**
`instalar.sql` ya los contiene a todos, en orden.

> **Si ya lo habías corrido antes, corrélo otra vez.** Cada vez que sumamos una
> tabla nueva, `instalar.sql` la trae. Ahora trae `consultas`, que es donde caen
> los mensajes del formulario de contacto: sin ella el formulario valida, dice
> que salió bien y no guarda nada. Correrlo de nuevo no rompe lo que ya está.

---

## Paso 3 · Presentarle la base al sitio

Hasta acá tenés dos cosas que no se conocen entre sí: la base de datos que
acabás de crear en Supabase, y el sitio que ya está andando en Vercel. Este
paso es presentarlas.

El sitio necesita tres datos para hablarle a la base: **dónde está**, una
**llave para entrar como visitante** y una **llave de dueño** que usa sólo el
servidor.

Los dos primeros son públicos por diseño: viajan al navegador de cualquiera que
entre al sitio. Lo que protege la base no es esconderlos, sino las políticas RLS
y los permisos por columna. Por eso en este repo viven en `.env.production`, que
sí se commitea. El tercero, la llave de dueño, saltea todas esas reglas y por eso
**no está en el repo ni tiene que estarlo**: va en un tablero aparte de Vercel
que se llama *Environment Variables*. Hoy no hace falta —ningún código la usa
todavía—; la va a necesitar el simulador, para leer las respuestas correctas sin
mandarlas al navegador.

Un valor cargado en ese tablero le gana al archivo, porque Vercel lo inyecta como
variable real del proceso y Next.js no pisa lo que ya existe. Mover las dos
públicas al panel, si preferís tenerlas ahí, no requiere tocar código.

### 3·A — Buscar los tres datos en Supabase

En Supabase, abajo a la izquierda hay un engranaje: **Project Settings**.
Adentro, buscá **API** (en paneles nuevos puede decir **API Keys**).

Ahí vas a ver, en este orden:

- **Project URL** — algo como `https://abcdefgh.supabase.co`. Es la dirección
  de tu base.
- **La llave de visitante** — un texto larguísimo. Según la versión del panel
  dice `anon`, `public` o `publishable`. Cualquiera de esas es la que va: son
  la misma cosa con nombres distintos según cuándo se creó el proyecto.
- **La llave de dueño** — dice `service_role` o `secret`, y viene tapada con un
  botón *Reveal* o un ojito. Hacé clic para verla.

Al lado de cada una hay un botón de copiar. Vas a copiar de a una.

> ⚠️ **La llave de dueño no se comparte.** La de visitante es pública: viaja al
> navegador de cualquiera que entre al sitio, y por eso la base está protegida
> con reglas que la limitan. La de dueño saltea todas esas reglas. No la pegues
> en un chat —tampoco en uno conmigo—, ni en el código, ni en ningún casillero
> cuyo nombre empiece con `NEXT_PUBLIC_`.

### 3·B — Pegarlos en Vercel

Ahora en **vercel.com**, entrá al proyecto **peron** → **Settings** →
**Environment Variables**.

Vas a ver un formulario con dos casilleros: uno para el **nombre** (*Key* o
*Name*) y otro para el **valor** (*Value*). Cargás uno, apretás **Save**, y el
formulario se vacía para el siguiente. **Son cuatro veces.**

| # | En el casillero del nombre | En el casillero del valor |
|---|---|---|
| 1 | `NEXT_PUBLIC_SUPABASE_URL` | la Project URL |
| 2 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la llave de visitante |
| 3 | `SUPABASE_SERVICE_ROLE_KEY` | la llave de dueño |
| 4 | `NEXT_PUBLIC_SITIO_URL` | `https://peron-delta.vercel.app` |

El nombre se escribe **exactamente así**, en mayúsculas y con los guiones
bajos. Si te comés una letra, el sitio no lo encuentra. La cuarta no sale de
Supabase: es la dirección de tu propio sitio, y sirve para que los enlaces que
llegan por mail vuelvan al lugar correcto.

Si te pregunta en qué entornos aplicarla (*Production*, *Preview*,
*Development*), dejá los tres tildados.

> **Falta un último clic, y es el que más se olvida.** Vercel no aplica las
> variables nuevas al sitio que ya está publicado: hay que volver a
> desplegarlo. Andá a **Deployments**, buscá el de más arriba, abrí el menú
> `⋯` y elegí **Redeploy**. Sin esto, seguís viendo la versión vieja y parece
> que nada funcionó.

---

## Paso 4 · Decirle a Supabase a dónde volver

Cuando alguien entra con Google o hace clic en el mail de recuperación,
Supabase necesita saber a qué dirección devolverlo. Si no se lo decís, lo
rechaza.

En Supabase: **Authentication** → **URL Configuration**.

- **Site URL**: `https://peron-delta.vercel.app`
- **Redirect URLs**: agregá estas dos, una por línea:
  - `https://peron-delta.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

**Save**.

---

## Cómo saber si funcionó

1. Entrá a https://peron-delta.vercel.app/ingresar
2. Poné un mail tuyo y una contraseña de 8 caracteres o más → **Crear cuenta**.
3. Te va a decir que revises el correo. Confirmá desde el mail.
4. Volvé a entrar. Tiene que llevarte a elegir perfil.
5. En Supabase, **Table Editor** → tabla **profiles**: tiene que haber una fila
   con tu perfil y tu marca.

Si llegaste hasta ahí, está todo conectado.

---

## Dos cosas que te pueden trabar

**El mail de confirmación no llega, o llega muy lento.** Supabase gratis manda
los correos con un servidor compartido y muy limitado: unos pocos por hora. Si
estás probando, conviene apagar la confirmación mientras tanto:
**Authentication** → **Sign In / Providers** → **Email** → destildá
**Confirm email**. Acordate de volver a prenderlo antes de abrirlo al público.

**Google no anda todavía.** El botón «Continuar con Google» necesita una
configuración aparte, en **Authentication** → **Sign In / Providers** →
**Google**, y para eso hace falta crear credenciales en Google Cloud. No es
necesario para arrancar: con mail y contraseña alcanza. Cuando quieras, lo
vemos por separado.

---

## Si además querés correr la app en tu máquina

Sólo hace falta si vas a programar localmente. Para que el sitio funcione,
no.

1. En la carpeta del proyecto, creá un archivo llamado `.env.local`.
2. Pegá adentro las mismas cuatro variables, con este formato:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITIO_URL=http://localhost:3000
```

3. `npm install && npm run dev`, y abrís `localhost:3000`.

`.env.local` está en `.gitignore`: no se sube al repo. Que siga así.
