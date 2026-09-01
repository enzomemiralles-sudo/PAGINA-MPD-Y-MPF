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

## Las fotos de la facultad

Cuatro, no ocho. Salieron de los data-URI de los dos previews de
`referencia/`, igual que la cinta y el logotipo.

| Archivo | Medidas | Dónde va | De dónde salió |
|---|---|---|---|
| `facultad-frontal-nexo.jpg` | 1800×734 | Pestaña pública, piel Nexo | `.capa.n` de `landing-preview.html` |
| `facultad-frontal-na.jpg` | 1800×734 | Pestaña pública, piel Nueva Abogacía | `.capa.a` |
| `facultad-perspectiva-nexo.jpg` | 1600×908 | Home de la puerta Nexo | `.foto.n` de `home-puerta-preview.html` |
| `facultad-perspectiva-na.jpg` | 1600×908 | Home de la puerta Nueva Abogacía | `.foto.a` |

Son la misma fotografía virada al color de cada puerta: verde en Nexo, azul en
Nueva Abogacía. El viraje viene aplicado en el archivo, no por CSS, así que no
hay que superponer nada.

**No hay versiones de móvil, y no hacen falta.** Se había previsto un recorte
vertical por cada una, pero los previews resuelven el móvil moviendo el encuadre
en lugar de cambiar de archivo: `background-size: cover` con
`background-position: center 62%` en la frontal, y `62% 58%` en la de
perspectiva, que pasa a `70% 58%` por debajo de 820 px. Cuatro archivos menos
que mantener y ningún salto de calidad al cambiar de ancho.

Las dos capas de cada pantalla están siempre presentes y se cruzan por
`opacity` en 0,9 s cuando cambia `data-marca`, con una animación de escala muy
lenta encima —60 s en la portada, 70 s en la home— que se apaga con
`prefers-reduced-motion`.

Todavía no las usa nada: ni la portada ni `/app` tienen fotografía. Cuando se
conecten hay que decidir cómo conviven con la cinta, que es la identidad
compartida y hoy se retira cuando la puerta ya tiene dueño.
