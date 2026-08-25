# PLAN — Plataforma Nexo Derecho × Nueva Abogacía

Estado: **esperando visto bueno.** No escribo código hasta que apruebes esto.

Preview leído completo (711 líneas). Material leído. Nada bloqueado.

---

## 0. Los tres archivos que faltaban ya están

El preview traía embebidos los dos binarios de `marca/`, así que los extraje del
propio HTML en lugar de pedírtelos de nuevo:

- `marca/cinta-argentina.jpg` — 1200×960, salía del data-URI de `--cinta-img`
- `marca/nexo-logotipo-blanco.png` — 560×137 RGBA, salía del `<img>` del header
- `referencia/landing-preview.html` — guardado tal cual lo subiste

---

## 1. Estructura de carpetas

```
app/
  layout.tsx                      data-marca, fuentes, pie legal
  page.tsx                        landing
  (auth)/ingresar/page.tsx
  (auth)/auth/callback/route.ts
  (app)/registro/page.tsx
  (app)/nexo/page.tsx · (app)/na/page.tsx
  (app)/simulador/[examId]/page.tsx
  (app)/simulador/resultado/[attemptId]/page.tsx
  admin/                          layout con guard + exámenes + preguntas
  legales/{privacidad,terminos}/page.tsx
  api/attempts/[id]/{autosave,finalizar}/route.ts

components/
  landing/    Hero · Cinta · PreguntaFirma · FranjaEstado · MaquetaSimulador ·
              Numeros · PuertasGrid · CapturaEmail
  marca/      ConmutadorPuerta · LogoNexo · LogoNuevaAbogacia · Vidrio · Revelar
  simulador/  Cronometro · Pregunta · Navegador · Resultados
  ui/         shadcn

content/                          TODOS los textos, un módulo TS por sección
lib/
  supabase/{client,server,admin}.ts
  examenes/{puntaje,contrafactico,tiempo}.ts
  marca/{tokens,contraste}.ts
styles/tokens.css
supabase/migrations/
tests/contraste.test.ts
```

Tres componentes se ganan existir solos porque el preview los repite en todos
lados: `Vidrio` (la superficie con el borde enmascarado y la luz que sigue al
puntero), `Revelar` (el `.rev` + IntersectionObserver) y `ConmutadorPuerta`.

`LogoNuevaAbogacia` aísla el marcador provisorio: hoy es el círculo con gradiente
y el cartelito "provisorio", y el día que llegue el vectorial se cambia en un
solo archivo.

---

## 2. Orden de implementación

**Bloque 1 · día 1.** Repo + Vercel → `styles/tokens.css` y `tailwind.config.ts`
con los tokens de §3 → next/font (Archivo variable con eje `wdth` 62..125 e
itálica, JetBrains Mono) → migraciones con RLS → landing portada → captura de
email a `alertas` → pie legal → `.env.example`.

**Bloque 2 · día 2.** Magic link → callback → `profiles` (Zod + RHF) → `/admin`
con guard → pegar JSON de exámenes y preguntas → publicar / despublicar /
marcar revisada.

**Bloque 3 · días 3-5.** Motor del simulador → autosave → corrección server-side
→ resultados con el contrafáctico → homes de cada puerta → pasada a 375px.

Bloques 4 y 5 como los definiste.

---

## 3. Mapeo de tokens

Todo sale del preview. Los nombres son los suyos, en castellano, y los conservo:
renombrarlos a inglés sería reescribir el sistema.

### Base (no cambian por marca)

| Token | Valor |
|---|---|
| `--tinta` / `--tinta-alta` | `#08090A` / `#101216` |
| `--papel` | `#F4F2ED` |
| `--papel-tenue` / `--papel-débil` | `rgba(244,242,237,.55)` / `.35` |
| `--linea` / `--linea-fuerte` | `rgba(244,242,237,.10)` / `.20` |
| `--ok` / `--error` | `#4ADE80` / `#E5484D` |

### Por marca

| Token | dual | nexo | na |
|---|---|---|---|
| `--acento` | `#F4F2ED` | `#059249` | `#0059BA` |
| `--acento-texto` | `#F4F2ED` | `#53B384` | `#00B9AE` |
| `--acento-2` | `transparent` | `#F58220` | `transparent` |
| `--superficie` | `rgba(244,242,237,.03)` | `rgba(31,72,56,.30)` | `rgba(0,136,196,.07)` |
| `--mancha-a` / `-b` | `#059249` / `#0088C4` | `#059249` / `#0d6b3c` | `#0059BA` / `#00B9AE` |
| `--relleno` | `135deg,#059249,#0088C4` | `135deg,#059249,#0d7a3d` | `135deg,#0059BA,#0088C4,#00B9AE` |
| `--ancho-titulo` / `--ancho-h2` | `118` / `112` | `76` / `76` | `104` / `100` |
| `--ital-h2` | `0` | `1` | `0` |
| `--cinta-op` | `.62` | `.16` | `.16` |

`--ancho-*` alimenta `font-variation-settings:'wdth'`, y ahí está el cambio de
puerta más visible: 118 → 76 es Archivo pasando de ancho a condensado. La
itálica de Nexo va por `--ital-h2`, no por una clase.

### Movimiento

| Token | Valor | Para qué |
|---|---|---|
| `--sal` | `cubic-bezier(.22,1,.36,1)` | entradas |
| `--suave` | `cubic-bezier(.4,0,.2,1)` | micro |
| `--t-micro` | `150ms` | hover de botones, chips, opciones |
| `--t-elem` | `420ms` | entrada de un elemento |
| `--t-sec` | `700ms` | cambio de puerta, barras de progreso |

Entradas: `.rev` con `opacity` + `translate3d(0,14px,0)`, escalonado de **70ms**
por hijo, IntersectionObserver a **threshold .15** con `rootMargin
'0px 0px -8% 0px'`, una sola vez (`unobserve` al entrar).

### Vidrio y cinta

`.vidrio`: fondo `rgba(244,242,237,.012)`, `backdrop-filter: blur(6px)`, radio
16px, `box-shadow: inset 0 1px 1px rgba(244,242,237,.10)`, y el borde como
`::before` con gradiente vertical enmascarado (`mask-composite: exclude`) que se
ilumina arriba y abajo y desaparece en el medio.

Cinta: `mix-blend-mode: screen`, `background-position: 72% 58%` (`64% 62%` en
≤640px), tres animaciones con períodos primos entre sí — deriva 38s, respiración
14s, destello 9s — y el destello enmascarado con la propia cinta. La viñeta es
el `::after` del wrap: radial al 26% de altura más un lineal arriba y abajo.

---

## 4. Cinco conflictos entre el preview y las reglas de aprobación

El brief dice que el preview manda en diseño y que el contraste AA no se negocia.
En cinco puntos las dos cosas no pueden ser ciertas a la vez. Propongo resolver
así; decime si estás de acuerdo antes de que lo codifique.

**a) El titular del hero es ilegible en su tramo final.** El gradiente de
`.brillo` arranca en `#04170E` y termina en `#05413F`. Contra `--tinta` eso da
**1,08:1 y 1,74:1** — y como el gradiente barre con `background-size:200%` cada
7s, el tramo oscuro pasa por todas las palabras. En el render, "Público." casi
desaparece. Es además el elemento LCP.

Propongo levantar los tres stops que no pasan (`#04170E`, `#056B37` que da 3,0:1,
y `#05413F`) al color más cercano del mismo tono que llegue a 4,5:1 — algo como
`#12924E`, `#0C9450` y `#0E8F88`. El recorrido de tonos y el barrido quedan
iguales; solo sube el piso de luminancia.

**b) `--papel-débil` no llega a AA y está en todos lados.** `rgba(244,242,237,.35)`
sobre `--tinta` da **2,93:1**. Lo usan los eyebrows, la franja de números, los
"quién es quién" de las tarjetas y —esto es lo que más pesa— **el aviso de no
oficialidad del pie**, que por tu propia regla va en todas las páginas.

El mínimo que pasa es `.48`. Propongo `--papel-débil: .50` (4,90:1) y subir
`--papel-tenue` de `.55` a `.70` (8,77:1) para no aplastar la jerarquía de dos
niveles que el preview tiene hoy.

**c) Tres títulos de sección son invisibles en la landing.** En `inscripcion` los
eyebrows usan `color: var(--acento-2, #F58220)`. En dual y en na `--acento-2` es
`transparent`, y el fallback no entra porque la variable **está** definida. Lo
verifiqué en Chromium: `rgba(0, 0, 0, 0)`. "Antes de empezar", "El error clásico"
y "Nadie te avisa" no se ven en la marca por defecto.

Mismo problema en `.gq.marc`: el anillo de "marcada" del simulador desaparece en
dual y na. Ahí duele más, porque marcar para revisar es requisito duro y el
contrafáctico de resultados se apoya en eso.

Propongo un token propio, `--marca-revisar`, que valga `#F58220` en Nexo y un
naranja neutro en dual y na. El naranja sigue siendo exclusivo de Nexo como
lenguaje de marca; lo que dejaría de ser exclusivo es *poder ver la marca de
revisar*, que es funcional, no decorativo.

**d) El vidrio se anima al scrollear, y tu regla lo prohíbe.** `.rev` se aplica a
los hijos directos de cada sección, y muchos de esos hijos son `.vidrio` con
`backdrop-filter`. Animar opacidad sobre un elemento con backdrop-filter es
justo la combinación cara que pedís evitar.

Propongo que `Revelar` envuelva al `Vidrio` en vez de aplicarse sobre él: anima
un div sin filtro y el vidrio queda quieto adentro. Mismo efecto, sin recomponer
el blur en cada cuadro.

**e) El cambio de puerta está escrito a 600ms, no a 700.** Las transiciones de
`body background`, `h1/h2 font-variation-settings` y `.eyebrow::before` dicen
`.6s ease`, pero el sistema de movimiento del final define `--t-sec: 700ms` y el
brief también dice 700ms. Parecen restos de antes de que existiera el sistema de
tokens. Unifico en `var(--t-sec) var(--suave)`.

---

## 5. Decisiones de modelo

**a) `questions_public`.** "Contenido publicado, lectura pública" sobre
`questions` publicaría `respuesta_correcta` a cualquiera con la anon key: RLS es
por fila, no por columna. La tabla queda sin acceso público y el simulador lee
una vista sin `respuesta_correcta` ni `explicacion`. La corrección corre
server-side con service role.

**b) `attempt_answers.marcada boolean`.** Sin esa columna no se puede calcular
"qué habría pasado dejando en blanco las dudosas".

**c) El simulador del MPF es la teórica.** Son 20 preguntas en 30 min más 3
consignas de desarrollo en 15, y corregir desarrollo está fuera de alcance. Las
3 consignas van a biblioteca sin puntaje, en el Bloque 4.

**d) El tipeo del MPD entra como `exams` con una `questions` de `tipo='tipeo'`,**
con `puntos_incorrecta = -5` y `puntaje_minimo = 60`. Motor de corrección propio,
Bloque 4.

**e) `concursos.estado` decide qué secciones existen.** El preview ya está escrito
para el estado de hoy: la franja de estado dice "Sin convocatoria publicada · MPD"
y "Examen 2026 disponible · MPF", y el cierre dice "Todavía no hay fecha". Todo
eso sale de la tabla, no del texto.

---

## 6. Números que hoy están escritos a mano

En `.numeros`: `59` preguntas del MPD, `87` dudas del MPF, `20.000` colegas,
`100%` gratis. Y en la pregunta firma, "Hay 58 preguntas más como esta".

Los tres primeros salen de la base: `count(questions)` sobre exámenes del MPD
publicados y revisados, `count` de entradas del corpus, y el de comunidad
etiquetado como comunidad. El `58` es `count - 1` de la misma consulta.

Verifiqué el `87` contra el corpus real y coincide. De esas 87: **17 de confianza
alta, 36 media, 34 requieren verificación**, y **18 tienen respuestas
contradictorias registradas**. Casi el 40% no se puede afirmar — que es
exactamente lo que el asistente del Bloque 5 tiene que saber mostrar.

Los números de la maqueta del simulador (24 respondidas, +180, los porcentajes por
tema) son ilustración de producto, no métricas: quedan fijos y no pretenden salir
de ningún lado.

---

## 7. Riesgos

| Riesgo | Qué hago |
|---|---|
| El presupuesto de `backdrop-filter` | header y conmutador son fijos y cuentan siempre: quedan 4 para contenido. Las secciones de 3 tarjetas están justo en el límite |
| `filter:url(#ruido)` sobre `.agua` en ≥1024px | queda, pero medido: si mueve el LCP, se recorta a `@media (min-width:1280px)` |
| La cinta compitiendo con el LCP | `priority={false}`, y el hero no entra con animación |
| El día 6 con el Bloque 3 a medias | corto a un solo examen del MPD y muevo el resto a fase 2 |
