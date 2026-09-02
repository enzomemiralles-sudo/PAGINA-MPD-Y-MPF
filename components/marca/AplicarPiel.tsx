"use client";

import { useEffect, useLayoutEffect } from "react";
import type { Marca } from "@/lib/marca/tokens";

/**
 * Marca en el <html> que la piel de esta pantalla la decide el servidor.
 *
 * Existe para que <MarcaProvider> —que pinta la puerta elegida en la pestaña
 * pública— se aparte. Antes eso lo resolvía una lista de rutas dentro del
 * proveedor, y esa lista era una trampa: cada pantalla nueva bajo sesión había
 * que acordarse de agregarla, y si no, el proveedor le pisaba la piel con la
 * dual medio segundo después de cargar. Ahora la señal viaja con el componente
 * que fija la piel, así que no hay nada que recordar.
 */
export const ATRIBUTO_SERVIDOR = "data-piel-servidor";

/**
 * `useLayoutEffect` corre antes del pintado; `useEffect`, después. Acá hace
 * falta el primero: al navegar de la portada a la app, con el segundo se veía
 * un cuadro con la piel anterior. En el servidor no corre ninguno —el atributo
 * ya viene en el HTML— y React avisa por consola si ve un efecto de layout
 * durante el render del servidor, de ahí el alias.
 */
const enElCuadro = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fija la piel de la pantalla.
 *
 * Hace lo mismo dos veces, y las dos hacen falta:
 *
 * - El `<script>` corre en la carga inicial, antes de que la página pinte, y
 *   evita el parpadeo de la piel anterior.
 * - El efecto corre en las navegaciones de cliente, donde el script **no** se
 *   ejecuta: React no corre lo que llega por dangerouslySetInnerHTML durante
 *   una transición. Sin esto, entrar a la app desde otra pantalla dejaba la
 *   marca de la anterior.
 */
export function AplicarPiel({ marca }: { marca: Marca }) {
  enElCuadro(() => {
    const html = document.documentElement;
    html.setAttribute("data-marca", marca);
    html.setAttribute(ATRIBUTO_SERVIDOR, "");
    return () => html.removeAttribute(ATRIBUTO_SERVIDOR);
  }, [marca]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html:
          `document.documentElement.setAttribute('data-marca','${marca}');` +
          `document.documentElement.setAttribute('${ATRIBUTO_SERVIDOR}','')`,
      }}
    />
  );
}
