# PLAN — Plataforma Nexo Derecho × Nueva Abogacía

Estado: **esperando visto bueno.** No escribo código hasta que apruebes esto.

---

## 0. Dos cosas que bloquean el arranque

**`referencia/landing-preview.html` no está en el repo.** Es la única pieza sin la
cual no puedo empezar el Bloque 1: el brief dice que es la fuente de verdad del
diseño y que no la reinterprete. Sin el archivo, portar la landing sería
exactamente reinterpretarla. Todo lo demás de este plan está resuelto; el mapeo de
tokens (§3) queda con los slots nombrados y vacíos hasta que llegue.

**Los dos binarios de `marca/` tampoco están.** Me pasaste las imágenes en el chat
y las vi —la cinta celeste y blanca sobre negro, el logotipo en blanco— pero
llegaron como adjuntos de la conversación, no como archivos del repo. No puedo
escribir los bytes al disco desde acá. Necesito los dos subidos a la rama.

Lo que sí puede avanzar sin nada de eso: el proyecto en Vercel, el esquema de
Supabase con RLS, las fuentes, el andamiaje de `content/` y el test de contraste.
Si querés, arranco por ahí mientras conseguís el preview.

---

## 1. Estructura de carpetas

```
app/
  layout.tsx                      data-marca="dual", fuentes, pie legal
  page.tsx                        landing
  (auth)/ingresar/page.tsx
  (auth)/auth/callback/route.ts
  (app)/registro/page.tsx
  (app)/nexo/page.tsx             home puerta Nexo
  (app)/na/page.tsx               home puerta Nueva Abogacía
  (app)/simulador/[examId]/page.tsx
  (app)/simulador/resultado/[attemptId]/page.tsx
  admin/                          layout con guard + exámenes + preguntas
  legales/{privacidad,terminos}/page.tsx
  api/attempts/[id]/{autosave,finalizar}/route.ts

components/
  landing/                        hero, cinta, secciones, captura de email
  marca/                          ConmutadorMarca, LogoNexo, LogoNuevaAbogacia
  simulador/                      Cronometro, Pregunta, Navegador, Resultados
  ui/                             shadcn

content/                          TODOS los textos. Ningún string en componentes
lib/
  supabase/{client,server,admin}.ts
  examenes/{puntaje,contrafactico,tiempo}.ts
  marca/{tokens,contraste}.ts
styles/tokens.css                 variables CSS por [data-marca]
supabase/migrations/
tests/contraste.test.ts
```

`content/` es un módulo TS por sección exportando objetos tipados, no JSON: quiero
que un texto faltante rompa el build, no que renderice vacío.

---

## 2. Orden de implementación

Sigo tus bloques sin tocarlos. Dentro de cada uno, este orden:

**Bloque 1 · día 1.** Repo + Vercel desde el primer commit → `tailwind.config.ts`
y `styles/tokens.css` con los tokens del preview → next/font (Archivo variable +
JetBrains Mono) → migraciones de Supabase con RLS → landing portada → captura de
email a `alertas` → pie legal → `.env.example`.

Ordeno así porque el deploy y el esquema no dependen del preview y la landing sí.

**Bloque 2 · día 2.** Magic link → callback → `profiles` con el formulario de
registro (Zod + RHF) → `/admin` con guard por rol → pegar JSON de exámenes y
preguntas → publicar/despublicar/marcar revisada.

**Bloque 3 · días 3-5.** Motor del simulador → autosave → corrección server-side →
resultados con el contrafáctico → homes de cada puerta → pasada completa a 375px.

Bloques 4 y 5 quedan como los definiste. No los detallo hasta cerrar el 3.

---

## 3. Mapeo de tokens

Lo que ya está fijado por el brief:

| Token | dual | nexo | na |
|---|---|---|---|
| `--fondo` | `#08090A` | `#08090A` | `#08090A` |
| `--acento` | — | `#059249` plano | `#0059BA` en gradiente |
| `--acento-texto` | — | `#53B384` | `#00B9AE` |
| `--naranja` | — | `#F58220` | no existe |

Reglas que se derivan solas y que voy a codificar:

- Ningún componente lee la marca. Solo `var(--acento)`, `var(--acento-texto)`,
  `var(--superficie)`. El conmutador cambia `data-marca` en el root y nada más.
- `--acento` nunca se usa en texto ni en enlaces. Solo títulos y botones.
- Cambio de puerta: 700ms sobre color, background y `font-variation-settings`.
- El naranja y la itálica condensada solo existen bajo `[data-marca="nexo"]`;
  el gradiente solo bajo `[data-marca="na"]`.

**Slots que salen del preview y que hoy no puedo completar:** las dos curvas de
easing y las tres duraciones · la escala tipográfica y los ejes de variación de
Archivo · el tratamiento de vidrio (blur, saturación, alfa del fondo, borde) ·
la rampa de superficies y bordes · los valores de la viñeta del hero · la máscara
del destello de la cinta · el marcador provisorio del logo de NA.

**Sobre el test de contraste**, una precisión que conviene meter desde el
principio: no alcanza con probar cada `--acento-texto` contra `--fondo`. Las
superficies de vidrio son más claras que el fondo base, así que el par que puede
fallar es texto sobre vidrio, no texto sobre negro. El test recorre el producto
cartesiano de tokens de texto × tokens de superficie, en las tres marcas, y falla
si alguno baja de 4,5:1. Calcula el contraste, no lo compara contra una tabla
escrita a mano.

---

## 4. Decisiones y supuestos

Cinco cosas que el brief no cierra y que resuelvo así salvo que digas otra cosa.

**a) Las respuestas correctas se filtran por RLS, y RLS es por fila, no por
columna.** "Contenido publicado, lectura pública" sobre `questions` publicaría
`respuesta_correcta` a cualquiera con la anon key. Propongo: `questions` sin
acceso público, y una vista `questions_public` que expone todo menos
`respuesta_correcta` y `explicacion`. El simulador lee de la vista; la corrección
corre server-side con service role. Es el requisito duro de "las respuestas no se
mandan al cliente antes de finalizar", pero hecho en la base y no en el cliente.

**b) Falta una columna para el contrafáctico.** La pantalla de resultados tiene
que mostrar "qué habría pasado dejando en blanco las dudosas", y "dudosas" son las
que el usuario marcó para revisar. `attempt_answers` no guarda eso. Agrego
`marcada boolean not null default false`.

**c) El examen del MPF no entra en una fila de `exams`.** Son dos pruebas con
duraciones distintas (20 preguntas en 30 min + 3 consignas en 15 min) dentro de una
ventana de 1 hora. Y la parte práctica es desarrollo escrito, cuya corrección
automática está explícitamente fuera de alcance. Propongo: **el simulador del MPF
es la teórica y nada más** —20 preguntas, 30 minutos, es lo que se puede corregir
y puntuar—. Las 3 consignas van a la biblioteca como práctica sin puntaje, en el
Bloque 4. Es la versión "andando hoy"; fingir que corregimos un escrito sería peor
que no ofrecerlo.

**d) El tipeo del MPD sí entra en el modelo, con una vuelta de tuerca.** Un examen
de `tipo` informático es una fila de `exams` con `puntos_incorrecta = -5` y
`puntaje_minimo = 60`, y una sola fila en `questions` con `tipo = 'tipeo'` cuyo
enunciado es el texto a copiar. El motor de corrección es otro —compara formato,
no opciones— así que lo dejo para el Bloque 4 y en el 3 va solo el múltiple choice.
`// SUPUESTO:` lo anoto en el código.

**e) `concursos.estado` maneja el acomodarse solo de la landing.** Con el MPD en
`sin_convocatoria` la sección de fechas no se renderiza —nada de "próximamente"— y
el bloque de alertas pasa a ser el llamado principal. Cuando el estado cambie a
`fecha_confirmada`, la sección aparece sola y el llamado baja de jerarquía. Sin
deploy de por medio.

---

## 5. El corpus del asistente (Bloque 5, para que no sorprenda después)

Ya medí `material/mpffaq.md` contra la curación: 87 entradas, **17 de confianza
alta, 36 media y 34 que requieren verificación**, y **18 con respuestas
contradictorias registradas**.

O sea que casi el 40% del corpus no se puede afirmar y una de cada cinco entradas
tiene el desacuerdo documentado. Eso no es un problema del corpus, es la
característica: el asistente que muestra las dos respuestas y dice "esto hay que
confirmarlo contra la convocatoria" es más útil que uno que elige. El chunking
conserva `confianza` y `respuestas_contradictorias` como metadatos, no como texto,
para que el prompt pueda ramificar sobre ellos.

---

## 6. Riesgos

| Riesgo | Qué hago |
|---|---|
| El preview no llega hoy | Arranco por deploy + esquema + fuentes, que no dependen de él |
| El autosave a 15s contra Supabase en 4G mala | Upsert de una fila por respuesta, no del intento entero; reintento con backoff |
| El día 6 llega con el Bloque 3 a medias | Corto el simulador a un solo examen del MPD y muevo el resto a fase 2 |
| Contenido publicado sin revisar | `revisada = false` no se renderiza nunca; lo hace la vista, no el componente |
