/**
 * Los textos de la pestaña de inscripción. Ningún string suelto en componentes.
 *
 * El contenido de la guía en sí no está acá: está en `content/inscripcion/`,
 * una por organismo, con la misma estructura para los dos (I-08). Esto es el
 * marco: encabezado, rótulos, errores frecuentes y cierre.
 */

export const encabezado = {
  titulo: "Inscribite sin perderte",
  bajada: "La inscripción al MPD tiene trampas que no están escritas en ningún lado.",
  parrafo:
    "Están todas acá, paso a paso: qué necesitás antes de empezar, qué hace cada pantalla del sistema y dónde se pierde el turno la gente que se anota sin saberlas. Es la guía de Nexo, traducida a pasos que podés ir siguiendo.",
} as const;

/** I-02. Mismo criterio que el asistente: mezclar dos concursos es el peor error. */
export const selector = {
  rotulo: "¿Para cuál concurso te vas a inscribir?",
  ayuda: "Los dos trámites son distintos. Elegí el tuyo.",
} as const;

/**
 * El estado del trámite sale de la base, no de acá: cuando el MPD pase a
 * inscripción abierta, esta franja cambia sola.
 */
export const estados = {
  rotulo: "Estado del trámite",
  sin_convocatoria: {
    titulo: "Hoy no hay inscripción abierta",
    texto:
      "Todo lo demás de esta guía ya se puede hacer, y conviene: instalar la aplicación, registrarte y cargar el CV lleva tiempo, y cuando abra sólo vas a tener cinco días hábiles.",
  },
  convocatoria_abierta: {
    titulo: "Se convocó el concurso",
    texto: "La inscripción todavía no abrió. Tené listo el CV: cuando abra son cinco días hábiles.",
  },
  inscripcion_abierta: {
    titulo: "La inscripción está abierta",
    texto: "Son cinco días hábiles. Anotate los primeros días, no el último: es el único margen de error que da el sistema.",
  },
  fecha_confirmada: {
    titulo: "Hay fecha de examen confirmada",
    texto: "La inscripción ya cerró. Revisá la ficha del examen en el portal: el MPD no manda mails.",
  },
  finalizado: {
    titulo: "Este concurso ya terminó",
    texto: "La guía sirve igual para el próximo: el trámite es el mismo.",
  },
  verFicha: "Ver en el portal oficial →",
} as const;

/** Las trampas, juntas y arriba. Es lo que más valor tiene de toda la guía. */
export const trampas = {
  titulo: "Lo que hace perder el turno",
  bajada:
    "Ninguna de estas está escrita en un instructivo oficial. Se aprenden perdiendo la inscripción, o leyendo esto.",
  irAlPaso: (n: number) => `Paso ${n}`,
  irALaSeccion: "Ver dónde",
} as const;

export const guia = {
  titulo: "La inscripción, paso a paso",
  bajada: "Cuatro pasos. Los tres primeros se pueden hacer ahora; el cuarto, sólo con la inscripción abierta.",
  indice: "Los pasos",
  paso: (n: number) => `Paso ${n}`,
  donde: "Dónde",
  consejo: "El consejo de Nexo",
} as const;

export const despues = {
  titulo: "Después de inscribirte",
  bajada: "El examen y lo que viene, del mismo manual.",
} as const;

/**
 * I-05. Sólo el marco: los errores en sí son propios de cada trámite y viven
 * en la guía del organismo.
 *
 * Se alimentan de lo que la gente deja en el asistente cuando no encontramos
 * la respuesta: esa tabla es la lista de lo que falta explicar acá.
 */
export const errores = {
  ancla: "errores-frecuentes",
  titulo: "Errores frecuentes",
  bajada: "Lo que más se pregunta cuando algo no sale.",
  verPaso: (n: number) => `Ver el paso ${n} →`,
} as const;

/**
 * Los esquemas de los pasos.
 *
 * El rótulo importa: son dibujos nuestros, no capturas del sistema. Decirlo
 * evita que alguien busque en su pantalla algo que se ve exactamente así.
 */
export const esquemas = {
  rotulo: "Esquema · no es una captura del sistema",
} as const;

/** I-06. La biblioteca queda armada aunque todavía no haya videos cargados. */
export const videos = {
  ancla: "videos",
  titulo: "Videos explicativos",
  bajada: "Cortos, uno por momento del trámite. Ninguno de veinte minutos.",
  ver: "Ver en YouTube →",
} as const;

export const repaso = {
  ancla: "repaso",
  bajada: "Para chequear antes de empezar y antes de rendir.",
} as const;

export const enlaces = {
  titulo: "Enlaces del trámite",
  bajada: "Los sistemas oficiales y el material. Todo gratuito.",
} as const;

/** I-07. */
export const cierre = {
  titulo: "¿Te trabaste en algún paso?",
  texto:
    "Preguntale al asistente. Está armado con las consultas reales de quienes ya hicieron este trámite, y cada respuesta te dice de dónde sale.",
  cta: "Ir al asistente",
  destino: "/asistente",
} as const;

export const fuente = { rotulo: "De dónde sale esta guía" } as const;
