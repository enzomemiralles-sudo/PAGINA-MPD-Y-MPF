import { MPD as fuente } from "@/content/inscripcion/mpd";
import type { Aviso, Paso as PasoViejo, Seccion as SeccionVieja } from "@/lib/inscripcion/tipos";
import type { Advertencia, Guia, PasoGuia, SeccionTexto } from "@/lib/guia/tipos";

/**
 * LA GUÍA DE INSCRIPCIÓN DEL MPD
 *
 * No se reescribe nada: el material del MPD ya está en el repositorio, sale
 * del manual de Nexo y está verificado. Este archivo lo MAPEA a la estructura
 * ① a ⑨ que comparten los dos organismos.
 *
 * Derivar en vez de transcribir no es una comodidad: son 383 líneas de prosa
 * sobre un trámite donde equivocarse cuesta el turno. Copiándolas a mano se
 * cuelan erratas, y peor, se desincronizan el día que alguien corrija el
 * original. Así hay una sola versión de cada frase.
 *
 * Donde el material del MPD no cubre una sección, va `null` y esa sección no
 * se renderiza. Todos los videos van en null: no hay ninguno todavía.
 */

/** Los avisos del material viejo tienen tres tonos; acá pesan dos. */
function comoAdvertencia(a: Aviso): Advertencia {
  return {
    // Las «trampas» son las que hacen perder el turno. Las otras dos categorías
    // del material viejo —«ojo» y «dato»— no llegan a eso.
    peso: a.tono === "trampa" ? "alta" : "media",
    texto: `${a.titulo}. ${a.texto}`,
  };
}

/** Un paso del material viejo, con la forma de la guía nueva. */
function comoPaso(p: PasoViejo): PasoGuia {
  const puntos = p.puntos ? p.puntos.items.map((i) => `${i.titulo}. ${i.texto}`) : [];
  return {
    n: p.n,
    titulo: p.titulo,
    resumen: p.resumen,
    cuerpo: [...p.cuerpo, ...puntos, ...(p.consejo ? [p.consejo] : [])],
    // Las capturas del MPD no existen y no pueden existir sin que alguien haga
    // el trámite en una PC con Windows: el sistema es una aplicación Adobe
    // Flex que expulsa a todo navegador desde diciembre de 2020. Ver B-07.
    capturas: p.capturas.map((c, i) => ({
      id: `mpd-paso${p.n}-${i + 1}`,
      descripcion: c.alt,
      src: c.archivo,
    })),
    videos: [],
    advertencias: p.avisos.map(comoAdvertencia),
    enlace: p.donde && p.donde.includes(".") ? { texto: p.donde, url: `https://${p.donde}` } : null,
  };
}

/** Una o varias secciones del material viejo, fundidas en una de la nueva. */
function comoSeccion(titulo: string, anclas: string[]): SeccionTexto | null {
  const partes = anclas
    .map((a) => fuente.secciones.find((s) => s.ancla === a))
    .filter((s): s is SeccionVieja => s !== undefined);
  if (partes.length === 0) return null;

  return {
    titulo,
    cuerpo: partes.flatMap((s) => [
      ...(s.bajada ? [s.bajada] : []),
      ...s.cuerpo,
      ...(s.consejo ? [s.consejo] : []),
    ]),
    items: partes.flatMap((s) => (s.puntos ? s.puntos.items.map((i) => `${i.titulo}. ${i.texto}`) : [])).length
      ? partes.flatMap((s) => (s.puntos ? s.puntos.items.map((i) => `${i.titulo}. ${i.texto}`) : []))
      : null,
    advertencias: partes.flatMap((s) => s.avisos.map(comoAdvertencia)),
    enlaces: [],
  };
}

export const MPDGuia: Guia = {
  organismo: fuente.organismo,
  sigla: fuente.sigla,
  nombre: fuente.nombre,
  cargo: fuente.cargo,

  // ① El estado vivo sale de `concursos`, igual que en la franja de siempre.
  // Acá va sólo lo que es propio del MPD.
  estado: {
    cuerpo: [
      "La convocatoria del MPD todavía no está publicada. Cuando salga, la inscripción son cinco días hábiles: todo lo que se pueda adelantar —instalar la aplicación, registrarse, cargar el CV— conviene hacerlo antes.",
      "Verificá siempre en el sitio oficial: esta guía no reemplaza la consulta a la Secretaría de Concursos.",
    ],
    enlaces: fuente.enlaces
      .filter((e) => e.url !== null)
      .slice(0, 2)
      .map((e) => ({ texto: `${e.que} · ${e.donde}`, url: e.url as string })),
  },

  // ② Es el checklist del material viejo: qué tener antes de empezar.
  antes: {
    titulo: fuente.checklist.titulo,
    cuerpo: [fuente.checklist.bajada],
    items: fuente.checklist.items.map((i) => `${i.titulo}. ${i.texto}`),
    advertencias: [],
    enlaces: [],
    documentacion: fuente.checklist.items.map((i) => i.titulo),
  },

  // ③ Las trampas del trámite, que son lo que más valor tiene de toda la guía.
  saber: [
    ...(fuente.destacado ? [{ peso: "alta" as const, texto: fuente.destacado.cuerpo.join(" ") }] : []),
    ...fuente.pasos.flatMap((p) => p.avisos.filter((a) => a.tono === "trampa").map(comoAdvertencia)),
    ...fuente.secciones.flatMap((s) => s.avisos.filter((a) => a.tono === "trampa").map(comoAdvertencia)),
  ],

  // ④ Los cuatro pasos, uno a uno.
  pasos: fuente.pasos.map(comoPaso),

  // ⑤ a ⑦
  despues: comoSeccion("Después de inscribirte", ["usuario-para-rendir"]),
  examen: comoSeccion("El día del examen", ["el-dia-del-examen", "que-se-estudia"]),
  resultados: comoSeccion("Resultados y orden de mérito", ["resultados"]),

  // ⑧ Los errores frecuentes del material viejo ya están escritos como
  // «esto me pasó, qué hago»: son preguntas frecuentes con otro nombre.
  preguntas: fuente.errores.map((e) => ({
    pregunta: e.titulo,
    respuesta: e.cuerpo.join(" "),
  })),

  fuentes: fuente.enlaces
    .filter((e) => e.url !== null)
    .map((e) => ({ texto: `${e.que} · ${e.donde}`, url: e.url as string })),
};
