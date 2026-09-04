# Cómo se trabaja acá

No es burocracia: cada regla de acá salió de algo que ya nos costó una vuelta.
Si sos nuevo, leé esto entero una vez. Después se vuelve automático.

## El ritmo: de a una tanda

Se trabaja **tanda por tanda**, y la tanda la define quien la pide. Una tanda
es un bloque de ítems de `CAMBIOS.md` que se hacen, se verifican y se mergean
juntos.

No se agarra media tanda y se deja el resto colgando, y no se agrega de motu
proprio lo que no estaba pedido. Si aparece algo que claramente hay que
arreglar y no estaba en la lista, se dice y se pregunta.

## Los cuatro archivos

| Archivo | Qué es |
|---|---|
| `CAMBIOS.md` | **La lista maestra.** Todo ítem tiene código (`P-13`, `I-04`, `B-07`) y un `[ ]` o `[x]`. Es el estado real del proyecto. |
| `PENDIENTES.md` | Lo que falta **del lado de las personas**, no del código: claves que cargar, material que subir, preguntas que revisar. |
| `CLAUDE.md` | Las reglas técnicas. Claude Code lo lee solo en cada sesión. |
| `COMO-TRABAJAR.md` | Esto. |

`PLAN.md`, `PLAN-SIMULADOR.md` y `PROGRESO.md` son históricos: sirven para
entender por qué algo quedó como quedó, no para saber qué falta.

## Tildar un ítem

**En el mismo commit que el cambio.** Un `[x]` que llega en otro commit es un
`[x]` que se olvida.

Y la regla que más se incumple:

> **No marques nada que no hayas visto funcionando en el navegador, a 375 px y
> a 1440 px.**

Que compile no es que ande. Que pasen los tests no es que ande. Ya nos pasó
tres veces: imágenes en una carpeta que Next no sirve, botones que llevaban a
archivos inexistentes, un `<main>` invisible por chocar con una clase
decorativa. Las tres compilaban y las tres pasaban los tests.

Si no lo podés ver —porque falta material, porque no tenés acceso—, **dejalo
sin tildar y decilo.** Un ítem sin tildar es información; un ítem tildado de
más es una mentira que alguien va a descubrir en producción.

## Cuando algo está bloqueado

`CAMBIOS.md` tiene una sección **PENDIENTES BLOQUEANTES** con los códigos `B-`.
Son cosas que faltan del lado de las personas: material que no llegó, ejemplos
de examen, videos.

Si un ítem depende de uno de esos, **no lo improvises**: dejalo sin tildar y
avisá. Inventar contenido para llenar un hueco es peor que el hueco.

## Cuando algo es ambiguo

Preguntá antes de decidir. Una pregunta cuesta un mensaje; una interpretación
equivocada cuesta la tanda entera y hay que rehacerla.

## El flujo de git

```bash
git checkout -b claude/lo-que-sea      # nunca se trabaja sobre main
# ... los cambios, y el [x] en CAMBIOS.md en el mismo commit
npm run typecheck && npm run lint && npm test && npm run build
git push -u origin claude/lo-que-sea
```

Después, pull request contra `main`. **`main` va directo a producción**, así
que nada se mergea con el CI en rojo.

El mensaje del commit cuenta **qué cambió y por qué**, no qué archivos se
tocaron —eso ya está en el diff—. Si corregís algo que estaba mal, decilo
derecho: «esto estaba mal y así se arregla» le sirve al que lo lea en seis
meses.

## Antes de pushear

Las cuatro comprobaciones, en este orden, que es el de lo que cuesta arreglar:

```bash
npm run typecheck   # los tipos dicen dónde está el error
npm run lint        # nada de any
npm test            # 351 tests
npm run build       # el más lento, el que menos falla solo
```

Es exactamente lo que corre el CI. Correrlas localmente evita la vuelta.

## Verificar en el navegador

Buena parte del sitio pide sesión. Para ver una pantalla con sesión iniciada
sin tener cuenta, se puede parchear `middleware.ts` y `lib/perfil.ts` **en
local y sin commitear**. Si hacés eso, revisá `git status` antes del commit:
un parche de esos que se escapa al repositorio abre el sitio entero.

Dos trampas conocidas del navegador:

- **`next/image` carga perezoso.** Una imagen que nunca entró al viewport
  reporta `naturalWidth === 0` y parece rota sin estarlo. Hay que recorrer la
  página antes de medir. Lo mismo con los pasos de un acordeón cerrado.
- **`scroll-behavior: smooth`** hace que Playwright reintente para siempre
  («element is not stable»). Se arregla con
  `page.emulateMedia({ reducedMotion: "reduce" })`.

## Los datos de la gente son datos de la gente

En la base hay personas reales: mails, y en algunos perfiles DNI y teléfono.

- Las capturas de pantalla que se suban **no pueden mostrar datos de nadie**.
  Ya hubo que difuminar una. Antes de subir una captura sacada con sesión
  iniciada, miralá.
- `input/` y `private/` están en `.gitignore` porque tienen los exports de
  WhatsApp sin anonimizar. Ahí se quedan.
- El repositorio es **público**. Lo que entra al historial de git no sale más.
