/**
 * Los textos del marco de la guía de inscripción.
 *
 * Lo que cambia entre organismos vive en `content/guia-mpf.ts` y
 * `content/guia-mpd.ts`. Acá va lo que es igual en las dos: los rótulos de las
 * nueve secciones, el acordeón, el progreso y el checklist.
 */

export const guia = {
  titulo: "Guía de inscripción",
  bajada: "Te acompañamos durante todo el trámite, paso por paso.",

  // ---- pantalla 0 ----
  elegi: "Elegí el organismo",
  entrar: "Ingresar a la guía",
  sinGuia: "Todavía no hay guía cargada",

  // ---- las nueve secciones ----
  // Ojo: cuatro de estos títulos —antes, despues, examen y resultados— hoy no
  // los lee nadie. Esas secciones salen de `SeccionGuia`, que muestra el
  // `titulo` que trae cada material, así que los de verdad están escritos en
  // `guia-mpd.ts` y `guia-mpf.ts`. Se mantienen sincronizados a mano para que
  // el día que alguien los enchufe no arranquen diciendo otra cosa.
  secciones: {
    estado: "Estado de inscripción",
    antes: "Antes de empezar",
    saber: "Lo que conviene saber",
    pasos: "Etapa 1: Inscripción",
    despues: "Etapa 2: Ingreso a plataforma de examen",
    examen: "Etapa 3: Examen",
    resultados: "Resultados y orden de mérito",
    preguntas: "Preguntas frecuentes",
    // El checklist tenía el suyo, «Checklist», de cuando era una sección
    // aparte. Ahora es la fila de marcas al pie de la etapa 1, sin título,
    // como en las otras dos: no hay nada que nombrar.
  },

  // ---- el botón de la etapa 3 ----
  // Lleva al simulador desde la sección del examen: es el momento en que
  // alguien termina de leer cómo se rinde y lo único que puede hacer al
  // respecto es practicar.
  practicar: "Practicá con el simulador",

  // ---- el acordeón y el progreso ----
  paso: (n: number) => `Paso ${n}`,
  deCuantos: (n: number, total: number) => `Paso ${n} de ${total}`,
  hecho: "Ya lo hice",
  desmarcar: "Marcado como hecho",
  abrir: "Abrir el paso",
  cerrar: "Cerrar el paso",
  progreso: (hechos: number, total: number) => `${hechos} de ${total} pasos`,
  progresoAyuda: "Tu avance en la guía",

  // ---- el checklist final ----
  // Es una fila de cuatro marcas, sin texto a la vista: los dos de acá abajo
  // sólo los lee el lector de pantalla, que necesita saber qué significa el
  // número suelto que ve el resto.
  checklistHecho: "Hecho",
  checklistPendiente: "Pendiente",

  // Las advertencias ya no llevan rótulo: decían «OJO» las graves y «Tené en
  // cuenta» las medias, y el marco, el signo y el propio texto ya dicen las
  // dos cosas. Por eso acá no queda ninguno.

  // ---- huecos de material ----
  huecoCaptura: "Falta la captura",
  huecoVideo: "Falta el video",

  // ---- pie ----
  fuentes: "Fuentes de la guía",
  verificar:
    "Verificá siempre la información en las fuentes oficiales antes de inscribirte: esta guía no reemplaza al sitio del organismo.",
} as const;
