/**
 * Todos los textos de la landing. Ningún string suelto en componentes.
 * Los textos salen de referencia/landing-preview.html.
 */

export const nav = {
  links: [
    { href: "#simulador", texto: "Simulador" },
    { href: "#norma", texto: "Recursos" },
    { href: "#inscripcion", texto: "Inscripción" },
    { href: "#asistente", texto: "Asistente" },
  ],
  cta: "Empezar gratis",
  // SUPUESTO: /registro llega en el Bloque 2. Hoy el único destino real es la
  // captura de mail, que es literalmente cómo se empieza: dejás el mail y te
  // avisamos. Cuando exista el registro, se cambia acá y en ningún otro lado.
  ctaHref: "/#avisame",
} as const;

export const conmutador = {
  etiqueta: "Puerta",
  ayuda: "Elegí la puerta de entrada",
  // abrev se usa por debajo de 560px: "Nueva Abogacía" no entra en la píldora.
  opciones: [
    { id: "dual", texto: "Ambas", abrev: "Ambas" },
    { id: "nexo", texto: "Nexo", abrev: "Nexo" },
    { id: "na", texto: "Nueva Abogacía", abrev: "NA" },
  ],
} as const;

export const hero = {
  titulo: "Todo para rendir el ingreso al",
  tituloBrillo: "Ministerio Público.",
  bajadaAntes: "Te acompañamos con simuladores de exámenes reales, la normativa ordenada y respuestas a tus dudas, para el cargo de ",
  bajadaDestacado: "técnico administrativo",
  bajadaDespues: " en el MPD y el MPF. Gratis, siempre.",
  ctaPrimario: "Empezar gratis",
  ctaSecundario: "Ver los simulacros",
  micro: "Sin costo · sin publicidad · Nexo Derecho + Nueva Abogacía",
  ctaPrimarioHref: "/#avisame",
} as const;

export const preguntaFirma = {
  eyebrow: "Pregunta real · MPD · Técnico administrativo",
  enunciado:
    "La autonomía funcional y autarquía financiera del Ministerio Público de la Defensa surge del:",
  leyenda: "Elegí una opción",
  opciones: [
    { id: "a", texto: "Reglamento del Consejo de la Magistratura." },
    { id: "b", texto: "Art. 120 de la Constitución Nacional." },
    { id: "c", texto: "Reglamento para la Justicia Nacional." },
  ],
  correcta: "b",
  veredictoBien: "Correcta.",
  veredictoMal: "No es esa.",
  explicacion:
    "El artículo 120 de la Constitución Nacional define al Ministerio Público como un órgano independiente, con autonomía funcional y autarquía financiera. Las otras dos opciones son normas de rango inferior: un reglamento no puede ser la fuente de una garantía institucional que la propia Constitución establece.",
  cita: "Constitución Nacional, art. 120",
  masPlantilla: (n: number) => `Hay ${n} preguntas más como esta →`,
} as const;

export const franjaEstado = {
  etiquetas: {
    sin_convocatoria: "Sin convocatoria publicada",
    convocatoria_abierta: "Convocatoria publicada",
    inscripcion_abierta: "Inscripción abierta",
    fecha_confirmada: "Fecha de examen confirmada",
    finalizado: "Examen 2026 disponible",
  },
  acciones: {
    sin_convocatoria: "Avisame →",
    convocatoria_abierta: "Ver convocatoria →",
    inscripcion_abierta: "Cómo inscribirse →",
    fecha_confirmada: "Prepararme →",
    finalizado: "Practicar →",
  },
  organismos: { mpd: "MPD", mpf: "MPF" },
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

export const puntajeSeccion = {
  eyebrow: "Estrategia",
  titulo: ["El puntaje del MPD", "castiga el error."],
  texto:
    "Una respuesta correcta suma 10 puntos, pero una incorrecta resta 10, y dejarla en blanco no resta nada. Contestar al azar no es neutral: es una apuesta con valor esperado negativo. Nuestro simulador te muestra el puntaje real mientras rendís, no la cantidad de aciertos, para que practiques la decisión de cuándo conviene dejar una en blanco.",
  chips: ["+10 correcta", "−10 incorrecta", "0 en blanco", "60 para aprobar"],
  tarjetaEyebrow: "Cómo se evalúa · MPD",
  items: [
    { n: "01", titulo: "Conocimientos teóricos.", texto: "100 puntos máximo, 60 para aprobar. Suma 10 la correcta, resta 10 la incorrecta, la que dejás sin responder no suma ni resta." },
    { n: "02", titulo: "Conocimientos informáticos.", texto: "Se parte del puntaje máximo de 100 y se descuentan 5 puntos por cada error. También se aprueba con 60." },
    { n: "03", titulo: "La consecuencia práctica.", texto: "Si dudás entre dos opciones conviene arriesgar; si no tenés idea, dejala en blanco. El simulador te muestra las dos cuentas al terminar." },
  ],
} as const;

export const normaSeccion = {
  eyebrow: "Fundamento",
  titulo: ["Cada respuesta,", "con la norma al lado."],
  texto:
    "Toda pregunta corregida viene con la explicación de por qué esa opción es la correcta y por qué las otras no, citando el artículo exacto. No memorizás una letra: entendés la regla y aprendés dónde buscarla.",
  chips: ["Ley 27.149", "Ley 27.148", "Constitución Nacional", "Reglamentos de concurso"],
  tarjetaEyebrow: "Corrección",
  enunciado: "Es causa para disponer la cesantía de Funcionarios/as y/o Empleados/as del MPD:",
  opcion: "a · Sentencia condenatoria firme por delito doloso.",
  explicacionAntes: "La clave está en dos palabras: ",
  explicacionDestacado: "firme y doloso",
  explicacionDespues:
    ". Una sentencia que todavía puede recurrirse no habilita la cesantía, y el delito culposo tampoco alcanza.",
  cita: "Ley 27.149 · Régimen jurídico del MPD",
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
  preguntasMpd: "preguntas reales del MPD",
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
