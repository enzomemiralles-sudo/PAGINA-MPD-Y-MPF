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

/**
 * TANDA 7. El apartado del simulador en la pestaña de muestra.
 *
 * Reemplaza a la maqueta dibujada que había acá. Iba última a propósito:
 * muestra capturas reales de las pantallas del simulador, así que no se podía
 * construir antes de que el simulador existiera.
 *
 * Criterio opuesto al de `/simulador`. Allá: directa y funcional. Acá: visual
 * y demostrativa, menos texto y más capturas. Alguien tiene que recorrerla y
 * pensar «quiero probar esto».
 *
 * Las capturas salen de las pantallas de verdad corriendo con preguntas de
 * verdad del banco, tomadas contra el build de producción. Los alt describen
 * lo que se ve: una captura sin alt no existe para quien no la ve, y acá las
 * capturas son casi todo el contenido.
 *
 * Las de los organismos van recortadas a la barra de arriba y la tarjeta de la
 * pregunta. A media pantalla, la captura entera dejaba el texto en ocho
 * píxeles: se veía que era un examen pero no se leía nada, y una captura que
 * no se lee no demuestra nada. La grande de arriba y la de resultados van
 * enteras, que es donde el detalle se ve.
 */
export const simuladorSeccion = {
  eyebrow: "Simulador",
  // V-01
  titulo: ["Conocé el simulador"],
  bajada: "Así podés prepararte para tu examen de ingreso.",
  cta: "Probar el simulador",
  ctaHref: "/simulador",

  // V-02
  asiSeVe: {
    titulo: "Así se ve el simulador",
    captura: {
      src: "/muestra/mpf-teorico.png",
      ancho: 2240,
      alto: 1390,
      alt: "Pantalla de examen del simulador: arriba «Pregunta 1 de 20» y el tiempo restante, en el centro la pregunta con sus tres opciones y una elegida, y abajo la grilla de las veinte preguntas con su referencia de respondidas, marcadas y sin responder.",
    },
    frases: [
      "Preguntas de opción múltiple",
      "Practicá las veces que quieras",
      "Poné a prueba tus conocimientos",
      "Conocé tu resultado",
      "Volvé a intentarlo",
    ],
  },

  // V-03 y V-04. La misma estructura para los dos: son el mismo sitio.
  organismos: [
    {
      sigla: "MPF",
      nombre: "Ministerio Público Fiscal",
      texto: "Dos instancias: el teórico de opción múltiple y el práctico, que se resuelve buscando en las fuentes.",
      instancias: [
        {
          titulo: "Examen teórico",
          texto: "Veinte preguntas en treinta minutos. Cada acierto suma cinco y cada error resta cinco.",
          captura: {
            src: "/muestra/mpf-teorico-detalle.png",
            ancho: 2240,
            alto: 806,
            alt: "Pregunta del teórico del MPF: «¿Cuál de estos es un órgano judicial de la Justicia Federal Penal?», con tres opciones y la tercera elegida.",
          },
        },
        {
          titulo: "Examen práctico",
          texto: "Consignas de búsqueda e investigación. Se responden consultando las fuentes, como en el examen real.",
          captura: {
            src: "/muestra/mpf-practico-detalle.png",
            ancho: 2240,
            alto: 974,
            alt: "Ejercicio del práctico del MPF: pide buscar en la página del MPF la Resolución PGN 2636/15 y responder en qué se convirtió el programa de acceso a la justicia.",
          },
        },
      ],
    },
    {
      sigla: "MPD",
      nombre: "Ministerio Público de la Defensa",
      texto: "Dos instancias también, pero distintas: el teórico de opción múltiple y el práctico de tipeo.",
      instancias: [
        {
          titulo: "Examen teórico",
          texto: "Diez preguntas sobre la Constitución, la Ley 27.149 y el Régimen Jurídico del MPD.",
          captura: {
            src: "/muestra/mpd-teorico-detalle.png",
            ancho: 2240,
            alto: 806,
            alt: "Pregunta del teórico del MPD sobre ingreso, cargos e incompatibilidades, con sus opciones y la grilla de diez preguntas abajo.",
          },
        },
        {
          titulo: "Examen práctico de tipeo",
          texto: "Se copia un texto tal cual está. Se parte de cien puntos y cada palabra mal escrita descuenta cinco.",
          captura: {
            src: "/muestra/mpd-tipeo-detalle.png",
            ancho: 2240,
            alto: 1304,
            alt: "Pantalla del tipeo: a la izquierda el texto a copiar, a la derecha lo que se va escribiendo, y debajo el contador de palabras escritas sobre ciento treinta y los errores que lleva hasta ahí.",
          },
        },
      ],
    },
  ],

  // V-05
  resultados: {
    titulo: "¿Cómo te fue?",
    texto: "Al entregar ves tu puntaje contra el mínimo para aprobar, cuántas acertaste y cuántas no, cuánto tardaste, y en qué temas te fue mejor y peor.",
    captura: {
      src: "/muestra/resultado.png",
      ancho: 2240,
      alto: 1886,
      alt: "Pantalla de resultados: aprobado con sesenta y cinco sobre cien, mínimo sesenta; dieciséis correctas, tres incorrectas, una en blanco, ochenta por ciento de aciertos y veintidós minutos usados; y abajo el desempeño por tema con una barra por cada uno.",
    },
  },

  // V-06
  caracteristicas: {
    titulo: "Una herramienta que podés volver a usar",
    items: [
      { titulo: "Todas las veces que quieras", texto: "No hay límite de intentos ni de tiempo entre uno y otro." },
      { titulo: "Con las reglas de cada organismo", texto: "El formato, el tiempo y el criterio de corrección son los del examen real, y no son los mismos en el MPD que en el MPF." },
      { titulo: "Preguntas nuevas cada vez", texto: "El banco se amplía a medida que se revisan y se publican más preguntas." },
      { titulo: "Gratis, sin excepciones", texto: "Todo el sitio es gratuito. No hay versión paga ni funciones reservadas." },
    ],
    cta: "Empezar a practicar",
    ctaHref: "/simulador",
  },

  // V-07
  cierre: {
    titulo: "Ahora que ya lo conocés, probalo.",
    cta: "Comenzar a practicar",
    ctaHref: "/simulador",
  },
} as const;

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
