/**
 * Todos los textos del simulador. Ningún string suelto en los componentes.
 *
 * REGLA QUE ATRAVIESA TODO EL ARCHIVO (S-09): acá no se publica nunca cuántas
 * preguntas tiene el banco. Ni en las tarjetas, ni en el hub, ni en los
 * resultados. La base cambia todo el tiempo y un número fijo envejece mal.
 * Lo que sí se dice es cuántas trae el intento —«pregunta 7 de 20»—, que es
 * la longitud de este examen y sale de `exams`, no del tamaño del banco.
 *
 * tests/simulador-textos.test.ts recorre este archivo buscando números
 * pegados a la palabra «pregunta», para que la regla no dependa de que
 * alguien se acuerde.
 */

export const encabezado = {
  titulo: "Simulador de Exámenes",
  bajada: "Prepará tu ingreso. Practicá. Medí tu nivel.",
  parrafo:
    "Rendí con el formato, el tiempo y el criterio de corrección de cada organismo. El MPF y el MPD no toman igual, así que acá tampoco se practican igual: cada uno tiene sus dos instancias y sus propias reglas de puntaje. La base de preguntas es amplia y se actualiza constantemente, y podés volver a intentarlo las veces que quieras.",
  cta: "Comenzar a practicar",
  ancla: "elegi-tu-examen",
} as const;

export const retomar = {
  titulo: "Tenés un examen empezado",
  texto: "Quedó donde lo dejaste. Podés seguirlo o empezar otro.",
  cta: "Retomar",
} as const;

export const eleccion = {
  titulo: "Elegí tu examen",
  bajada: "Dos organismos, dos instancias cada uno. Elegí por dónde empezar.",
} as const;

export type Instancia = "teorico" | "practico";
export type Modalidad = "multiple_choice" | "investigacion" | "tipeo";

export const organismos = [
  {
    clave: "mpf",
    sigla: "MPF",
    nombre: "Ministerio Público Fiscal",
    cta: "Comenzar MPF",
    instancias: [
      {
        instancia: "teorico",
        titulo: "Examen teórico",
        detalle: "Opción múltiple sobre los contenidos evaluables.",
      },
      {
        instancia: "practico",
        titulo: "Examen práctico",
        detalle:
          "Consignas de búsqueda e investigación, respondidas por opción múltiple. Se resuelven consultando las fuentes, como en el examen real.",
      },
    ],
  },
  {
    clave: "mpd",
    sigla: "MPD",
    nombre: "Ministerio Público de la Defensa",
    cta: "Comenzar MPD",
    instancias: [
      {
        instancia: "teorico",
        titulo: "Examen teórico",
        detalle: "Opción múltiple sobre los contenidos evaluables.",
      },
      {
        instancia: "practico",
        titulo: "Examen práctico de tipeo",
        detalle:
          "Copiar un texto respetando acentuación, puntuación, mayúsculas y espacios. Mide precisión al escribir, no conocimiento.",
      },
    ],
  },
] as const;

export type ClaveOrganismo = (typeof organismos)[number]["clave"];

export const comoFunciona = {
  titulo: "¿Cómo funciona?",
  pasos: [
    { n: "01", titulo: "Elegí tu examen", texto: "MPF o MPD. Cada uno toma distinto." },
    {
      n: "02",
      titulo: "Elegí qué querés practicar",
      texto: "El teórico, el práctico, o los dos por separado.",
    },
    {
      n: "03",
      titulo: "Resolvé",
      texto: "Con el tiempo del examen real y el mismo criterio de corrección.",
    },
    {
      n: "04",
      titulo: "Revisá tu desempeño",
      texto: "Qué acertaste, qué erraste y cuánto tiempo te llevó.",
    },
  ],
} as const;

export const aviso = {
  titulo: "Una herramienta para practicar, no para adivinar el examen",
  parrafos: [
    "Los resultados son orientativos y no representan resultados oficiales. Este simulador no anticipa las preguntas del examen ni garantiza ningún puntaje: sirve para llegar entrenado, no para saber de antemano qué va a tomar.",
    "Las preguntas se arman a partir de material de estudio, exámenes anteriores y normativa pública. Ni Nexo Derecho ni Nueva Abogacía tienen vínculo con el Ministerio Público de la Defensa ni con el Ministerio Público Fiscal.",
  ],
} as const;

export const cierre = {
  titulo: "Tu preparación empieza acá.",
  bajada: "Practicá. Detectá tus errores. Volvé a intentarlo.",
  gratis: "El acceso al simulador es gratuito.",
  cta: "Comenzar a practicar",
} as const;

/** S-14: las reglas, dentro del flujo del examen y no como sección de venta. */
export const reglas = {
  titulo: "Cómo se corrige",
  duracion: (minutos: number) => `${minutos} minutos`,
  duracionRotulo: "Tiempo",
  cantidadRotulo: "Trae",
  // El teórico trae preguntas y el práctico del MPF trae consignas de
  // búsqueda: llamarlos igual sería inexacto en uno de los dos. Que aparezca
  // el número no choca con S-09: es la longitud de este intento, la misma que
  // «Pregunta 7 de 20», y no el tamaño del banco.
  cantidad: (n: number, modalidad: Modalidad) => {
    if (modalidad === "tipeo") return "un texto";
    if (modalidad === "investigacion") return n === 1 ? "una consigna" : `${n} consignas`;
    return n === 1 ? "una pregunta" : `${n} preguntas`;
  },
  correctaRotulo: "Cada acierto",
  incorrectaRotulo: "Cada error",
  blancoRotulo: "Sin responder",
  minimoRotulo: "Se aprueba con",
  puntos: (n: number) => `${n > 0 ? "+" : ""}${n} puntos`,
  desde: (n: number) => `Se parte de ${n} puntos`,
  // El descuento por error es la regla que más cambia cómo se rinde: sin
  // decirla, alguien contesta todo al azar creyendo que no le cuesta nada.
  aclaracionDescuento:
    "Responder mal descuenta. Si dudás mucho, dejarla en blanco cuesta menos que errarla.",
  orientativoMpf:
    "El MPF no publica su escala de puntaje. Usamos la del MPD, que sí está publicada, para que el resultado sea comparable. Tomalo como orientativo.",
  // Artículo 29 del Reglamento de Ingreso del MPD. Practicar cada instancia
  // con los treinta minutos completos enseña un ritmo que el examen no da.
  sesionCompartidaMpd:
    "En el examen real las dos instancias del MPD se rinden en 30 minutos en total, no 30 cada una. Acá se practican por separado.",
  comenzar: "Comenzar",
  comenzando: "Preparando el examen…",
  error: "No pudimos empezar el examen. Probá de nuevo.",
  volver: "Volver",
} as const;

export const rendir = {
  // Sale de `exams.cantidad_preguntas`, que es la longitud del intento y no
  // el tamaño del banco. Ver la regla de arriba.
  posicion: (actual: number, total: number) => `Pregunta ${actual} de ${total}`,
  anterior: "Anterior",
  siguiente: "Siguiente",
  marcar: "Marcar para revisar",
  marcada: "Marcada",
  entregar: "Entregar examen",
  entregando: "Corrigiendo…",
  guardando: "Guardando…",
  guardado: "Guardado",
  sinGuardar: "No pudimos guardar. Revisá tu conexión.",
  // Un examen sin corregir no es un problema de conexión, y decirlo así manda
  // a la persona a mirar su wifi cuando lo que falta está en el servidor.
  sinClave: "No podemos corregir: falta configurar la clave de servicio del servidor. Tu examen quedó guardado; probá de nuevo cuando esté resuelto.",
  sinCorregir: "No pudimos corregir el examen. Quedó guardado: probá de nuevo.",
  confirmarTitulo: "¿Entregás el examen?",
  confirmarSinResponder: (n: number) =>
    n === 1 ? "Te queda una sin responder." : `Te quedan ${n} sin responder.`,
  confirmarTodo: "Contestaste todas.",
  confirmarSi: "Sí, entregar",
  confirmarNo: "Seguir resolviendo",
  tiempoRotulo: "Tiempo restante",
  seAcabo: "Se acabó el tiempo. Entregamos lo que tenías.",
  navegador: "Preguntas",
  leyendaRespondida: "Respondida",
  leyendaMarcada: "Marcada",
  leyendaSinResponder: "Sin responder",
} as const;

export const tipeo = {
  titulo: "Práctico de tipeo",
  consigna:
    "Copiá el texto de abajo tal cual está: acentuación, puntuación, mayúsculas, minúsculas y espacios. La marginación no se evalúa.",
  original: "Texto a copiar",
  tuTexto: "Escribí acá",
  avance: "Palabras escritas",
  erroresRotulo: "Errores hasta acá",
  entregar: "Entregar",
  // Sin esto, el número de errores se lee como el puntaje final y no lo es:
  // el reglamento descuenta también por cada palabra que quedó sin escribir.
  faltante:
    "El contador de arriba cuenta lo que escribiste. Cada palabra que quede sin copiar también descuenta cinco puntos al entregar.",
  reglamento:
    "Se parte de 100 puntos y cada palabra descuenta 5. Una palabra cuenta como mal escrita si tiene un error de tipeo, de ortografía o de acentuación, si está duplicada, si no está en el texto original, si está cortada o unida de más, o si tiene mal la mayúscula. Es el artículo 27 del Reglamento de Ingreso del MPD.",
  formato:
    "El examen real también cuenta como error el formato: negritas, cursivas y subrayados. Esta práctica compara sólo el texto, así que en eso exige menos que el examen.",
  sesionCompleta:
    "En el examen real los 30 minutos son para el teórico y el tipeo juntos (artículo 29). Acá podés practicar cada instancia por separado con los 30 completos: tenelo en cuenta al medir tu ritmo.",
} as const;

export const resultado = {
  titulo: "Cómo te fue",
  aprobado: "Aprobado",
  desaprobado: "No alcanzó el mínimo",
  puntajeRotulo: "Puntaje",
  minimoRotulo: "Mínimo para aprobar",
  correctasRotulo: "Correctas",
  incorrectasRotulo: "Incorrectas",
  // En el tipeo no hay respuestas incorrectas: hay caracteres que no coinciden.
  erroresRotulo: "Errores",
  blancoRotulo: "En blanco",
  aciertosRotulo: "Aciertos",
  tiempoRotulo: "Tiempo utilizado",
  tiempo: (minutos: number, segundos: number) =>
    `${minutos} min ${String(segundos).padStart(2, "0")} s`,
  temasTitulo: "Desempeño por tema",
  revisionTitulo: "Revisión",
  tuRespuesta: "Tu respuesta",
  correcta: "Correcta",
  sinResponder: "No la contestaste",
  deNuevo: "Practicar de nuevo",
  volver: "Volver al simulador",
} as const;

/**
 * Cuando no hay nada que mostrar.
 *
 * No dice «próximamente». Dice qué pasa y qué se puede hacer mientras tanto,
 * que es lo único honesto cuando el banco todavía no tiene nada revisado: una
 * pregunta sin revisar no se publica, y publicarla igual sería peor que no
 * tener la pantalla.
 */
export const vacio = {
  titulo: "Todavía no hay preguntas disponibles para esta instancia",
  texto:
    "Estamos revisando el material una por una antes de publicarlo. Una pregunta sin revisar no se publica, aunque eso signifique que la instancia quede vacía unos días.",
  volver: "Volver al simulador",
} as const;
