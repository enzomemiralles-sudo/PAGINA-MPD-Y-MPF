import type { Marca } from "./tokens";

/**
 * Una sola fuente para todo lo que cambia entre marcas: nombre, logo y los
 * textos que nombran a la organización. Los colores viven en
 * styles/tokens.css como variables CSS — acá van sólo por referencia, para
 * que quien lea este archivo sepa dónde mirar, y para poder mostrarlos en la
 * selección de perfil sin duplicar hexadecimales en un componente.
 *
 * Agregar o cambiar algo de una marca es tocar este archivo y tokens.css.
 * Ningún componente pregunta de qué marca se trata.
 */
export type TipoPerfil = "abogado" | "estudiante" | "otro";

export type ConfigMarca = {
  id: Exclude<Marca, "dual" | "neutro">;
  nombre: string;
  nombreCorto: string;
  logo: string;
  /** Para quién es. Se muestra en la selección de perfil. */
  para: string;
  /** Sólo para pintar la muestra de color de las tarjetas de selección. */
  muestra: { primario: string; acento: string };
};

export const MARCAS_CONFIG: Record<ConfigMarca["id"], ConfigMarca> = {
  nexo: {
    id: "nexo",
    nombre: "Nexo Derecho",
    nombreCorto: "Nexo",
    logo: "/logos/nexo.png",
    para: "Para estudiantes de Derecho",
    muestra: { primario: "#065D3B", acento: "#0A7F4F" },
  },
  na: {
    id: "na",
    nombre: "Nueva Abogacía",
    nombreCorto: "Nueva Abogacía",
    logo: "/logos/nueva-abogacia.png",
    para: "Para abogadas y abogados",
    muestra: { primario: "#0B3FD0", acento: "#00B894" },
  },
};

/** Qué marca activa cada perfil. */
export const MARCA_DE_PERFIL: Record<TipoPerfil, ConfigMarca["id"]> = {
  abogado: "na",
  estudiante: "nexo",
  otro: "na",
};

export function configDe(marca: Marca): ConfigMarca | null {
  return marca === "nexo" || marca === "na" ? MARCAS_CONFIG[marca] : null;
}

/**
 * Textos que nombran a la organización. Donde un mensaje dice «Nexo», en la
 * otra marca dice «Nueva Abogacía»: eso se resuelve acá y en ningún otro lado.
 */
export function textosDe(marca: Marca) {
  const cfg = configDe(marca);
  const nombre = cfg?.nombre ?? "Nexo Derecho y Nueva Abogacía";
  const corto = cfg?.nombreCorto ?? "Nexo";
  return {
    nombre,
    corto,
    bienvenida: `Bienvenido/a a ${nombre}`,
    modalBajada: `Con estos datos entendemos mejor a la comunidad de ${corto} y mejoramos la app. Es rápido y opcional.`,
    legalGuarda: `${corto} guarda tus datos y los que cargás acá son para mostrarte tu progreso y para entender mejor a la comunidad. No compartimos ni vendemos tus datos personales a terceros. Podés pedir la baja de tu cuenta y la eliminación de tus datos cuando quieras`,
  };
}

/** El mail al que se escribe para pedir la baja. */
export const MAIL_CONTACTO = "nexoderecho@gmail.com";
