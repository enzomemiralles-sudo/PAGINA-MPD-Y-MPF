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
