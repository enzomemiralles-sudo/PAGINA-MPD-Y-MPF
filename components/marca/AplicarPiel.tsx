"use client";

import { useEffect } from "react";
import type { Marca } from "@/lib/marca/tokens";

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
  useEffect(() => {
    document.documentElement.setAttribute("data-marca", marca);
  }, [marca]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute('data-marca','${marca}')`,
      }}
    />
  );
}
