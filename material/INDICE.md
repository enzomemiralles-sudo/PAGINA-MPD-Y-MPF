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
| `metodologia/mpd-formato-examen.md` | MPD | Estructura, puntaje y reglas del tipeo | 🟡 |
| `metodologia/mpf-formato-examen.md` | MPF | Estructura, temario y bibliografía | 🟡 |
| `preguntas/json/mpf-modelos-manual.json` | MPF | 167 preguntas con respuesta | 🟡 |
| `preguntas/json/mpf-preguntero-nexo.json` | MPF | 23 preguntas con respuesta | 🟡 |
| `preguntas/json/mpd-examen-caba.json` | MPD | 10 preguntas de un examen real | 🟡 |

**200 preguntas convertidas**, cada una con sus tres opciones y su respuesta.
Ninguna está cargada todavía: falta el script que las suba y falta la revisión
de `preguntas/REVISAR.md`.

### De dónde sale la respuesta correcta

De ningún lado escrito: en los dos documentos de Nexo está **resaltada en
verde**, con un rectángulo dibujado detrás del renglón. `scripts/preguntas_pdf.py`
la deduce de la superposición geométrica entre cada línea y esos rectángulos, y
verifica que cada pregunta termine con exactamente un resaltado y tres opciones.

Eso vuelve el JSON regenerable: si aparece una versión corregida de un PDF, se
reemplaza en `preguntas/crudo/` y se corre el script de nuevo.

```bash
python3 scripts/preguntas_pdf.py
```

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

Ya nada. Todo lo que necesita está.

| Qué | Organismo | Estado |
|---|---|---|
| Preguntas con respuesta correcta | MPF | ✅ 190 |
| Preguntas con respuesta correcta | MPD | ✅ 59 |
| Reglas de puntaje y tipeo | MPD | ✅ del instructivo, confirmadas contra un examen real |
| Reglas de puntaje | MPF | ✅ decididas: se usa la escala del MPD, declarada como orientativa |

Falta el cargador: ningún script sube preguntas a Supabase todavía. Eso es
código, no material.

### Bloquea el asistente

| Qué | Organismo | Estado |
|---|---|---|
| Export de WhatsApp del grupo | MPD | 🔴 **no existe todavía**, y no es un olvido |

El grupo del MPD **todavía no tiene conversación**: se va a llenar cuando salgan
las fechas y la gente empiece a preguntar. Hasta entonces no hay corpus, y el
pipeline no tiene de dónde sacar nada.

La consecuencia práctica: **el asistente arranca sabiendo del MPF y no del MPD.**
Eso hay que decirlo en pantalla en vez de dejar que alguien pregunte por el MPD
y reciba una respuesta inventada o vacía. La cautela acá es la funcionalidad,
no una limitación que haya que disimular.

### Bloquea la biblioteca

| Qué | Organismo | Estado |
|---|---|---|
| Carpeta de material de estudio | MPD | ✅ [MATERIAL DE ESTUDIO](https://drive.google.com/drive/folders/1Cetf622l_4iwmPdSGYq56LtfNGVsFNpk) — ya enlazada desde `mpd-inscripcion.md` |
| Carpeta de material de estudio | MPF | ✅ [MATERIAL DE ESTUDIO](https://drive.google.com/drive/folders/1IzjQ4Y0rMe_JEMD0w8qaAB3fauCFNPHq) — seis carpetas, una por eje del examen |
| Manual de inscripción | MPF | ⏸ se sale sin él; se actualiza después |

La del MPF está ordenada por los mismos ejes que evalúa el examen: GENERO,
MINISTERIO PUBLICO FISCAL, HISTORIA ARGENTINA, FORMACION ETICA Y CIUDADANA,
SISTEMA CONSTITUCIONAL y NUEVO CODIGO PENAL PROCESAL FEDERAL. Sirve como
taxonomía para etiquetar las preguntas por tema.

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
