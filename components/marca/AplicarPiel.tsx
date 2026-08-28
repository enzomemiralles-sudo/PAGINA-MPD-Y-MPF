"use client";

import { useEffect } from "react";
import type { Marca } from "@/lib/marca/tokens";

/**
 * Fija la piel de la pantalla: la marca y la superficie.
 *
 * Hace lo mismo dos veces, y las dos hacen falta:
 *
 * - El `<script>` corre en la carga inicial, antes de que la página pinte, y
 *   evita el parpadeo de la piel anterior.
 * - El efecto corre en las navegaciones de cliente, donde el script **no** se
 *   ejecuta: React no corre lo que llega por dangerouslySetInnerHTML durante
 *   una transición. Sin esto, entrar a la app desde otra pantalla dejaba los
 *   atributos de la anterior, y la pestaña principal salía oscura.
 */
export function AplicarPiel({
  marca,
  superficie,
}: {
  marca: Marca;
  superficie: "oscura" | "clara";
}) {
  useEffect(() => {
    document.documentElement.setAttribute("data-marca", marca);
    document.documentElement.setAttribute("data-superficie", superficie);
  }, [marca, superficie]);

  const html =
    `document.documentElement.setAttribute('data-marca','${marca}');` +
    `document.documentElement.setAttribute('data-superficie','${superficie}')`;
  return <script dangerouslySetInnerHTML={{ __html: html }} />;
}
