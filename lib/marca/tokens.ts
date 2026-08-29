/**
 * Espejo en TS de styles/tokens.css, para que el test de contraste pueda
 * recorrer los pares sin levantar un navegador. Si se toca el CSS y no esto,
 * el test dejaría de decir la verdad — por eso tests/contraste.test.ts
 * verifica además que los dos archivos coincidan.
 */
export const SUPERFICIES = ["oscura", "clara"] as const;
export type Superficie = (typeof SUPERFICIES)[number];

export const MARCAS = ["dual", "neutro", "nexo", "na"] as const;
export type Marca = (typeof MARCAS)[number];

/** Las combinaciones que la app usa de verdad. */
export const COMBOS: { superficie: Superficie; marca: Marca; donde: string }[] = [
  { superficie: "oscura", marca: "dual", donde: "landing sin puerta elegida" },
  { superficie: "oscura", marca: "nexo", donde: "landing en piel Nexo" },
  { superficie: "oscura", marca: "na", donde: "landing en piel Nueva Abogacía" },
  { superficie: "clara", marca: "neutro", donde: "ingreso y selección de perfil" },
  { superficie: "clara", marca: "nexo", donde: "app de Nexo" },
  { superficie: "clara", marca: "na", donde: "app de Nueva Abogacía" },
];

type Piel = {
  fondo: string;
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
  /** Verde y rojo funcionales: correcta / incorrecta. No son de marca. */
  ok: string;
  error: string;
};

const OSCURA = {
  fondo: "#08090A",
  texto: "#F4F2ED",
  "texto-tenue": "rgba(244,242,237,0.7)",
  "texto-debil": "rgba(244,242,237,0.5)",
  tarjeta: "rgba(244,242,237,0.04)",
  "sobre-acento": "#08090A",
  "sobre-acento-2": "#08090A",
  ok: "#4ADE80",
  error: "#E64D52",
} as const;

const CLARA = {
  fondo: "#F4F2ED",
  texto: "#08090A",
  "texto-tenue": "rgba(8,9,10,0.75)",
  "texto-debil": "rgba(8,9,10,0.62)",
  tarjeta: "#FFFFFF",
  "sobre-acento": "#FFFFFF",
  "sobre-acento-2": "#08090A",
  // Los de la superficie oscura son claros a propósito y sobre papel no
  // llegan ni a 2:1. Acá van sus versiones oscuras, que es lo que hace
  // legible «correcta / incorrecta» en la pantalla de resultados.
  ok: "#14713A",
  error: "#B3261E",
} as const;

export const PIELES: Record<string, Piel> = {
  "oscura/dual": {
    ...OSCURA,
    superficie: "rgba(244,242,237,0.03)",
    acento: "#F4F2ED", "acento-texto": "#F4F2ED", "acento-2": null, "marca-revisar": "#C8A27A",
  },
  "oscura/nexo": {
    ...OSCURA,
    superficie: "rgba(31,72,56,0.3)",
    acento: "#059249", "acento-texto": "#53B384", "acento-2": "#16A85B", "marca-revisar": "#C8A27A",
  },
  "oscura/na": {
    ...OSCURA,
    superficie: "rgba(0,136,196,0.07)",
    acento: "#0059BA", "acento-texto": "#00B9AE", "acento-2": null, "marca-revisar": "#C8A27A",
    "sobre-acento": "#F4F2ED",
  },
  "clara/neutro": {
    ...CLARA,
    superficie: "#FFFFFF",
    acento: "#08090A", "acento-texto": "#08090A", "acento-2": null, "marca-revisar": "#8F6533",
    "sobre-acento": "#F4F2ED",
  },
  "clara/nexo": {
    ...CLARA,
    superficie: "#FFFFFF",
    acento: "#065D3B", "acento-texto": "#065D3B", "acento-2": "#0A7F4F", "marca-revisar": "#8F6533",
    "sobre-acento-2": "#FFFFFF",
  },
  "clara/na": {
    ...CLARA,
    superficie: "#FFFFFF",
    acento: "#0B3FD0", "acento-texto": "#0B3FD0", "acento-2": "#00B894", "marca-revisar": "#8F6533",
  },
};

/** Colores que pintan texto. */
export const TOKENS_DE_TEXTO = [
  "texto", "texto-tenue", "texto-debil", "acento-texto", "marca-revisar", "ok", "error",
] as const;

/** Fondos sobre los que puede caer texto. */
export const TOKENS_DE_FONDO = ["fondo", "tarjeta", "superficie"] as const;

/** Stops del gradiente del titular del hero (.brillo), sólo en la landing. */
export const STOPS_BRILLO = ["#188B54", "#078C48", "#16A85B", "#F4F2ED", "#0088C4", "#00B9AE", "#0A8883"] as const;
