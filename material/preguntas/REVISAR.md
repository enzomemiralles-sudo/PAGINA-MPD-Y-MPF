# Preguntas que necesitan un ojo humano

Salió de convertir los PDF a JSON. Nada de esto lo puede decidir el parser:
son cosas que hay que mirar contra la fuente antes de publicar.

Mientras estén acá, las preguntas van con `revisada: false`.

## 1. Una respuesta marcada que está mal

**`mpf-preguntero-nexo` #3** — *«Para fomentar la inmigración europea, durante
los últimos años del siglo XIX se dictaron las leyes de:»*

El preguntero marca **a) Vivienda, Promoción de la navegación y Aduanas**.

El manual de modelos, en su #119, marca la otra: **Educación laica, gratuita y
obligatoria, Matrimonio Civil y Registro Civil**. Esa es la respuesta histórica
—son las leyes laicas de la década de 1880, y se dictaron justamente para que
inmigrantes no católicos pudieran casarse, anotar hijos y educarlos—.

Los dos documentos son de Nexo y se contradicen. **Hay que corregir el
preguntero**, no publicar las dos versiones.

## 2. Un enunciado cortado

**`mpf-preguntero-nexo` #20** — *«Aunque las diferentes formas de violencia
contra la mujer generalmente aparecen de manera concomitante, entre estos ¿de
qué modo específico se ejerce violencia»*

La frase termina ahí, en el PDF original. Falta el tipo de violencia por el que
se pregunta, y sin eso la pregunta no se puede responder: las tres opciones
apuntan a tipos distintos (simbólica, económica, psicológica). **Falta el
original completo.**

Otros tres enunciados quedan sin signo de cierre, pero se entienden y no
bloquean nada: `mpf-modelos-manual` #4, #39 y #92.

## 3. Dos versiones de la misma pregunta con opciones distintas

**`mpf-modelos-manual` #22 y #127** — *«Entre los principios que rigen el sistema
acusatorio se encuentra:»*, con **publicidad** en una y **simplicidad** en la
otra. Las dos son defendibles según cómo se enumeren los principios. Conviene
quedarse con una sola versión o citar la norma en la explicación.

## 4. Las respuestas del MPD quedaron cruzadas

Ya no es un pendiente: **las diez preguntas de `mpd-examen-caba` aparecen las
diez en `mpd-guia-preguntas`, y en las diez la opción que marcó quien rindió es
la misma que marca la guía.** Dos fuentes independientes —un examen real y el
documento de Nexo— diciendo lo mismo.

Por eso esas diez pasaron a `confianza: alta` y llevan `corroborada_por`. Las
otras 49 de la guía siguen en `media`: son la palabra de una sola fuente, que
es lo normal, no un problema.

El cruce lo hace `scripts/preguntas_pdf.py` solo, cada vez que corre. Si mañana
aparece otro examen capturado, corrobora más preguntas sin que nadie toque nada.

## 5. Las de búsqueda web no se pueden simular tal cual

Las que arrancan con «Realice una búsqueda web…» dependen de la estructura
vigente del MPF y de que la persona tenga internet abierto. Sirven como práctica
del formato, pero su respuesta puede quedar vieja sin que nadie se entere.
Conviene marcarlas aparte y revisarlas cada convocatoria.
