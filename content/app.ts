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
 * Las tres herramientas principales, como tarjetas arriba de todo en la home.
 *
 * Antes vivían como texto plano en el pie (las «tres columnas»), mezcladas
 * con Contacto y las redes. Son lo que alguien usa de verdad en la app, así que
 * ahora tienen su propio lugar, bien arriba. El pie se queda sólo con lo
 * secundario.
 */
export const herramientasHome = {
  items: [
    {
      id: "simulador",
      titulo: "Simulador de exámenes",
      texto: "Practicá con exámenes cronometrados de años anteriores.",
      destino: "/simulador",
    },
    {
      id: "asistente",
      titulo: "Asistente",
      texto: "Resolvé dudas puntuales sobre la inscripción y el examen.",
      destino: "/asistente",
    },
    {
      id: "guia",
      titulo: "Guía de inscripción",
      texto: "El paso a paso completo para anotarte en el concurso.",
      destino: "/guia-inscripcion",
    },
    {
      id: "insumos",
      titulo: "Insumos de estudio",
      texto: "Material organizado por eje temático.",
      destino: "/insumos",
    },
  ],
} as const;

/**
 * Lo que queda del pie de la home, después de que «Menú» y «Recursos» se
 * mudaran: las herramientas están arriba, en `HerramientasHome`, y acá abajo
 * queda una sola columna con contacto, redes y el sitio de la agrupación.
 *
 * Lo que cambia entre puertas —el nombre de la agrupación, su Instagram, su
 * canal, su sitio— sale de `marcas.ts`, que es la única fuente de lo que
 * depende de la marca.
 *
 * Ya no hay pendientes a la vista: lo que falta simplemente no se renderiza,
 * como manda la regla del proyecto. Hoy eso es el canal de YouTube de Nueva
 * Abogacía.
 *
 * Lo que depende de la agrupación —«Conocé Nexo Derecho», el grupo de
 * WhatsApp, el Instagram, el mail— se resuelve con los datos de marcas.ts.
 *
 * Lo que no tenemos se muestra como pendiente en lugar de inventarse, y hoy
 * eso es el grupo de WhatsApp y el canal de YouTube de las dos agrupaciones.
 * El mail de Nueva Abogacía sí lo tenemos: llegó con B-04.
 */
export const columnas = {
  sociales: {
    titulo: "Sociales",
    youtube: "Canal de YouTube",
    mail: "Mail",
    /** El destino depende de la agrupación, así que sale de marcas.ts. */
    paginaWeb: "Página web",
    contacto: "Contacto",
    conocer: (nombre: string) => `Conocé ${nombre}`,
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
