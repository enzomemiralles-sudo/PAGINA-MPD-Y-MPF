/**
 * Espejo en TS de styles/tokens.css. Existe para que el test de contraste
 * pueda recorrer los pares sin levantar un navegador.
 * Si tocás tokens.css y no tocás esto, el test deja de decir la verdad:
 * tests/contraste.test.ts verifica que los dos archivos coincidan.
 */
export const MARCAS = ["dual", "neutro", "nexo", "na"] as const;
export type Marca = (typeof MARCAS)[number];

export const BASE = {
  tinta: "#08090A",
  "tinta-alta": "#101216",
  papel: "#F4F2ED",
  "papel-tenue": "rgba(244,242,237,0.7)",
  "papel-débil": "rgba(244,242,237,0.5)",
  linea: "rgba(244,242,237,0.1)",
  "linea-fuerte": "rgba(244,242,237,0.2)",
  ok: "#4ADE80",
  error: "#E64D52",
} as const;

export const PIELES: Record<Marca, { acento: string; "acento-texto": string; "marca-revisar": string; superficie: string }> = {
  dual:   { acento: "#F4F2ED", "acento-texto": "#F4F2ED", "marca-revisar": "#C8A27A", superficie: "rgba(244,242,237,0.03)" },
  neutro: { acento: "#F4F2ED", "acento-texto": "#F4F2ED", "marca-revisar": "#C8A27A", superficie: "rgba(244,242,237,0.03)" },
  nexo: { acento: "#059249", "acento-texto": "#53B384", "marca-revisar": "#F58220", superficie: "rgba(31,72,56,0.3)" },
  na:   { acento: "#0059BA", "acento-texto": "#00B9AE", "marca-revisar": "#7FB2E8", superficie: "rgba(0,136,196,0.07)" },
};

/** Todo color que se usa para pintar texto. */
export const TOKENS_DE_TEXTO = ["papel", "papel-tenue", "papel-débil", "ok", "error"] as const;

/** Todo fondo sobre el que puede caer texto. --superficie va aparte, por marca. */
export const TOKENS_DE_FONDO = ["tinta", "tinta-alta"] as const;

/** Los stops del gradiente del titular del hero (.brillo). */
export const STOPS_BRILLO = ["#188B54", "#078C48", "#16A85B", "#F4F2ED", "#0088C4", "#00B9AE", "#0A8883"] as const;
