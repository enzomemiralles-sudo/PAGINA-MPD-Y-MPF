# PLAN — Pestaña Simulador `/simulador`

Plan de la tanda 4, ítems S-01 a S-15. Se escribe antes del código porque hay
tres decisiones de modelo que conviene acordar ahora y no descubrir a mitad de
camino.

---

## 0. Lo primero: hoy el simulador mostraría cero preguntas

No es un detalle de implementación. Es el estado real de la base y de las
reglas del proyecto, y define qué se puede dar por terminado en esta tanda.

**Las 259 preguntas tienen `revisada: false`.** La regla del proyecto dice que
ninguna se publica así, y la política de la base la hace cumplir sola:

```sql
create policy "preguntas publicadas, lectura de filas" on questions
  for select using (
    revisada and exists (
      select 1 from exams e
      where e.id = questions.exam_id and e.publicado and e.revisado
    )
  );
```

O sea: se puede construir el motor entero, cargar las 259 y el simulador va a
funcionar de punta a punta **sin mostrar una sola pregunta**, hasta que alguien
las revise. No es un error: es la regla haciendo lo que tiene que hacer.

Lo que propongo: construir todo, cargar las preguntas con `revisada: false`, y
armar además una pantalla de revisión para poder tildarlas de a lotes. Sin esa
pantalla, revisar 259 preguntas significa 259 clics en el Table Editor de
Supabase.

**Esto necesita una decisión tuya** (ver §7).

---

## 1. Rutas

Todas dentro del grupo `(sesion)`: los intentos se guardan por persona y
`attempts.user_id` apunta a `auth.users`. Gratis no quiere decir anónimo.

| Ruta | Qué es | Ítems |
|---|---|---|
| `/simulador` | El hub. Encabezado, las dos tarjetas, cómo funciona, el aviso y el cierre. | S-01, S-02, S-07, S-08, S-10 |
| `/simulador/[organismo]` | Las dos instancias de ese organismo, con sus reglas de corrección. `organismo` es `mpd` o `mpf`. | S-02, S-14 |
| `/simulador/rendir/[intento]` | Rendir. Sirve las cuatro modalidades: la pantalla la elige la `modalidad` del examen, no la ruta. | S-03, S-04, S-05, S-06 |
| `/simulador/resultado/[intento]` | Cómo te fue. | S-12 |

Que el intento esté en la URL es lo que permite **retomar**: si se cierra la
pestaña, la persona vuelve a `/simulador` y el intento en curso sigue ahí.

---

## 2. Modelo de datos

### 2.1 Lo que agrega S-15

```sql
create type instancia_examen as enum ('teorico', 'practico');
create type modalidad_examen as enum ('multiple_choice', 'investigacion', 'tipeo');

alter table exams add column if not exists instancia instancia_examen not null default 'teorico';
alter table exams add column if not exists modalidad modalidad_examen not null default 'multiple_choice';
```

Con eso quedan las cuatro combinaciones, que son exactamente las cuatro
instancias reales:

| Organismo | Instancia | Modalidad | Preguntas que hay |
|---|---|---|---|
| MPF | teórico | `multiple_choice` | 176 |
| MPF | práctico | `investigacion` | 14 |
| MPD | teórico | `multiple_choice` | 69 |
| MPD | práctico | `tipeo` | — no lleva preguntas |

### 2.2 La decisión de fondo: un examen es una modalidad, no un examen

Hoy `questions.exam_id` es obligatorio y hay `unique (exam_id, orden)`. Eso
modela «una pregunta pertenece a un examen fijo», que sirve para reconstruir un
examen real pero no para practicar: S-11 dice intentos ilimitados y S-09 dice
que la cantidad de preguntas cambia todo el tiempo. Las dos cosas juntas
describen **un banco**, no un cuestionario fijo.

**Propuesta: una fila de `exams` es una modalidad, y `cantidad_preguntas` es
cuántas se sirven por intento.** Las 176 del MPF teórico cuelgan todas del mismo
examen; cada intento sortea 20. No hace falta tocar el esquema más allá de
S-15: `cantidad_preguntas` ya significa eso.

Al crear el intento se insertan de una las N filas de `attempt_answers` con
`respuesta = null`. Eso fija qué preguntas tocaron —si no, un intento
abandonado no sabe qué había sorteado— y de paso hace que retomar sea leer esas
filas.

Los exámenes reconstruidos (`tipo = 'oficial_reconstruido'`, como el de CABA)
entran igual: son una fila más con `cantidad_preguntas = 10`, y como tiene
exactamente 10 preguntas el sorteo devuelve siempre las mismas.

### 2.3 La corrección va del lado del servidor, sin excepción

`respuesta_correcta` no es legible por `anon` ni por `authenticated`: está
cortada por GRANT de columna, no por RLS. Eso está probado contra un PostgreSQL
real y no se toca.

La consecuencia práctica: **corregir necesita el cliente de servicio**
(`lib/supabase/admin.ts`), y por lo tanto `SUPABASE_SERVICE_ROLE_KEY` tiene que
estar cargada en Vercel. Hasta ahora no hacía falta; desde esta tanda, sí.

Corregir es una acción de servidor que:
1. comprueba que el intento sea de quien lo pide;
2. lee las respuestas correctas con el cliente de servicio;
3. escribe `attempt_answers.correcta` y `attempts.puntaje`;
4. devuelve el resultado ya calculado.

Nunca viaja la respuesta correcta al navegador antes de terminar el intento.

---

## 3. Puntajes: de dónde sale cada número (S-13)

Nada fijo en el código. Todo sale de la fila de `exams`.

| | MPD teórico | MPD tipeo | MPF teórico | MPF práctico |
|---|---|---|---|---|
| Duración | 30 min | *(ver §6)* | 30 min | ~15 min |
| Preguntas por intento | 10 | — | 20 | *(a definir)* |
| Correcta | +10 | — | +10 | +10 |
| Incorrecta | −10 | — | −10 | −10 |
| En blanco | 0 | — | 0 | 0 |
| Arranca en | 0 | 100 | 0 | 0 |
| Cada error | — | −5 | — | — |
| Aprueba con | 60 | 60 | 60 | 60 |

El MPD sale del instructivo de la DGN y está confirmado contra un examen real.
**El MPF no publica su puntaje**: usamos la escala del MPD por decisión tuya, y
la pantalla tiene que decir que es orientativa. Eso ya está escrito en
`material/metodologia/mpf-formato-examen.md`.

El tipeo no encaja en las columnas actuales —arranca en 100 y resta— así que se
resuelve con `puntos_correcta = 0`, `puntos_incorrecta = -5` y un
`puntaje_inicial` que hay que agregar, o dejando que el motor de tipeo lo
calcule aparte. **Propongo agregar `puntaje_inicial smallint not null default
0`**: es una columna y evita un caso especial en el código.

---

## 4. Componentes

```
app/(sesion)/simulador/
  page.tsx                      hub
  [organismo]/page.tsx          las dos instancias
  rendir/[intento]/page.tsx     rendir
  resultado/[intento]/page.tsx  resultados

components/simulador/
  TarjetaOrganismo.tsx      servidor · la tarjeta grande de MPF / MPD
  TarjetaInstancia.tsx      servidor · teórico / práctico, con su regla de puntaje
  ComoFunciona.tsx          servidor · los cuatro pasos (S-07)
  AvisoOrientativo.tsx      servidor · el aviso de no oficialidad (S-08)
  ReglasDePuntaje.tsx       servidor · S-14, dentro del flujo, no como venta
  MotorPreguntas.tsx        cliente  · el examen de opción múltiple
  Cronometro.tsx            cliente  · cuenta regresiva, avisa al servidor al llegar a 0
  GrillaPreguntas.tsx       cliente  · el navegador de preguntas, como el real
  MotorTipeo.tsx            cliente  · el tipeo (§6)
  Resultado.tsx             servidor · S-12

lib/acciones/simulador.ts   crear intento · guardar respuesta · entregar · corregir
lib/simulador/puntaje.ts    el cálculo, puro y testeable sin base
lib/simulador/tipeo.ts      comparación y conteo de errores, puro y testeable
```

Lo puro separado de lo que toca la base a propósito: el cálculo de puntaje y la
comparación del tipeo se prueban con vitest sin levantar nada.

---

## 5. Estados

**Del intento** (`estado_intento`, ya existe): `en_curso` · `finalizado` ·
`expirado`.

- `en_curso` → se puede retomar. El hub muestra «Retomar» en vez de «Comenzar».
- `finalizado` → se entregó a mano.
- `expirado` → se acabó el tiempo y se entregó solo, con lo que hubiera.

**De cada respuesta**: sin responder · respondida · marcada para revisar. La
columna `marcada` ya está en `attempt_answers`.

**De la pantalla al rendir**: cargando · rindiendo · guardando (autosave) ·
entregando · corregido.

El autosave escribe `attempt_answers` en cada cambio, con debounce. Si se corta
la luz se pierde, como mucho, la última respuesta.

---

## 6. El tipeo (S-06) — lo que sé y lo que no

### Lo que está confirmado

Sale del instructivo de la DGN y lo confirma la captura del examen real:

- Se parte de **100 puntos** y se resta **5 por error**. Aprueba con **60**.
  O sea: **doce errores y afuera**.
- Hay que copiar un texto respetando **acentuación, puntuación, negritas,
  subrayados, cursivas, MAYÚSCULAS y minúsculas, tabulaciones y espacios**.
- **La marginación no cuenta.**
- El editor real tiene barra de formato: deshacer, rehacer, negrita, cursiva,
  subrayado, tachado, subíndice, superíndice, alineaciones, viñetas,
  numeración y sangrías.
- El instructivo desaconseja los atajos de teclado para el formato.

### Lo que falta (bloquea dar S-06 por terminado)

1. **Cuántos caracteres tiene el texto.** Sin esto no se puede calibrar la
   dificultad ni decir cuánto falta.
2. **Qué cuenta como un error.** ¿Un carácter mal es un error? ¿Una palabra mal
   es un error? ¿Una negrita que falta es un error, o son tantos errores como
   caracteres tenga? La diferencia es enorme: con 100 puntos y −5, doce errores
   de carácter es un descuido y doce errores de palabra es otra cosa.
3. **Si los 30 minutos son de todo el examen o sólo del teórico.** El
   instructivo dice 30 minutos para la sesión; la captura muestra el
   cronómetro corriendo durante el tipeo. Lo más probable es que sea uno solo
   para las dos instancias, pero *probable* no alcanza para un simulador que
   dice medir.
4. **Un texto de ejemplo real**, con su formato. Los que hay en la captura
   están cortados.

### Cómo lo dejo mientras tanto

Componente **esbozado y parametrizable**, con los supuestos escritos en el
código y en pantalla:

```ts
/** SUPUESTO — sin confirmar. Ver PLAN-SIMULADOR.md §6. */
export const SUPUESTOS_TIPEO = {
  // Un error = un carácter que no coincide. Es el criterio más duro de los
  // posibles, así que si el real es por palabra, el simulador exige de más y
  // no de menos: preferible a que alguien practique creyendo que aprueba.
  unidadDeError: "caracter",
  // El texto del ejemplo, hasta tener uno real.
  caracteresAproximados: 900,
  // Compartido con el teórico, hasta que se confirme.
  minutos: 30,
} as const;
```

En pantalla, un aviso corto: que el criterio de error es un supuesto y que el
puntaje es orientativo hasta confirmar la metodología.

**Lo que necesito que me pases** está en §7.

---

## 7. Lo que hace falta de tu lado

| # | Qué | Bloquea | Por qué |
|---|---|---|---|
| 1 | **Decisión: cómo se revisan las 259 preguntas.** ¿Te armo una pantalla de revisión para tildarlas de a lotes, o preferís el Table Editor? | S-03, S-05 y en los hechos toda la tanda | Sin `revisada = true` el simulador no muestra ninguna |
| 2 | **Decisión: los temas.** ¿Las etiqueto con la taxonomía del Drive del MPF —género, MPF, historia, formación ética, constitucional, CPPF— o sacamos el desglose por tema de esta versión? | S-12 | Ninguna de las 259 tiene `tema`, y sin tema no hay «desempeño por tema» |
| 3 | **`SUPABASE_SERVICE_ROLE_KEY` en Vercel.** | corregir cualquier examen | La respuesta correcta no la puede leer el navegador; corregir necesita el cliente de servicio |
| 4 | **Metodología del tipeo**: caracteres, criterio de error, si los 30 minutos son de todo el examen, y un texto de ejemplo real. | S-06 | §6 |
| 5 | **Cuántas preguntas sirve el práctico del MPF.** | S-04 | Tengo 14 y el oficial no publica el número |

Los puntos 1 y 2 son decisiones de una línea. El 3 son cinco minutos en el
panel. El 4 es el único que depende de conseguir información.

---

## 8. Orden de trabajo

1. Migración `0005`: `instancia`, `modalidad`, `puntaje_inicial`. Probada
   contra PostgreSQL real, como las otras.
2. Cargador de preguntas: script que sube los JSON de
   `material/preguntas/json/` a `questions`, idempotente, con las cuatro filas
   de `exams`.
3. `lib/simulador/puntaje.ts` y sus tests. Es puro: se prueba primero.
4. Hub y elección de instancia (S-01, S-02, S-07, S-08, S-10, S-14).
5. Motor de opción múltiple + autosave + cronómetro (S-03, S-04, S-05).
6. Corrección del lado del servidor y pantalla de resultados (S-12).
7. Motor de tipeo esbozado (S-06).
8. Pantalla de revisión, si la decisión del punto 1 la pide.

Los pasos 1 a 6 no dependen de nada tuyo salvo la clave de servicio. El 7
depende de la metodología y el 8 de tu decisión.

---

## 9. S-09, que es regla y no redacción

**En ningún lugar de la interfaz aparece la cantidad de preguntas del banco.**
Ni en las tarjetas, ni en el hub, ni en los resultados.

Lo que sí aparece, porque es información que la persona necesita para rendir:

- **Cuántas trae el intento** («pregunta 7 de 20»). Eso no es el tamaño del
  banco, es la longitud de este examen, y sale de `exams.cantidad_preguntas`.
- Cuántas acertó y cuántas erró al terminar.

Para hablar del banco: «amplia base de preguntas», «contenido en constante
actualización», «múltiples instancias de práctica».

Un test va a recorrer los textos de `content/simulador.ts` buscando números
sueltos al lado de la palabra «preguntas», para que la regla no dependa de que
alguien se acuerde.
