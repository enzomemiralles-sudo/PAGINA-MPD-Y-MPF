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
  secciones: {
    estado: "Estado de inscripción",
    antes: "Antes de empezar",
    saber: "Lo que tenés que saber antes",
    pasos: "Guía paso a paso",
    despues: "Después de inscribirte",
    examen: "El día del examen",
    resultados: "Resultados y orden de mérito",
    preguntas: "Preguntas frecuentes",
    checklist: "Checklist final",
  },

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
  checklistBajada:
    "Se arma solo con lo que fuiste marcando. Nada de esto se manda a ningún lado: queda en este navegador.",
  documentacion: "Documentación",
  losPasos: "Los pasos",
  faltan: (n: number) => (n === 1 ? "Te falta 1 cosa" : `Te faltan ${n} cosas`),
  completo: "No te falta nada",
  imprimir: "Imprimir el checklist",

  // ---- advertencias ----
  ojo: "Ojo",
  tenerEnCuenta: "Tené en cuenta",

  // ---- huecos de material ----
  huecoCaptura: "Falta la captura",
  huecoVideo: "Falta el video",

  // ---- pie ----
  fuentes: "De dónde sale esta guía",
  verificar:
    "Verificá siempre la información en las fuentes oficiales antes de inscribirte: esta guía no reemplaza al sitio del organismo.",
} as const;
