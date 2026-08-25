import type { Config } from "tailwindcss";

/**
 * El sistema de diseño vive en variables CSS (styles/tokens.css), no acá.
 * Tailwind solo las expone para poder escribir utilidades sueltas —
 * text-papel-tenue, bg-superficie— sin duplicar los valores.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: { DEFAULT: "var(--tinta)", alta: "var(--tinta-alta)" },
        papel: {
          DEFAULT: "var(--papel)",
          tenue: "var(--papel-tenue)",
          debil: "var(--papel-débil)",
        },
        linea: { DEFAULT: "var(--linea)", fuerte: "var(--linea-fuerte)" },
        acento: { DEFAULT: "var(--acento)", texto: "var(--acento-texto)" },
        superficie: "var(--superficie)",
        ok: "var(--ok)",
        error: "var(--error)",
        revisar: "var(--marca-revisar)",
      },
      fontFamily: {
        sans: ["var(--fuente-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--fuente-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { env: "72rem" },
      transitionTimingFunction: { sal: "var(--sal)", suave: "var(--suave)" },
      transitionDuration: { micro: "150ms", elem: "420ms", sec: "700ms" },
    },
  },
  plugins: [],
};
export default config;
