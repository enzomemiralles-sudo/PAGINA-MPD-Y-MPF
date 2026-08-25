# marca/

Los assets gráficos de Nexo. Van los archivos originales, no versiones
recomprimidas: de acá salen los tamaños que use la página.

| Archivo | Qué es |
|---|---|
| `nexo-logotipo-blanco.png` | 560×137 RGBA. Versión en blanco, para fondos oscuros |
| `cinta-argentina.jpg` | 1200×960. La cinta del hero |

Los dos se extrajeron de los data-URI de `referencia/landing-preview.html`.

La cinta se usa con `mix-blend-mode: screen` sobre el fondo negro, al 62% de
opacidad en la marca dual y al 16% en las pieles de Nexo y Nueva Abogacía: es la
identidad compartida, así que se retira cuando la puerta ya tiene dueño.

Si más adelante hace falta el logotipo en positivo para fondos claros, va acá con
el nombre `nexo-logotipo-negro.png`. El logo de Nueva Abogacía todavía no existe
en vectorial: vive como marcador provisorio dentro de un único componente.
