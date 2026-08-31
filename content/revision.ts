/**
 * Los textos de la pantalla de revisión.
 *
 * Va aparte de `content/simulador.ts` porque es otra cosa: no la ve quien
 * practica, la ve quien revisa. Por eso acá SÍ se dicen cantidades —«quedan
 * 214 sin revisar»— sin chocar con S-09, que prohíbe publicar el tamaño del
 * banco *en la interfaz del simulador*. Quien revisa necesita saber cuánto
 * falta; quien estudia, no.
 */

export const revision = {
  titulo: "Revisión de preguntas",
  bajada:
    "Ninguna pregunta se publica sin que alguien la haya mirado. Acá se mira: se confirma la respuesta, se corrige el tema si hace falta, y recién ahí sale.",

  progreso: (pendientes: number, revisadas: number) =>
    `${pendientes} sin revisar · ${revisadas} listas`,
  terminado: "No queda ninguna pregunta sin revisar.",
  terminadoTexto: "Cuando se carguen preguntas nuevas van a aparecer acá.",

  filtros: {
    titulo: "Mostrar",
    todos: "Todas",
    organismo: { mpd: "MPD", mpf: "MPF" },
    confianza: {
      titulo: "Confianza",
      alta: "Alta (cruzada con otra fuente)",
      media: "Media",
      baja: "Baja",
    },
  },

  pregunta: {
    fuente: "Fuente",
    confianza: "Confianza",
    orden: "N.º",
    respuesta: "Respuesta marcada como correcta",
    respuestaAyuda:
      "Si la marcada está mal, elegí la correcta acá mismo antes de aprobar.",
    tema: "Tema",
    temaAyuda: "Lo propuso una regla por palabras clave. Confirmalo o cambialo.",
    temaOtro: "Otro tema…",
    nota: "Nota",
    notaAyuda: "Por qué la frenás. Queda guardada con la pregunta.",
  },

  acciones: {
    aprobar: "Aprobar y seguir",
    aprobando: "Guardando…",
    frenar: "Frenar con nota",
    frenando: "Guardando…",
    saltar: "Saltar",
    error: "No pudimos guardar. Probá de nuevo.",
  },

  atajos: {
    titulo: "Atajos",
    // Revisar 259 preguntas a mouse es una tarde. Con teclado es un rato.
    lista: [
      { tecla: "1 · 2 · 3", que: "elegir la respuesta" },
      { tecla: "Enter", que: "aprobar y seguir" },
      { tecla: "S", que: "saltar" },
    ],
  },

  sinAcceso: "Esta pantalla es para quienes revisan el banco de preguntas.",
} as const;

/**
 * Los temas que se pueden elegir.
 *
 * Los del MPF son, textualmente, los contenidos evaluables que publica el
 * organismo (material/metodologia/mpf-formato-examen.md). Los del MPD salen
 * de la Ley Orgánica 27.149, que es de lo que trata su examen.
 */
export const TEMAS = {
  mpf: [
    "Historia argentina y latinoamericana",
    "Sistema constitucional",
    "Problemática de género",
    "Ordenamiento del MPF",
    "Código Procesal Penal Federal",
    "Búsqueda e investigación",
  ],
  mpd: [
    "Estructura y autonomía del MPD",
    "Régimen disciplinario",
    "Ingreso, cargos e incompatibilidades",
    "Deberes y derechos del personal",
    "Defensa pública y acceso a la justicia",
    "Tipeo",
  ],
} as const;
