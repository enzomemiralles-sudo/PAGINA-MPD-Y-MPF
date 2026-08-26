import type { Marca } from "@/lib/marca/tokens";

/**
 * Fija la piel antes de que la página pinte, para que no se vea un parpadeo de
 * la piel anterior. Es un componente de servidor: el valor ya viene resuelto
 * de la base, así que no hace falta JavaScript de cliente para decidirlo.
 */
export function AplicarPiel({
  marca,
  superficie,
}: {
  marca: Marca;
  superficie: "oscura" | "clara";
}) {
  const html = `document.documentElement.setAttribute('data-marca','${marca}');document.documentElement.setAttribute('data-superficie','${superficie}')`;
  return <script dangerouslySetInnerHTML={{ __html: html }} />;
}
