# marca/

Los assets gráficos de Nexo. Van los archivos originales, no versiones
recomprimidas: de acá salen los tamaños que use la página.

| Archivo | Qué es |
|---|---|
| `nexo-logotipo-blanco.png` | 560×137 RGBA. Versión en blanco, para fondos oscuros |
| `cinta-argentina.jpg` | 1200×960. La cinta del hero |
| `na-logotipo.png` | El logotipo de Nueva Abogacía. Todavía no se usa: la marca vive como componente en `components/marca/LogoNuevaAbogacia.tsx` |

Los dos primeros se extrajeron de los data-URI de
`referencia/landing-preview.html`.

La cinta se usa con `mix-blend-mode: screen` sobre el fondo negro, al 62% de
opacidad en la marca dual y al 16% en las pieles de Nexo y Nueva Abogacía: es la
identidad compartida, así que se retira cuando la puerta ya tiene dueño.

Si más adelante hace falta el logotipo en positivo para fondos claros, va acá con
el nombre `nexo-logotipo-negro.png`. El logo de Nueva Abogacía todavía no existe
en vectorial: vive como marcador provisorio dentro de un único componente.

## Las fotos de la facultad: reservadas, no llegaron

Están previstas ocho y no hay ninguna. Los nombres son fijos, así que cuando
lleguen entran sin renombrar nada:

| Archivo | Dónde va |
|---|---|
| `facultad-frontal-nexo.jpg` | Pestaña pública, piel Nexo |
| `facultad-frontal-na.jpg` | Pestaña pública, piel Nueva Abogacía |
| `facultad-frontal-nexo-movil.jpg` | Lo mismo, recorte vertical |
| `facultad-frontal-na-movil.jpg` | Lo mismo, recorte vertical |
| `facultad-perspectiva-nexo.jpg` | Home de la puerta Nexo |
| `facultad-perspectiva-na.jpg` | Home de la puerta Nueva Abogacía |
| `facultad-perspectiva-nexo-movil.jpg` | Lo mismo, recorte vertical |
| `facultad-perspectiva-na-movil.jpg` | Lo mismo, recorte vertical |

Van los originales, sin recomprimir: la página genera sus propios tamaños con
`next/image`. El recorte de móvil es un archivo aparte y no un `object-fit`
porque el encuadre que funciona apaisado no funciona vertical.

Hoy no las usa nada: ni la portada ni `/app` tienen fotografía, así que su
ausencia no rompe nada. El día que se carguen hay que decidir además cómo
conviven con la cinta, que es la identidad compartida y se retira cuando la
puerta ya tiene dueño.
