/**
 * Espejo en TS de styles/tokens.css, para que el test de contraste pueda
 * recorrer los pares sin levantar un navegador. Si se toca el CSS y no esto,
 * el test dejaría de decir la verdad — por eso tests/contraste.test.ts
 * verifica además que los dos archivos coincidan.
 *
 * Un solo eje: la marca. Todo el sitio es oscuro y cada puerta trae su propio
 * fondo, no sólo su acento.
 */
export const MARCAS = ["dual", "neutro", "nexo", "na"] as const;
export type Marca = (typeof MARCAS)[number];

/** Dónde se usa cada piel, para que el test diga algo legible al fallar. */
export const DONDE: Record<Marca, string> = {
  dual: "pestaña pública",
  neutro: "crear perfil y panel",
  nexo: "puerta Nexo",
  na: "puerta Nueva Abogacía",
};

type Piel = {
  fondo: string;
  "fondo-bajo": string;
  texto: string;
  "texto-tenue": string;
  "texto-debil": string;
  tarjeta: string;
  superficie: string;
  acento: string;
  "acento-texto": string;
  "acento-2": string | null;
  "marca-revisar": string;
  "sobre-acento": string;
  "sobre-acento-2": string;
  /** Verde y rojo funcionales: correcta / incorrecta. No son de marca y no
      cambian nunca con la piel. */
  ok: string;
  error: string;
  /** Las paradas de --relleno, el fondo del botón de marca. Nexo va plano y
      Nueva Abogacía siempre con degradé: es una de las tres reglas que
      distinguen las puertas. Se listan para poder medir la letra contra la
      parada más clara, que es donde el degradé se rompe. */
  relleno: readonly string[];
  "sobre-relleno": string;
};

/** Lo que comparten las cuatro pieles: la superficie es una sola. */
const BASE = {
  texto: "#f4f2ed",
  "texto-tenue": "rgba(244,242,237,0.7)",
  "texto-debil": "rgba(244,242,237,0.5)",
  tarjeta: "rgba(244,242,237,0.04)",
  "marca-revisar": "#c8a27a",
  "sobre-acento": "#08090a",
  "sobre-acento-2": "#08090a",
  ok: "#4ade80",
  error: "#ec5f63",
} as const;

export const PIELES: Record<Marca, Piel> = {
  dual: {
    ...BASE,
    relleno: ["#059249", "#0088c4"],
    "sobre-relleno": "#08090a",
    fondo: "#08090a",
    "fondo-bajo": "#040507",
    superficie: "rgba(244,242,237,0.03)",
    acento: "#f4f2ed",
    "acento-texto": "#f4f2ed",
    "acento-2": null,
  },
  neutro: {
    ...BASE,
    relleno: ["#3a3a38", "#6b6b68"],
    "sobre-relleno": "#f4f2ed",
    fondo: "#08090a",
    "fondo-bajo": "#040507",
    superficie: "rgba(244,242,237,0.04)",
    acento: "#f4f2ed",
    "acento-texto": "#f4f2ed",
    "acento-2": null,
    "sobre-acento": "#08090a",
  },
  nexo: {
    ...BASE,
    relleno: ["#059249"],
    "sobre-relleno": "#08090a",
    fondo: "#04150d",
    "fondo-bajo": "#020b07",
    superficie: "rgba(31,72,56,0.3)",
    acento: "#059249",
    "acento-texto": "#7fd6a4",
    // El naranja es sólo de Nexo. Es una de las tres reglas que distinguen
    // las puertas incluso en escala de grises.
    "acento-2": "#f58220",
  },
  na: {
    ...BASE,
    relleno: ["#0059ba", "#0a6ea8", "#0a7970"],
    "sobre-relleno": "#f4f2ed",
    fondo: "#03141f",
    "fondo-bajo": "#010a11",
    superficie: "rgba(0,136,196,0.07)",
    acento: "#0059ba",
    "acento-texto": "#2fd3c8",
    "acento-2": null,
    "sobre-acento": "#f4f2ed",
  },
};

/** Colores que pintan texto. */
export const TOKENS_DE_TEXTO = [
  "texto", "texto-tenue", "texto-debil", "acento-texto", "marca-revisar", "ok", "error",
] as const;

/** Fondos sobre los que puede caer texto. */
export const TOKENS_DE_FONDO = ["fondo", "fondo-bajo", "tarjeta", "superficie"] as const;

/**
 * Colores de marca que NUNCA pueden pintar texto.
 *
 * El azul #0059BA sobre fondo oscuro da 2,8:1 y no alcanza para nada. El
 * verde #059249 da entre 4,64:1 y 4,95:1, o sea que técnicamente pasa AA,
 * pero igual está prohibido: es el color de los botones y de los títulos
 * grandes, y usarlo también para leer borra esa distinción. Para texto va
 * siempre --acento-texto.
 *
 * O sea que esto es una regla de producto, no un límite de contraste, y el
 * test la comprueba como tal: recorre el CSS y falla si alguna regla pinta
 * `color` con --acento.
 */
export const NUNCA_TEXTO = ["#059249", "#0059ba"] as const;

/** Stops del gradiente del titular del hero (.brillo), sólo en la landing. */
export const STOPS_BRILLO = ["#188B54", "#078C48", "#16A85B", "#F4F2ED", "#0088C4", "#00B9AE", "#0A8883"] as const;
