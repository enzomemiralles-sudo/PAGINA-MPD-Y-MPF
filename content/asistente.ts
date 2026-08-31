/**
 * Todos los textos del asistente. Ningún string suelto en los componentes.
 *
 * Dos reglas que atraviesan el archivo:
 *
 * A-13 — acá no se dice «inteligencia artificial» ni «chat con IA». No es
 * pudor: es que prometería otra cosa. Esto no conversa ni redacta, busca
 * entre respuestas ya escritas y te muestra de dónde salen. Se presenta por
 * lo que hace.
 *
 * A-08 — ningún texto de este archivo puede sonar a respuesta cuando no la
 * hay. El estado rojo tiene su propio texto, dice que no encontró y ofrece la
 * normativa y el formulario. No hay un «te doy una idea igual».
 */

export const encabezado = {
  titulo: "Asistente de Ingreso Democrático",
  bajada: "Resolvé tus dudas sobre el examen de ingreso al MPD y al MPF.",
  parrafo:
    "Está armado con las consultas reales de quienes ya rindieron y con la normativa de cada organismo. Cada respuesta te dice de dónde sale, para que puedas verificarla por tu cuenta. Y cuando no hay con qué respaldarla, te lo decimos en lugar de inventar.",
  // A-13. Los tres verbos son el posicionamiento, no un eslogan decorativo:
  // describen exactamente lo que hace la pantalla, en orden.
  posicionamiento: "Tu asistente para el Ingreso Democrático",
  pasos: ["Preguntá.", "Encontrá la respuesta.", "Verificá la fuente."],
} as const;

/**
 * A-02. Va arriba de todo y es obligatorio.
 *
 * Mezclar el MPD con el MPF es el peor error posible en esta pantalla: son
 * dos concursos distintos, con reglas distintas, y una respuesta del otro
 * organismo no es «casi correcta», es incorrecta. Por eso el filtro es duro
 * y no una preferencia, y por eso «No estoy seguro» no mezcla: muestra las
 * dos respuestas por separado, cada una con su organismo a la vista.
 */
export const selector = {
  rotulo: "¿Sobre cuál concurso querés preguntar?",
  ayuda: "Elegí uno. Las respuestas de un organismo no valen para el otro.",
  opciones: [
    { valor: "mpd", sigla: "MPD", nombre: "Ministerio Público de la Defensa" },
    { valor: "mpf", sigla: "MPF", nombre: "Ministerio Público Fiscal" },
    { valor: "ambos", sigla: "No estoy seguro", nombre: "Te muestro los dos, sin mezclarlos" },
  ],
  avisoAmbos:
    "Vas a ver la respuesta de cada organismo por separado, con su etiqueta. Nunca combinadas.",
} as const;

/** A-03. Accesos rápidos: llevan a un lugar concreto, no abren un submenú. */
export const categorias = {
  rotulo: "Accesos rápidos",
  items: [
    { texto: "Contenidos del examen", destino: "#contenidos" },
    { texto: "Normativa", destino: "#normativa" },
    { texto: "Modalidad y evaluación", destino: "#modalidad" },
    { texto: "Examen y simuladores", destino: "/simulador" },
    { texto: "Dudas frecuentes", destino: "#frecuentes" },
    { texto: "Hacer una pregunta", destino: "#preguntar" },
  ],
} as const;

export const caja = {
  ancla: "preguntar",
  // A-04, textual.
  ayuda: "¿No sabés cómo formular tu pregunta? No hay problema. Escribí tu duda con tus propias palabras.",
  rotulo: "Tu pregunta",
  marcador: "Escribí tu duda…",
  enviar: "Preguntar",
  pensando: "Buscando…",
  otra: "Hacer otra pregunta",
  vacia: "Escribí tu pregunta para poder buscarla.",
  falla: "No pudimos buscar tu pregunta. Probá de nuevo en un momento.",
  ejemplosRotulo: "Por ejemplo:",
  // A-05, textual.
  ejemplos: [
    "¿Qué temas entran en el examen del MPF?",
    "¿Cuántas preguntas tiene el examen?",
    "¿Qué normativa tengo que estudiar para el MPD?",
    "¿Cómo se computan las respuestas incorrectas?",
  ],
} as const;

/**
 * A-07. Lo más importante de la pestaña.
 *
 * El verde no lo decide cuánta gente coincidió: lo decide que exista un
 * documento oficial que lo diga y que se pueda abrir desde acá. El corpus
 * marca 32 entradas como «confianza alta», pero eso significa «lo
 * preguntaron mucho y las respuestas coincidieron», no «está escrito». Sin
 * fuente enlazable, la respuesta es amarilla aunque todo el grupo esté de
 * acuerdo.
 */
export const certezas = {
  respaldada: {
    icono: "🟢",
    titulo: "Respuesta respaldada",
    detalle: "Hay fuente oficial o normativa clara.",
  },
  orientativa: {
    icono: "🟡",
    titulo: "Información orientativa",
    detalle:
      "Según experiencias de personas que ya rindieron, este tema apareció en distintas oportunidades. Sin embargo, recomendamos verificar siempre la convocatoria y normativa vigente.",
  },
  sin_respuesta: {
    icono: "🔴",
    titulo: "No encontramos una respuesta",
    detalle:
      "No encontramos una respuesta suficientemente respaldada para esta consulta. Te recomendamos revisar la normativa oficial o reformular la pregunta.",
    cta: "Ver normativa",
  },
} as const;

/** A-06. La respuesta tiene siempre la misma forma. Nunca un párrafo suelto. */
export const respuesta = {
  rotuloPregunta: "Tu consulta",
  rotuloRespuesta: "Respuesta",
  rotuloFuente: "Fuente",
  verFuente: "Ver fuente →",
  rotuloRelacionada: "Consulta relacionada",
  // A-09.
  origen: "🔗 ¿De dónde sale esta respuesta?",
  origenCierra: "Ocultar de dónde sale",
  origenCorpus: "Consultas de referencia que la respaldan",
  origenSinFuente:
    "No hay un documento oficial que respalde esta respuesta. Sale de las consultas que se repitieron en los grupos de quienes rindieron, y por eso figura como orientativa.",
  origenConsultas: (consultas: number, personas: number) =>
    `Se preguntó ${consultas} ${consultas === 1 ? "vez" : "veces"}, por ${personas} ${personas === 1 ? "persona" : "personas"} distintas.`,
  atada:
    "Este dato cambia de una convocatoria a otra. Verificalo contra la convocatoria vigente antes de darlo por hecho.",
  jurisdicciones: { nacion: "Nación", pba: "Provincia de Buenos Aires", caba: "CABA" },
  jurisdiccionRotulo: "Jurisdicción",
} as const;

/**
 * Cuando el documento y la memoria del grupo no dicen lo mismo.
 *
 * No se elige una. Se muestran las dos y se dice que difieren: quien estudia
 * necesita saber que hay una discrepancia, sobre todo cuando la versión que
 * circula es la que se olvida de algo.
 */
export const contraste = {
  titulo: "Acá hay dos versiones que no coinciden",
  loQueDice: "Lo que circula en los grupos",
  cierre: "Para estudiar, seguí la fuente oficial.",
} as const;

/** A-11. Qué hacer después de leer una respuesta. */
export const siguiente = {
  rotulo: "Siguiente paso",
  simulador: { texto: "Practicar con un simulador", destino: "/simulador" },
  normativa: { texto: "Ver normativa", destino: "#normativa" },
  frecuentes: { texto: "Ver preguntas frecuentes", destino: "#frecuentes" },
  otra: { texto: "Hacer otra pregunta", destino: "#preguntar" },
} as const;

/**
 * A-10. Tan importante como la caja de preguntas, y por eso no está abajo de
 * todo ni escondida detrás de un acordeón.
 *
 * Mucha gente prefiere mirar una lista de preguntas ya respondidas antes que
 * escribirle algo a una máquina, y tiene razón: es más rápido y se ve de una
 * qué hay y qué no.
 */
export const frecuentes = {
  ancla: "frecuentes",
  titulo: "Preguntas que ya respondimos",
  bajada:
    "Buscá acá primero. Están ordenadas por cuánta gente las hizo, y cada una abre con su respuesta y su nivel de respaldo.",
  buscador: {
    rotulo: "Buscar entre las preguntas respondidas",
    marcador: "Buscar: tipeo, inscripción, notas…",
    limpiar: "Limpiar",
    buscar: "Buscar",
    sinResultados:
      "Ninguna de las preguntas respondidas coincide con eso. Probá con otras palabras, o hacé tu consulta más abajo.",
    resultados: (n: number) => `${n} ${n === 1 ? "pregunta" : "preguntas"} coinciden`,
  },
  masPreguntadas: {
    titulo: "Las más preguntadas",
    // El MPF trae la cuenta de cuánta gente preguntó cada cosa; el MPD, no.
    ayuda: "Las que más se repitieron. Tocá una para ver la respuesta.",
    ayudaSinCuenta: "Por dónde suele empezar todo el mundo. Tocá una para ver la respuesta.",
    veces: (n: number) => `${n} consultas`,
  },
  verTodas: "Ver todas las preguntas",
  abrir: "Ver la respuesta",
} as const;

/** Las secciones a las que apuntan los accesos rápidos. */
export const secciones = {
  contenidos: {
    ancla: "contenidos",
    titulo: "Contenidos del examen",
    bajada: "Qué entra, según lo que publica cada organismo.",
  },
  modalidad: {
    ancla: "modalidad",
    titulo: "Modalidad y evaluación",
    bajada: "Cómo se rinde y cómo se corrige.",
  },
  normativa: {
    ancla: "normativa",
    titulo: "Normativa y fuentes oficiales",
    bajada:
      "Los documentos con los que se arman las respuestas verdes. Están acá para que puedas leerlos vos.",
  },
} as const;

/**
 * A-12. El formulario para lo que no supimos contestar.
 *
 * Aparece solo después de un rojo, y además está siempre disponible acá
 * abajo: quien tiene una duda que no encaja en nada no debería tener que
 * provocar un error para poder dejarla.
 */
export const sinRespuesta = {
  ancla: "dejanos-tu-consulta",
  titulo: "¿No encontramos la respuesta?",
  bajada:
    "Dejanos tu consulta. La revisamos, buscamos de dónde sale y la sumamos para que la próxima persona sí la encuentre.",
  campos: {
    consulta: { rotulo: "Tu consulta", marcador: "¿Qué necesitás saber?" },
    email: {
      rotulo: "Tu correo (opcional)",
      marcador: "nombre@correo.com",
      ayuda: "Sólo para avisarte cuando tengamos la respuesta. No lo usamos para nada más.",
    },
  },
  enviar: "Dejar mi consulta",
  enviando: "Enviando…",
  gracias: "Listo. Quedó anotada.",
  // Textual, A-12.
  cierre: "Entre todos hacemos un asistente cada vez mejor para preparar el ingreso.",
  errores: {
    consulta: "Escribí tu consulta para poder revisarla.",
    email: "Ese correo no parece válido. Podés dejarlo vacío.",
    guardar: "No pudimos guardar tu consulta. Probá de nuevo en un momento.",
  },
} as const;
