# ÍNDICE DE MATERIAL

Qué hay, qué falta y qué desbloquea cada cosa. Verificado contra el repo el
28/8/2026, archivo por archivo.

Estados: 🔴 falta · 🟡 convertido a JSON · 🟠 en el repo, sin publicar · 🟢 publicado en el sitio

> **Nada de esta carpeta está publicado todavía.** Ningún código lee `material/`.
> El sitio hoy tiene landing, ingreso, elección de perfil y «Mi perfil». Por eso
> no hay ningún 🟢 abajo: lo que está, está guardado, no servido.

## Lo que hay

| Archivo | Organismo | Qué es | Estado |
|---|---|---|---|
| `mpffaq.md` | MPF | 87 preguntas frecuentes, salidas del pipeline de WhatsApp | 🟠 |
| `mpd-inscripcion.md` | MPD | Guía completa de inscripción y examen, 15 secciones | 🟠 |
| `mpd-preguntas.md` | MPD | 15 respuestas para los grupos de WhatsApp | 🟠 |

Las tres son de proceso, no de estudio: explican cómo inscribirse y cómo es el
examen. **Ninguna contiene preguntas de examen con su respuesta correcta.**

### Detalle de `mpffaq.md`

Copia exacta de `output/mpf-faq.md`, verificada. No se edita a mano: se corrige
en `curacion/mpf-*.json` y se vuelve a correr la fase 3.

| Confianza | Entradas |
|---|---|
| alta | 17 |
| media | 36 |
| requiere_verificacion | 34 |

Las 34 de `requiere_verificacion` no se publican como respuesta segura sin que
alguien las mire. Es el criterio del propio pipeline, no una estimación.

### Huecos marcados en `mpd-inscripcion.md`

| Hueco | Qué necesita |
|---|---|
| `[HUECO — CONVOCATORIA]` | N° de examen, sede, período de inscripción, fecha. Sale con la resolución. Al 7/8/2026 no hay convocatoria abierta. |
| `[HUECO — link al material de Nexo]` | La carpeta de Drive *MATERIAL DE ESTUDIO*. **Ya tenemos el link del MPD.** |

## Lo que falta

Ordenado por lo que bloquea, no por organismo.

### Bloquea el simulador

| Qué | Organismo | Por qué bloquea |
|---|---|---|
| Preguntero con respuestas correctas | MPD | Sin esto no hay qué simular. La tabla `questions` está vacía. |
| Preguntero con respuestas correctas | MPF | Ídem. |
| Metodología de tipeo | MPD | El TA tiene una instancia de tipeo que no se puede evaluar sin sus reglas. |
| Práctico de ejemplo | MPF | El formato de la instancia práctica. |

Además falta escribir el cargador: hoy no hay ningún script que meta preguntas
en Supabase. `scripts/` es sólo el pipeline de FAQs.

### Bloquea el asistente

| Qué | Organismo | Por qué bloquea |
|---|---|---|
| Export de WhatsApp del grupo | MPD | La FAQ del MPD **no es un documento que se escriba**: sale del pipeline, igual que la del MPF. Falta la materia prima, no el texto. No existe `data/mpd/`. |

### Bloquea la biblioteca

| Qué | Organismo | Estado |
|---|---|---|
| Carpeta de material de estudio | MPD | **Tenemos el link.** Drive, *MATERIAL DE ESTUDIO*, de nexoderecho@gmail.com |
| Carpeta de material de estudio | MPF | Falta el link |
| Manual de inscripción | MPF | Falta |

### Marca

| Archivo | Estado |
|---|---|
| `marca/cinta-argentina.jpg` | está |
| `marca/nexo-logotipo-blanco.png` | está, pero es la versión blanca |
| Logotipo de Nueva Abogacía en color | **falta.** El código lo busca en `public/logos/nueva-abogacia.png` y mientras no esté dibuja el marcador provisional |

## Sobre la estructura

Este índice describe la carpeta como está: plana, tres archivos. La estructura
por subcarpetas (`metodologia/`, `inscripcion/`, `preguntas/`, `faq/`) tiene
sentido cuando haya volumen para separar. Hoy movería tres archivos y rompería
la ruta que `material/README.md` documenta para regenerar la FAQ.

Cuando se arme, `preguntas/` es la que importa: `crudo/` lo que llega tal cual,
`json/` lo convertido, `cargado/` lo que ya está en la base. Esa separación sí
gana algo, porque marca qué se puede volver a cargar sin duplicar.
