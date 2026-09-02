/**
 * Los textos de la home de cada puerta. Ningún string suelto en componentes.
 *
 * Los nombres de las agrupaciones, los lemas y los enlaces propios de cada una
 * no están acá: viven en lib/marca/marcas.ts, que es la única fuente de lo que
 * cambia entre puertas. Acá va lo que es igual en las dos.
 */

export const saludo = {
  /**
   * Sólo se llama con un nombre de verdad. Sin nombre no hay saludo: no existe
   * «Hola, usuario» ni «Hola, » a secas. Un saludo genérico es peor que
   * ninguno, porque suena a formulario mal llenado.
   */
  hola: (nombre: string) => `Hola, ${nombre}.`,
  /** Con un examen a medias, el saludo dice cuánto falta. */
  faltan: (n: number) =>
    n === 1 ? "Te falta 1 pregunta para terminar el simulacro." : `Te faltan ${n} preguntas para terminar el simulacro.`,
  /** Sin nada empezado pero con exámenes rendidos. */
  seguimos: "¿Seguimos practicando?",
  /** Sin ningún intento todavía. */
  primeraVez: "Empezá cuando quieras.",
} as const;

export const retomar = {
  rotulo: "Retomar donde quedaste",
  // Sin puntaje parcial a propósito: durante el examen la respuesta correcta
  // no viaja al cliente, así que mostrar cómo va acá contradiría la pantalla
  // de rendir, que tampoco lo muestra.
  detalle: (respondidas: number, total: number, minutos: number, segundos: number) =>
    `Pregunta ${respondidas + 1} de ${total} · quedan ${minutos}:${String(segundos).padStart(2, "0")}`,
  sinTiempo: (respondidas: number, total: number) =>
    `Pregunta ${respondidas + 1} de ${total} · se acabó el tiempo`,
  cta: "Retomar",
} as const;

/** Cuando todavía no rindió nada. El bloque nunca se esconde. */
export const primerSimulacro = {
  rotulo: "Tu primer simulacro",
  titulo: "Todavía no rendiste ninguno",
  texto: "Se hace en treinta minutos y lo podés repetir las veces que quieras.",
  cta: "Empezar",
} as const;

export const temas = { rotulo: "Cómo venís por tema" } as const;

/**
 * Las tres columnas del pie de la home.
 *
 * Lo que depende de la agrupación —«Conocé Nexo Derecho», el grupo de
 * WhatsApp, el Instagram, el mail— se resuelve con los datos de marcas.ts.
 *
 * Lo que no tenemos se muestra como pendiente en lugar de inventarse, y hoy
 * eso es el grupo de WhatsApp y el canal de YouTube de las dos agrupaciones.
 * El mail de Nueva Abogacía sí lo tenemos: llegó con B-04.
 */
export const columnas = {
  menu: {
    titulo: "Menú",
    items: [
      { texto: "Simulador de exámenes", destino: "/simulador", propio: true },
      { texto: "Asistente", destino: "/asistente", propio: true },
      { texto: "Guía de inscripción", destino: "/guia-inscripcion", propio: true },
      { texto: "Contacto", destino: "/contacto", propio: false },
    ],
    conocer: (nombre: string) => `Conocé ${nombre}`,
  },
  /**
   * Quedaron dos.
   *
   * «Manuales y normativa» y la vieja «Insumos de estudio» eran lo mismo
   * apuntando al mismo ancla: se unifican en la pestaña propia de insumos.
   * La biblioteca de videos deja de ser un recurso suelto —los videos que
   * haya viven embebidos dentro de la guía de inscripción, que es donde
   * sirven— y el grupo de WhatsApp se retira.
   */
  recursos: {
    titulo: "Recursos",
    items: [
      { texto: "Insumos de estudio", destino: "/insumos", nota: "Material por eje temático" },
    ],
    /** El destino depende de la agrupación, así que sale de marcas.ts. */
    paginaWeb: "Página web",
  },
  sociales: {
    titulo: "Sociales",
    youtube: "Canal de YouTube",
    mail: "Mail",
    escribinos: "Escribinos",
  },
} as const;

/**
 * La vuelta al menú del perfil.
 *
 * Flecha y no ícono de casa: la casa es ambigua —¿la portada, el perfil?— y la
 * flecha con la palabra «menú» dice exactamente adónde lleva.
 */
export const volver = {
  texto: "Volver al menú",
  ayuda: "Volver al menú de tu perfil",
  aviso: "Si salís ahora perdés el simulacro en curso. ¿Querés salir igual?",
  seguir: "Seguir practicando",
  salir: "Salir",
} as const;
