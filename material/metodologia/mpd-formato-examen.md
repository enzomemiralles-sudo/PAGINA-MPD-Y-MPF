# MPD — cómo es el examen y cómo se corrige

Fuentes, en orden de autoridad:

1. **Reglamento para el Ingreso de Personal al Ministerio Público de la
   Defensa**, texto ordenado conforme Res. DGN 1124/15, artículos 25 a 29
   ([PDF oficial](https://www.mpd.gov.ar/users/concursos/REGLAMENTO%20PARA%20EL%20INGRESO%20DE%20PERSONAL%20AL%20MPD%20-texto%20ordenado%20conf%20Res%201124-15-.pdf)).
   Es la norma: fija el puntaje, el criterio de error y la duración.
2. *Instructivo del Sistema de Evaluación para Exámenes de la Secretaría de
   Concursos* (`mpd-instructivo-examen.pdf`), que explica cómo se rinde.
3. La captura de un examen real rendido
   (`../preguntas/crudo/mpd-examen-caba.pdf`), que confirma cada número.

Esto es la especificación del simulador: si algo de acá no se cumple, el
simulador miente.

## Estructura

El examen de Técnico Administrativo tiene **dos instancias en una sola sesión**:

1. **Diez preguntas** de opción múltiple, tres opciones cada una.
2. **Un ejercicio de tipeo**, que aparece a continuación de las diez.

## Puntaje — son dos escalas distintas

**Teórico**

| | |
|---|---|
| Respuesta correcta | **+10** |
| Respuesta incorrecta | **−10** |
| Sin responder | **0** |
| Máximo | 100 |
| Mínimo para aprobar | 60 |

Que la incorrecta reste lo mismo que suma la correcta cambia la estrategia por
completo: **dejar en blanco es mejor que arriesgar** cuando no se sabe. Un
simulador que no descuente enseña a jugar mal.

**Tipeo** — artículo 27º

| | |
|---|---|
| Largo del texto | **130 palabras** |
| Punto de partida | 100 |
| Cada palabra mal escrita | **−5** |
| Cada palabra **no escrita** | **−5** |
| Mínimo para aprobar | 60 |

O sea: **ocho errores y quedás afuera.** La corrección parte del máximo y resta.

**La unidad de error es la palabra, no el carácter.** Tres letras mal en la
misma palabra son un solo término erróneo. El artículo lo enumera:

> No se tendrán por palabras correctamente escritas aquellas que presenten
> errores de tipeo u ortográficos, estén duplicadas, las que no estén en el
> texto original, las que contengan errores de acentuación, las palabras
> cortadas o unidas indebidamente, los errores de mayúscula o minúscula y los
> errores en el formato del texto.

Y las que faltan cuentan igual:

> Si el/la postulante no alcanzara a copiar la totalidad del texto, también le
> será reducido, a partir del puntaje máximo ideal, cinco (5) puntos por cada
> palabra no escrita. Ambos tipos de errores se sumarán para luego restarlos al
> máximo puntaje ideal.

## El tipeo

Hay que copiar un texto que aparece en pantalla, en un recuadro debajo,
respetando:

- acentuación y puntuación
- **negritas**, <u>subrayados</u>, *cursivas*
- MAYÚSCULAS y minúsculas
- tabulaciones y espacios

**No se tiene en cuenta la marginación.**

El instructivo desaconseja los atajos de teclado para el formato (Ctrl+B, Ctrl+I)
porque pueden desconfigurar el examen: hay que usar los botones de la barra.

La barra del editor real tiene, en este orden: deshacer, rehacer, **N**, *K*,
<u>S</u>, tachado, subíndice, superíndice, alinear a izquierda, centrar, alinear
a derecha, viñetas, numeración, aumentar y disminuir sangría.

## Tiempo

**30 minutos para las dos instancias juntas**, no treinta cada una. Artículo
29º: «Los/as aspirantes deberán completar las dos evaluaciones en un plazo
total de treinta (30) minutos.»

Y acá está la trampa que conviene replicar: el reloj **arranca
en el horario del turno asignado, no cuando la persona se conecta**. Llegar
diez minutos tarde es rendir en veinte. Al terminarse el turno el examen se
envía solo, con lo que haya hasta ese momento.

El examen se puede hacer **una sola vez**.

## Antes de terminar

Al apretar «Terminar examen…» el sistema muestra un resumen con las respondidas
y las que quedaron sin responder, y **esa es la última oportunidad de cambiar**.
Recién «Enviar todo y terminar» cierra el intento.

## Acceso

Entre 72 y 48 horas antes del turno llega un correo desde `concursos@mpd.gov.ar`
—conviene mirar el spam— con el usuario, que es **el DNI sin puntos**, y una
contraseña temporal que hay que cambiar al primer ingreso. La nueva pide 8
caracteres, un número, una minúscula, una mayúscula y un carácter no
alfanumérico.

El enlace de recuperación de contraseña vale **240 minutos** desde que se pide.
