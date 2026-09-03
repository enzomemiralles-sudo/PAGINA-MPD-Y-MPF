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
  /** El lema, arriba a la derecha en la home de puerta. */
  lema: string;
  /** El nombre en versales para el logotipo gigante del pie. */
  gigante: string;
  /**
   * Dónde encontrar a la agrupación. `null` es un dato que todavía no
   * tenemos: inventar un enlace es peor que no mostrar nada, y una entrada
   * sin destino no se renderiza.
   */
  contacto: {
    instagram: { arroba: string; href: string };
    mail: string;
    youtube: string | null;
  };
  /** El sitio propio de la agrupación, y la pestaña que lo presenta. */
  sitio: { url: string | null; pagina: string };
  /** La pestaña que cuenta quiénes son. */
  quienesSomos: string;
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
    lema: "La alternativa en Derecho",
    gigante: "NEXO DERECHO",
    contacto: {
      instagram: { arroba: "@nexoderecho", href: "https://instagram.com/nexoderecho" },
      mail: "nexoderecho@gmail.com",
      youtube: "https://www.youtube.com/@nexoderecho4917",
    },
    sitio: { url: "https://nexoderecho.com.ar", pagina: "/nexo/pagina-web" },
    // Nexo todavía no tiene página propia de «quiénes somos»: su presentación
    // es la de su sitio, así que «Conocé Nexo Derecho» lleva ahí.
    quienesSomos: "/nexo/pagina-web",
    muestra: { primario: "#065D3B", acento: "#0A7F4F" },
  },
  na: {
    id: "na",
    nombre: "Nueva Abogacía",
    nombreCorto: "Nueva Abogacía",
    logo: "/logos/nueva-abogacia.png",
    para: "Para abogadas y abogados",
    lema: "Construyendo una nueva abogacía",
    gigante: "NUEVA ABOGACÍA",
    contacto: {
      instagram: { arroba: "@nueva.abogacia", href: "https://instagram.com/nueva.abogacia" },
      // El brief lo daba por faltante, pero llegó con B-04.
      mail: "abogacianueva@gmail.com",
      youtube: "https://www.youtube.com/@nuevaabogacia",
    },
    sitio: { url: "https://nueva-abogacia.org", pagina: "/na/pagina-web" },
    quienesSomos: "/na/quienes-somos",
    muestra: { primario: "#0B3FD0", acento: "#00B894" },
  },
};

/**
 * Qué marca activa cada perfil.
 *
 * `otro` va a la piel neutra: quien no se reconoce ni en una agrupación ni en
 * la otra no tiene por qué llevar los colores de ninguna.
 */
export const MARCA_DE_PERFIL: Record<TipoPerfil, Marca> = {
  abogado: "na",
  estudiante: "nexo",
  otro: "neutro",
};

/** La otra agrupación, la que va al pie en la línea de coorganización. */
export function laOtra(marca: Marca): ConfigMarca | null {
  if (marca === "nexo") return MARCAS_CONFIG.na;
  if (marca === "na") return MARCAS_CONFIG.nexo;
  return null;
}

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
