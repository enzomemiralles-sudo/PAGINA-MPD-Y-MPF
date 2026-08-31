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

export const asistenteSeccion = {
  eyebrow: "Asistente",
  titulo: ["Preguntá lo que no", "te animás a preguntar", "en el grupo."],
  textoPlantilla: (n: number) =>
    `Está construido sobre las consultas reales de quienes ya rindieron el MPF: ${n} preguntas frecuentes ordenadas por cuántas veces se hicieron. Responde citando la fuente y, cuando el dato es dudoso o hubo respuestas contradictorias, te lo dice en lugar de inventar.`,
  chipsPlantilla: (n: number) => [`${n} preguntas del MPF`, "10 categorías", "Marca lo que requiere verificación"],
  ejemploPregunta: "¿Puedo rendir desde el celular?",
  ejemploRespuesta:
    "No: hay que rendir desde una computadora. La parte práctica obliga a abrir otra pestaña para buscar información mientras respondés, y en celular o tablet eso no funciona bien.",
  ejemploFuente: "Fuente · mesa de ayuda MPF · confianza media",
  ejemploNota:
    "Lo indicó la organización y lo repitieron participantes con experiencia, pero no se citó una prohibición formal del reglamento. Verificá siempre contra la convocatoria vigente.",
} as const;

export const inscripcionSeccion = {
  eyebrow: "Inscripción",
  titulo: ["Donde más gente", "se queda afuera."],
  texto:
    "La inscripción al MPD tiene trampas que no están escritas en ningún lado y que se aprenden perdiendo el turno. Están todas acá, paso a paso.",
  tarjetas: [
    { rotulo: "Antes de empezar", titulo: "Necesitás una PC con Windows", texto: "No funciona en Mac, Linux, celular ni tablet: hay que instalar un programa y el .msi pide permisos de administrador. Resolvé la máquina ahora, no cuando abra la inscripción." },
    { rotulo: "El error clásico", titulo: "El CV se congela al inscribirte", texto: "El sistema saca una foto de tu CV en ese instante. Si después lo corregís, el cambio no cuenta. La única forma de arreglarlo es volver a inscribirte mientras el plazo siga abierto: por eso conviene anotarse el primer día, no el último." },
    { rotulo: "Nadie te avisa", titulo: "El MPD no manda mails", texto: "Ni comprobante de inscripción, ni listado de inscriptos, ni fecha de examen, ni resultados. Todo se publica en la ficha del examen en el portal y la carga de ir a mirar es tuya. Nosotros te avisamos cuando sale." },
  ],
  items: [
    { n: "01", titulo: "CUIL para inscribirte, DNI para rendir.", texto: "Son dos sistemas distintos y es el punto donde más gente se confunde." },
    { n: "02", titulo: "Los campos de fojas van vacíos.", texto: 'Para técnico administrativo no se arma legajo físico: todo campo que diga "a fs." se deja en blanco.' },
    { n: "03", titulo: 'El botón "confirmar asistencia" no se toca.', texto: "Aparece porque el sistema es común a otros trámites." },
    { n: "04", titulo: "Anotate en varias jurisdicciones.", texto: "El orden de mérito solo te habilita en aquella donde te inscribiste, y rechazar una propuesta te excluye de la lista." },
  ],
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
