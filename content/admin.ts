/** Los textos del panel de carga. Ningún string suelto en componentes. */

export const admin = {
  titulo: "Cargar preguntas",
  bajada:
    "Pegá el JSON y apretá cargar. Se valida entero antes de escribir: si una sola pregunta está mal, no entra ninguna.",
  aviso:
    "Todo lo que se carga acá entra sin revisar y no se ve en el simulador hasta que lo apruebes una por una en Revisar. No hay forma de saltear ese paso, y es a propósito.",
  etiquetaJson: "El JSON",
  marcador: "Pegá acá el JSON",
  cargar: "Cargar preguntas",
  cargando: "Cargando…",
  limpiar: "Limpiar",
  irARevisar: "Ir a revisar",

  formato: {
    titulo: "El formato",
    bajada:
      "Nada de ids ni de orden: el examen se identifica por organismo, instancia y modalidad, y el orden lo pone la base.",
    copiar: "Copiar el ejemplo",
    copiado: "Copiado",
  },

  campos: [
    { campo: "organismo", que: "«mpd» o «mpf»." },
    { campo: "instancia", que: "«teorico» o «practico»." },
    { campo: "modalidad", que: "«multiple_choice», «tipeo» o «investigacion»." },
    { campo: "enunciado", que: "La consigna. Entre 8 y 4000 caracteres." },
    { campo: "opciones", que: "Lista de {clave, texto}. Dos como mínimo en opción múltiple." },
    { campo: "respuesta", que: "La clave correcta. Tiene que ser una de las opciones." },
    { campo: "tema", que: "Para las barras de progreso por tema. Opcional, pero conviene." },
    { campo: "fuente", que: "De dónde salió. Opcional." },
    { campo: "explicacion", que: "Por qué esa es la correcta. Opcional." },
    { campo: "confianza", que: "«alta», «media» o «baja». Por defecto media." },
  ],

  resultado: {
    ok: (n: number, examen: string) =>
      n === 1 ? `Entró 1 pregunta en ${examen}.` : `Entraron ${n} preguntas en ${examen}.`,
    ninguna: (examen: string) => `No entró ninguna: ${examen} ya las tenía todas.`,
    repetidas: (n: number) =>
      n === 1 ? "1 ya estaba cargada y se salteó." : `${n} ya estaban cargadas y se saltearon.`,
    sinRevisar: "Ninguna se ve en el simulador todavía: hay que revisarlas.",
  },

  errores: {
    titulo: "No se cargó nada",
    vacio: "Pegá algo primero.",
    problemas: "Lo que está mal:",
  },
} as const;

/** El ejemplo que se copia con el botón. Es JSON válido y carga tal cual. */
export const EJEMPLO = JSON.stringify(
  {
    organismo: "mpd",
    instancia: "teorico",
    modalidad: "multiple_choice",
    preguntas: [
      {
        enunciado: "¿Qué mayoría requiere la designación del Defensor General de la Nación?",
        opciones: [
          { clave: "a", texto: "Mayoría simple del Senado" },
          { clave: "b", texto: "Dos tercios de los miembros presentes del Senado" },
          { clave: "c", texto: "Mayoría absoluta de ambas cámaras" },
        ],
        respuesta: "b",
        tema: "Ley 27.149",
        fuente: "Ley 27.149, art. 12",
        confianza: "alta",
      },
    ],
  },
  null,
  2,
);
