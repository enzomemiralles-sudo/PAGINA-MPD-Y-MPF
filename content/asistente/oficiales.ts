import type { EntradaFaq } from "@/content/asistente/corpus.generado";

/**
 * Las respuestas que sí tienen respaldo oficial.
 *
 * No salen del corpus de dudas: salen de los documentos, y cada una dice de
 * cuál y de qué artículo. Son las únicas que el asistente muestra en verde.
 *
 * Existen porque el corpus, siendo bueno, es memoria de gente. Cuando la
 * memoria y el documento no coinciden —pasa: la entrada mpf-053 se olvida de
 * dos de los cinco contenidos que el MPF publica— tiene que ganar el
 * documento, y para eso hay que tenerlo escrito aparte.
 *
 * Regla para agregar una: sólo si se leyó el documento y dice eso. Si hay que
 * interpretar, no va acá; va al corpus, en amarillo.
 */
export type EntradaOficial = EntradaFaq & {
  fuente: string;
  /** Dónde, dentro de la fuente. «Artículo 27» sirve; «el PDF» no. */
  donde: string;
};

const base = {
  nota: null,
  consultas: 0,
  personas: 0,
  confianza: "alta" as const,
  atadaALaConvocatoria: false,
  citas: [],
};

export const OFICIALES: EntradaOficial[] = [
  // ---------- MPD · Reglamento para el Ingreso de Personal ----------
  {
    ...base,
    id: "of-mpd-examen",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Formato y modalidad del examen",
    pregunta: "¿Cómo es el examen de Técnico Administrativo del MPD?",
    respuesta:
      "Son dos evaluaciones escritas e individuales, sin material de consulta. La primera es de conocimientos teóricos: diez preguntas de opción múltiple, diez puntos cada una, sobre la Constitución Nacional, la Ley Orgánica del MPD (27.149) y el Régimen Jurídico del MPD. Cada respuesta equivocada resta diez puntos; las que se dejan sin responder no suman ni restan. La segunda es de conocimientos en informática: copiar en la computadora un texto de ciento treinta palabras respetando su formato. Las dos se califican de 0 a 100 y en cada una hace falta un mínimo de 60 puntos.",
    variantes: [
      "como es el examen del mpd",
      "cuantas preguntas tiene el examen del mpd",
      "que se rinde en el mpd",
      "el examen del mpd tiene dos partes",
      "que pasa si respondo mal",
      "cuanto resta una respuesta incorrecta",
      "como se computan las respuestas incorrectas",
      "responder mal descuenta puntos",
      "cual es la nota minima para aprobar el mpd",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículos 25, 26 y 27",
  },
  {
    ...base,
    id: "of-mpd-temario",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Temario y material de estudio",
    pregunta: "¿Qué normativa tengo que estudiar para el MPD?",
    respuesta:
      "Los cuestionarios del examen teórico aluden a temáticas vinculadas con el MPD, particularmente relacionadas con la Constitución Nacional, la Ley Orgánica del Ministerio Público de la Defensa (Nro. 27.149) y el Régimen Jurídico del MPD. Esas tres son las normas sobre las que se toma.",
    variantes: [
      "que normativa estudiar para el mpd",
      "que tengo que estudiar para el mpd",
      "que temas entran en el mpd",
      "que leyes entran en el examen del mpd",
      "de donde estudio para el mpd",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículo 26",
  },
  {
    ...base,
    id: "of-mpd-tipeo",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Formato y modalidad del examen",
    pregunta: "¿Cómo se corrige el examen de tipeo del MPD?",
    respuesta:
      "Se parte del puntaje máximo y se descuenta. No se tienen por palabras correctamente escritas las que presenten errores de tipeo u ortográficos, las que estén duplicadas, las que no estén en el texto original, las que contengan errores de acentuación, las palabras cortadas o unidas indebidamente, los errores de mayúscula o minúscula y los errores en el formato del texto. Cada término erróneo descuenta cinco puntos. Si no se llega a copiar todo el texto, también se descuentan cinco puntos por cada palabra no escrita, y los dos tipos de error se suman. La unidad es la palabra: tres letras mal en la misma palabra son un solo error.",
    variantes: [
      "como se corrige el tipeo",
      "cuanto resta cada error de tipeo",
      "que cuenta como error en el tipeo",
      "cuantas palabras hay que copiar",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículo 27",
  },
  {
    ...base,
    id: "of-mpd-tiempo",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Formato y modalidad del examen",
    pregunta: "¿Cuánto tiempo dan para rendir en el MPD?",
    respuesta:
      "Treinta minutos en total para las dos evaluaciones, no treinta para cada una. El teórico y el tipeo se rinden dentro de ese mismo plazo.",
    variantes: [
      "cuanto dura el examen del mpd",
      "cuantos minutos dan en el mpd",
      "los 30 minutos son de cada parte",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículo 29",
  },
  {
    ...base,
    id: "of-mpd-estudiantes",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Resultados y orden de mérito",
    pregunta: "Soy estudiante de Derecho. ¿Tengo alguna ventaja en el MPD?",
    respuesta:
      "Sí. Para armar el orden de mérito se suman las calificaciones de las dos evaluaciones, y esa suma se incrementa en un 25% para quienes acrediten ser estudiantes de la carrera de Abogacía. El dictamen con el orden de mérito lo publica el Comité Permanente de Evaluación en el portal web del MPD, dentro de los quince días de terminadas las evaluaciones.",
    variantes: [
      "estudiante de derecho mpd ventaja",
      "el 25% para estudiantes",
      "sirve estar cursando abogacia",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículo 30",
  },
  {
    ...base,
    id: "of-mpd-vigencia",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Vigencia de notas y exámenes anteriores",
    pregunta: "¿Cuánto tiempo vale el examen aprobado del MPD?",
    respuesta:
      "Las listas definitivas tienen vigencia por dos años. Quien aprueba se mantiene en la lista durante ese plazo, o hasta que lo designen en un cargo permanente si eso pasa antes. Quien esté ocupando un cargo no permanente se mantiene en la lista sólo para los cargos permanentes.",
    variantes: [
      "cuanto dura la lista del mpd",
      "el examen del mpd vence",
      "cuanto vale la nota del mpd",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículo 23",
  },
  {
    ...base,
    id: "of-mpd-entrevista",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Después del examen",
    pregunta: "¿Hay entrevista en el MPD?",
    respuesta:
      "Para el ingreso no hay entrevista personal. Lo que sí hay, previo al nombramiento, es un examen psicotécnico: quien resulte elegido debe acreditar aptitud psicotécnica para el cargo. La Dirección General de Recursos Humanos y Haberes supervisa que reúna los requisitos para la designación.",
    variantes: [
      "hay entrevista en el mpd",
      "psicotecnico mpd",
      "que pasa despues de aprobar el mpd",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículo 24",
  },
  {
    ...base,
    id: "of-mpd-juridico",
    organismo: "mpd",
    ambito: "nacion",
    categoria: "Formato y modalidad del examen",
    pregunta: "¿Qué se rinde para Técnico Jurídico en el MPD?",
    respuesta:
      "Además de la evaluación escrita, hay una evaluación de antecedentes: el Tribunal Examinador emite un dictamen sobre quienes hayan alcanzado el puntaje mínimo, dentro de los cinco días de publicada la resolución de impugnaciones. Las impugnaciones se resuelven en diez días y esa resolución no admite recurso.",
    variantes: [
      "tecnico juridico mpd que se rinde",
      "evaluacion de antecedentes mpd",
      "ya me recibi que rindo",
    ],
    fuente: "reglamento-mpd",
    donde: "Artículos 18 y 19",
  },

  // ---------- MPF · contenidos evaluables publicados ----------
  {
    ...base,
    id: "of-mpf-temas",
    organismo: "mpf",
    categoria: "Temario y material de estudio",
    pregunta: "¿Qué temas entran en el examen teórico del MPF?",
    respuesta:
      "El Ministerio Público Fiscal publica cinco contenidos evaluables: historia de la República Argentina y latinoamericana; sistema constitucional; problemática de género; ordenamiento institucional y jurídico del Ministerio Público Fiscal; y Código Procesal Penal Federal.",
    variantes: [
      "que temas entran en el mpf",
      "que se estudia para el mpf",
      "temario del examen del mpf",
      "contenidos evaluables mpf",
    ],
    fuente: "contenidos-mpf",
    donde: "Contenidos evaluables",
  },
  {
    ...base,
    id: "of-mpf-practico",
    organismo: "mpf",
    categoria: "Formato y modalidad del examen",
    pregunta: "¿Cómo es la parte práctica del examen del MPF?",
    respuesta:
      "No es una prueba de ofimática. Consiste en hacer búsquedas web —en el sitio del Ministerio Público Fiscal y en otros portales oficiales— para encontrar fallos, resoluciones y demás información de la actividad judicial del organismo, y responder preguntas de opción múltiple a partir de lo encontrado. Por eso no se puede resolver de memoria: hace falta poder abrir otra pestaña mientras se responde.",
    variantes: [
      "como es la parte practica del mpf",
      "el practico del mpf es word",
      "que hay que hacer en el practico",
      "se puede rendir el mpf del celular",
    ],
    fuente: "contenidos-mpf",
    donde: "Parte práctica",
  },
  {
    ...base,
    id: "of-mpf-bibliografia",
    organismo: "mpf",
    categoria: "Temario y material de estudio",
    pregunta: "¿Qué bibliografía hay que estudiar para el MPF?",
    respuesta:
      "No hay bibliografía obligatoria ni material único oficial. Para historia y formación cívica, el propio Ministerio Público Fiscal indica que alcanza con cualquier manual de cuarto o quinto año del secundario, porque son contenidos aprobados por el Ministerio de Educación. Para el resto, la normativa básica: Constitución Nacional, Ley Orgánica del MPF 27.148, Ley de Ingreso Democrático 26.861, resoluciones PGN 507/14 y 3329/16, Ley 26.485 de violencia contra las mujeres, Ley 26.743 de identidad de género, convenciones internacionales sobre derechos humanos y género, y el Código Procesal Penal Federal (leyes 27.150 y 27.482).",
    variantes: [
      "que bibliografia hay para el mpf",
      "de donde estudio para el mpf",
      "hay material oficial del mpf",
      "que normativa estudiar mpf",
    ],
    fuente: "contenidos-mpf",
    donde: "Bibliografía",
  },
];
