# referencia/

Lo que define cómo tiene que verse y comportarse la página. No es material de
contenido: es la decisión de diseño ya tomada, para no volver a discutirla.

`landing-preview.html` es la fuente de verdad del diseño. El CSS y los valores se
respetan al detalle; el JavaScript no se copia tal cual, porque está escrito como
demo de una sola página y se reimplementa con hooks e IntersectionObserver.

Traía embebidos los dos archivos de `marca/` como data-URI. De ahí salieron:
`--cinta-img` es `cinta-argentina.jpg` y el `<img>` del header es
`nexo-logotipo-blanco.png`. Si el preview se actualiza, conviene volver a
extraerlos en vez de reeditarlos aparte.

El mapeo completo de sus tokens está en `PLAN.md` §3, y los cinco puntos donde
choca con las reglas de contraste y rendimiento, en §4.

## Los tres archivos

| Archivo | Qué define |
|---|---|
| `landing-preview.html` | La pestaña pública. Hero con la fotografía de la facultad y tres secciones: simulador, asistente e inscripción |
| `landing-preview-v1.html` | La versión anterior de esa misma pestaña, con la cinta en el hero y una sección más, «norma» |
| `home-puerta-preview.html` | La home de cada puerta: lo que ve alguien con la sesión ya iniciada, saludado por su nombre y con el estado de su simulacro |

`landing-preview.html` reemplazó a la v1 y va ganando: su h1 y los títulos de
sus tres secciones son los que hoy están en producción. La v1 se conserva
igual, porque trae la sección «norma» que la nueva no tiene y porque es de
donde salió la landing que está publicada.

El hero cambió entre una y otra: la v1 usa la cinta argentina, la nueva usa la
fotografía de la facultad virada al color de cada puerta. Las dos versiones de
cada foto están en `marca/`, extraídas de estos mismos archivos.

`home-puerta-preview.html` es el que faltaba. Con él, `/app` —que hoy se armó
con el sistema de la landing en superficie clara— tiene por fin un diseño
propio de referencia.
