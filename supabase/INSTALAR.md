# Conectar Supabase, paso a paso

Esto se hace una sola vez. Son cuatro pasos y no hace falta saber programar.

Al terminar, la gente va a poder crear cuenta y entrar en
https://peron-delta.vercel.app

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
`instalar.sql` ya los contiene a los tres, en orden.

---

## Paso 3 · Copiar las claves a Vercel

Son tres valores. Están en Supabase, en **Project Settings** (el engranaje
abajo a la izquierda) → **API**.

En paneles más nuevos la sección puede llamarse **API Keys** y los nombres
cambian un poco. Lo que buscás es esto:

| Lo que copiás | Cómo se llama en Supabase | Cómo se llama en Vercel |
|---|---|---|
| La dirección del proyecto | **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| La clave pública | **anon** / **public** / **publishable** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| La clave secreta | **service_role** / **secret** | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **La tercera es la peligrosa.** La `service_role` saltea toda la
> seguridad: quien la tenga puede leer y borrar cualquier cosa. Nunca la
> pegues en un chat, en el código, ni en una variable que empiece con
> `NEXT_PUBLIC_`. Va sólo en Vercel, en el casillero que dice
> `SUPABASE_SERVICE_ROLE_KEY`.

Ahora en **Vercel** → proyecto **peron** → **Settings** → **Environment
Variables**. Agregá las tres, más una cuarta:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | la Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | la clave secreta |
| `NEXT_PUBLIC_SITIO_URL` | `https://peron-delta.vercel.app` |

Dejá tildados los tres entornos (Production, Preview, Development) si te lo
pregunta.

**Después de guardarlas hay que volver a desplegar**, si no el sitio sigue
andando con la versión vieja: **Deployments** → el de más arriba → menú `⋯` →
**Redeploy**.

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
