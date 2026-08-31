/**
 * Todos los textos de la landing. Ningún string suelto en componentes.
 * Los textos salen de referencia/landing-preview.html.
 */

export const nav = {
  links: [
    { href: "#simulador", texto: "Simulador" },
    { href: "#inscripcion", texto: "Inscripción" },
    { href: "#asistente", texto: "Asistente" },
  ],
  cta: "Empezar gratis",
  ctaHref: "/crear-perfil",
} as const;

export const hero = {
  // El titular se corta a mano. Los tres renglones quedan de 21, 24 y 21
  // caracteres: el «al» va con la última línea justamente para emparejarlos.
  // Dejarlo al navegador partía «para preparar tu ingreso al» en dos.
  titulo: ["Todo lo que necesitás", "para preparar tu ingreso"],
  tituloAntesBrillo: "al ",
  tituloBrillo: "Ministerio Público",
  bajada:
    "Prepará tu examen con simuladores de exámenes, un asistente para responder todas tus dudas, la normativa ordenada y todo lo que necesitás saber para la inscripción en un solo lugar.",
  ctaPrimario: "Empezar gratis",
  ctaPrimarioHref: "/crear-perfil",
} as const;

export const maqueta = {
  titulo: "Simulacro MPD — Técnico administrativo",
  cronometroInicial: "00:41:12",
  retomar: "Retomar simulacro",
  temas: [
    { nombre: "Régimen jurídico del MPD", pct: 82 },
    { nombre: "Ley Orgánica 27.149", pct: 64 },
    { nombre: "Constitución Nacional", pct: 71 },
    { nombre: "Sanciones y disciplina", pct: 45 },
    { nombre: "Expedientes y trámite", pct: 90 },
  ],
  resumen: "24 respondidas · 3 marcadas · 32 sin responder",
  puntaje: [
    { rotulo: "Puntaje", valor: "+180", tono: "ok" },
    { rotulo: "Correctas", valor: "21", tono: "normal" },
    { rotulo: "Erradas", valor: "3", tono: "error" },
    { rotulo: "En blanco", valor: "32", tono: "normal" },
  ],
  preguntaRotulo: "Pregunta 24 · Régimen jurídico",
  pregunta:
    "No podrán ser nombrados/as funcionarios/as o empleados del Ministerio Público de la Defensa quienes:",
  opciones: [
    { texto: "a · Hayan revistado en los cinco años anteriores al ingreso en alguna fuerza de seguridad.", ok: false },
    { texto: "b · Hayan sido separados/as de un empleo público anterior por mal desempeño fehacientemente comprobado.", ok: true },
    { texto: "c · Ejerzan la docencia universitaria.", ok: false },
  ],
  cita: "Ley 27.149 · Régimen jurídico",
  respondidas: [1,2,3,5,6,7,8,10,11,12,13,14,15,16,18,19,20,21,22,23],
  marcadas: [4, 9, 17],
  activa: 24,
  total: 50,
} as const;

/**
 * A-14. El bloque del asistente en la pestaña de muestra.
 *
 * Los textos son los que escribió el proyecto, palabra por palabra. Dicen lo
 * que la herramienta hace —responde con cita de la fuente, y avisa cuando no
 * sabe— sin venderla como una conversación con una inteligencia artificial,
 * que es lo que pide A-13.
 */
export const asistenteSeccion = {
  eyebrow: "Asistente",
  titulo: ["Ahora, el asistente"],
  bajada:
    "Preguntá cualquier duda que tengas sobre el concurso. Desde la inscripción hasta la entrevista posterior al sorteo.",
  parrafos: [
    "Este asistente fue construido a partir de consultas reales de personas que ya rindieron los exámenes de Ingreso Democrático al Ministerio Público de la Defensa (MPD) y al Ministerio Público Fiscal (MPF).",
    "Podés hacerle tus preguntas y recibir respuestas fundamentadas y con cita de la fuente correspondiente, para que puedas verificar la información y seguir estudiando por tu cuenta.",
    "Y si no encontramos una respuesta, te lo vamos a decir en lugar de inventarla. Además, podés dejarnos tu consulta para que la revisemos y nos ayudes a seguir mejorando el asistente.",
  ],
  caja: {
    titulo: "¿En qué podemos ayudarte?",
    marcador: "Escribí tu pregunta…",
    ejemplo: "Ej.: ¿Qué pasa después del sorteo?",
    cta: "Preguntar",
  },
  sellos: [
    "📚 Respuestas basadas en consultas reales",
    "🔎 Fuentes para verificar la información",
    "⚠️ Si no sabemos, te lo decimos",
  ],
} as const;

/**
 * I-09. El bloque de inscripción en la pestaña de muestra.
 *
 * Los cuatro destacados que pide CAMBIOS.md prometen capturas de pantalla y
 * videos, y hoy no hay ninguno de los dos. Anunciarlos sería el placeholder
 * que las reglas del proyecto prohíben, así que cada destacado dice de qué
 * depende y la página muestra sólo los que ya son ciertos. Cuando se carguen
 * las capturas y los videos aparecen solos.
 *
 * Lo mismo con las tarjetas de concurso: se dibuja una por guía cargada. Hoy
 * es una sola, la del MPD.
 */
export const inscripcionSeccion = {
  eyebrow: "Inscripción",
  titulo: ["Inscribite sin perderte."],
  texto:
    "Todo lo que necesitás para completar tu inscripción al MPD o al MPF, explicado paso a paso.",
  destacados: [
    { icono: "📋", texto: "Guías detalladas", depende: "guias" },
    { icono: "🖥️", texto: "Capturas de pantalla", depende: "capturas" },
    { icono: "🎥", texto: "Videos explicativos", depende: "videos" },
    { icono: "⚠️", texto: "Errores frecuentes", depende: "errores" },
  ],
  cta: "Ver la guía",
  ctaHref: "/inscripcion",
  cierre: {
    titulo: "¿Te quedó alguna duda?",
    texto: "Preguntale al asistente: responde con la fuente para que puedas verificarla.",
    cta: "Ir al asistente",
    href: "/asistente",
  },
} as const;

export const numeros = {
  // «ya cargadas» y no «reales» a secas: el número sale de la base y sube cada
  // vez que se revisa una tanda nueva. El rótulo tiene que dejar claro que es
  // una foto de hoy, no el tamaño final del banco.
  preguntasMpd: "preguntas del MPD ya cargadas",
  dudasMpf: "dudas resueltas del MPF",
  comunidad: "colegas en Nueva Abogacía",
  gratis: "gratis",
} as const;

// SUPUESTO: /nexo, /na y /recursos son del Bloque 3. Hasta entonces los tres
// botones llevan a lo que sí existe hoy en la landing.
export const gratisSeccion = {
  agua: ["Gratis.", "Siempre."],
  puertas: [
    { clase: "n", titulo: "Nexo Derecho", quien: "Para estudiantes de derecho", items: ["Guía del cero absoluto", "Simulacros de técnico administrativo", "Inscripción paso a paso", "Comunidad de estudio"], cta: "Entrar", href: "/#avisame" },
    { clase: "a", titulo: "Nueva Abogacía", quien: "Para abogadas y abogados", items: ["Simulacros completos cronometrados", "Análisis del examen del MPF", "Banco de normativa por tema", "Estadísticas por tema"], cta: "Entrar", href: "/#avisame" },
    { clase: "o", titulo: "Recursos abiertos", quien: "Sin registro", items: ["Normativa consolidada", "Guía de inscripción", "Videos tutoriales", "Estado de los concursos"], cta: "Ver recursos", href: "/#inscripcion" },
  ],
  porqueTitulo: "¿Por qué es gratis?",
  porqueTexto:
    " Porque el ingreso al Ministerio Público se define por concurso público y abierto, y prepararse no debería depender de quién puede pagar un curso. Nexo Derecho y Nueva Abogacía sostenemos esta plataforma. No hay planes pagos, no hay publicidad y no vendemos los datos de nadie.",
} as const;

export const cierre = {
  titulo: ["Cuando salga la convocatoria del MPD,", "que te encuentre listo."],
  texto:
    "Todavía no hay fecha. Dejanos tu mail y te avisamos apenas se publique. Mientras tanto, practicá con las preguntas reales que ya tenemos cargadas.",
  ctaSecundario: "Practicar ahora",
} as const;

export const captura = {
  placeholder: "tu@mail.com",
  boton: "Avisame cuando salga",
  enviando: "Guardando…",
  exito: "Listo. Te avisamos apenas se publique la convocatoria.",
  errorGenerico: "No pudimos guardarlo. Probá de nuevo en un momento.",
  errorMail: "Revisá el mail: parece que falta algo.",
  consentimientoDatos:
    "Acepto que guarden mi mail para avisarme cuando se publique la convocatoria. Puedo pedir que lo borren cuando quiera.",
  consentimientoWsp: "Además quiero recibir avisos por WhatsApp.",
  faltaConsentimiento: "Necesitamos que aceptes el primer punto para poder guardarlo.",
} as const;
