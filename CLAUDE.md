# El proyecto, para Claude Code

Plataforma gratuita para preparar el **ingreso democrático** (Técnico
Administrativo) del **MPD** y del **MPF**. La sostienen dos agrupaciones
nacidas en la Facultad de Derecho de la UBA: **Nexo Derecho** (estudiantes) y
**Nueva Abogacía** (abogados y abogadas).

En producción: <https://peron-delta.vercel.app>, que despliega solo desde
`main`.

## Ojo con el README

`README.md` documenta el **pipeline de Python** que fabricó las FAQ a partir de
un export de WhatsApp. No documenta la página. Son dos mitades del mismo
repositorio y la que se toca todos los días es la de abajo:

| Carpeta | Qué es |
|---|---|
| `app/` | Rutas de Next.js. `app/(sesion)/` es el grupo con sesión iniciada. |
| `components/`, `lib/`, `content/`, `styles/` | La aplicación. |
| `supabase/` | Migraciones, `instalar.sql` y el banco de preguntas. |
| `tests/` | Vitest. |
| `referencia/` | Los HTML de referencia del diseño. **Fuente de verdad de los valores.** |
| `scripts/`, `material/`, `data/`, `output/`, `curacion/` | El pipeline de Python y su material. |

## Los comandos

```bash
npm ci           # instalar (no npm install: manda el lockfile)
npm run dev      # desarrollo en localhost:3000
npm run typecheck && npm run lint && npm test && npm run build
```

Las cuatro últimas son exactamente lo que corre el CI
(`.github/workflows/verificar.yml`). **Correlas antes de pushear**: un push que
pone el CI en rojo cuesta una vuelta entera.

El sitio **arranca sin Supabase configurado** —usa los datos de prueba de
`lib/datos.ts`— y el CI construye así a propósito. Si un cambio rompe eso,
está mal.

## Reglas que no se negocian

**Nada de `any`.** Lo hace fallar ESLint. TypeScript va en `strict` con
`noUncheckedIndexedAccess`.

**Contraste.** `#0059BA` sobre fondo oscuro da 2.8:1: **nunca** para texto. Lo
mismo `#059249`. Para texto se usa `--acento-texto`. `tests/contraste.test.ts`
**calcula** el contraste, no lo afirma, y falla por debajo de 4.5:1 — si toca
color, corré ese test.

**Un solo eje: la marca.** `data-marca` va en la raíz (`dual | neutro | nexo |
na`) y los tokens salen de ahí. **Ningún componente puede contener
`if (marca === 'nexo')`.** Si aparece esa condición, la diferencia va en el
token, no en el componente.

**Lo que distingue las puertas** (y sólo esto):

- El naranja `#F58220` es **exclusivo de Nexo**.
- La itálica condensada en títulos es **exclusiva de Nexo**.
- Nexo va en color plano; **Nueva Abogacía siempre en degradé** azul→turquesa.
- Todo texto y todo link de la piel Nueva Abogacía usa `#00B9AE`. El azul sólo
  en degradés y superficies, nunca en tipografía.

**Sección sin datos, sección que no se renderiza.** Nada de «próximamente» ni
placeholders visibles en producción. Los huecos declarados
(`components/guia/Huecos.tsx`) sólo se dibujan con
`NEXT_PUBLIC_MOSTRAR_PLACEHOLDERS=true`, que por defecto está apagada.

**No cargues preguntas a mano.** Para eso está el panel `/admin`, donde se
pegan como JSON. Tampoco toques la lógica de `revisada` ni el scoring del
simulacro sin que te lo pidan.

**Las imágenes.** La FRONTAL (simétrica) va sólo en la pestaña pública; la
PERSPECTIVA (columnata) sólo en la home de cada puerta. Ninguna de las dos en
simulador, asistente, inscripción, formularios ni legales.

**Los cinco conflictos ya resueltos** (no los reabras sin preguntar):

1. `--acento` está **prohibido** en la zona de respuestas del simulador, y la
   corrección nunca se comunica sólo por color.
2. La cabecera con sesión lleva únicamente el logo del perfil; el otro va al pie.
3. Los lemas van arriba a la derecha.
4. El pie lleva el wordmark gigante.
5. `#059249` nunca pinta texto.

Cancelados y no vuelven: el fileteado, la cinta argentina en el hero, la cuenta
regresiva y la tira de estado de concursos. El hero es el elemento LCP y **no
anima en entrada**.

## Secretos

`SUPABASE_SERVICE_ROLE_KEY` **saltea todo el RLS**: quien la tiene lee y borra
cualquier fila de cualquier tabla. Nunca en el código, nunca en el chat, nunca
en una variable `NEXT_PUBLIC_*`. Vive sólo en el panel de Vercel.

`.env.local` está en `.gitignore` y ahí se queda. `.env.production` **sí** está
versionado a propósito: sólo tiene las dos claves públicas, que de todos modos
viajan al navegador. Lo que protege la base son las políticas RLS y los GRANT
por columna de `supabase/migrations/0001`.

## La base

Las migraciones son **idempotentes**: bloques `DO`, `if not exists`, guardas con
`to_regclass`. El test las corre dos veces, así que tienen que aguantarlo.

Si agregás una migración, **regenerá el instalador**:

```bash
python3 scripts/instalar_sql.py
```

`tests/instalar.test.ts` comprueba que `supabase/instalar.sql` esté al día.

## El idioma

Código, comentarios, commits y documentación **en castellano rioplatense**. Los
comentarios explican *por qué*, no *qué*: el qué ya lo dice el código.

## Antes de decir que algo está hecho

Está en `COMO-TRABAJAR.md`, y es la regla que más se incumple: **no marques
nada que no hayas visto funcionando en el navegador, a 375 px y a 1440 px.**
Que compile no es que ande.
