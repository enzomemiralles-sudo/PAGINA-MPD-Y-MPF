import { MPD as fuente } from "@/content/inscripcion/mpd";
import type { Aviso, Paso as PasoViejo, Seccion as SeccionVieja } from "@/lib/inscripcion/tipos";
import type { Advertencia, Guia, PasoGuia, SeccionTexto } from "@/lib/guia/tipos";
import { INTRO_INGRESO, PASOS_EXAMEN, PASOS_INGRESO } from "@/content/guia-mpd-examen";

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

/**
 * Las capturas del sistema del MPD, por paso.
 *
 * Resuelven B-07, que estaba anotado como imposible: el sistema es una
 * aplicación Adobe Flex que se instala en Windows y cuyo propio código expulsa
 * a todo navegador desde diciembre de 2020, así que estas pantallas no existen
 * en la web. Salieron de hacer el trámite a mano en una PC con Windows.
 *
 * Van acá y no en `content/inscripcion/mpd.ts` —el material viejo, del que
 * este archivo deriva— porque el tipo de allá describe capturas que viven en
 * /public con otra forma. Cuando ese material se retire, esto viaja con la
 * guía.
 */
const CAPTURAS_MPD: Record<
  number,
  { id: string; descripcion: string; src: string; url?: string; trasParrafo?: number }[]
> = {
  1: [
    {
      id: "mpd-paso1-descargar",
      descripcion:
        "La página de concursos.mpd.gov.ar con el botón «Descargar la webapp Concursos para Microsoft Windows»",
      src: "/capturas/mpd-descargar-webapp.png",
      // La captura es la puerta de entrada del trámite: se hace clic y se
      // llega. Es la única de la guía que muestra una pantalla web —las demás
      // son de la aplicación instalada, que no tiene dirección— y sin el
      // enlace había que copiar la dirección a mano del párrafo de al lado.
      url: "https://concursos.mpd.gov.ar/",
    },
    {
      id: "mpd-paso1-escritorio",
      descripcion: "El acceso directo azul CONCURSOS, ya instalado en el escritorio",
      src: "/capturas/mpd-acceso-escritorio.png",
    },
  ],
  2: [
    {
      id: "mpd-paso2-registro",
      descripcion:
        "El formulario de registro del SURH, con sus tres campos: CUIL, correo electrónico y contraseña",
      src: "/capturas/mpd-registro-formulario.png",
    },
    {
      id: "mpd-paso2-validacion",
      descripcion: "El correo de validación que llega después de registrarse",
      src: "/capturas/mpd-mail-validacion.png",
    },
  ],
  3: [
    {
      id: "mpd-paso3-datos",
      descripcion:
        "La primera pantalla del CV dentro de la aplicación de escritorio: tipo y número de documento, apellido, nombres, género, fecha de nacimiento, nacionalidad, nombres de los padres, CUIL y estado civil",
      src: "/capturas/mpd-cv-datos-personales.png",
    },
    {
      id: "mpd-paso3-nacionalidad",
      descripcion: "El desplegable de nacionalidad, con «Argentino nativo» elegido",
      src: "/capturas/mpd-cv-nacionalidad.png",
    },
    {
      id: "mpd-paso3-fs",
      descripcion: "El campo «Copia de documento a fs.», que es el que más se pasa por alto",
      src: "/capturas/mpd-cv-campo-fs.png",
    },
    {
      id: "mpd-paso3-regular",
      descripcion: "La fila donde se declara ser estudiante regular de la carrera",
      src: "/capturas/mpd-cv-estudiante-regular.png",
    },
    {
      id: "mpd-paso3-guardado",
      descripcion: "El aviso de que el currículum se guardó correctamente",
      src: "/capturas/mpd-cv-guardado.png",
    },
  ],
  4: [
    {
      id: "mpd-paso4-vigentes",
      descripcion:
        "El bloque «Inscripciones vigentes» del Menú Principal, con los agrupamientos: Concursos, Exámenes Técnico Jurídico, Exámenes Técnico Administrativo, Exámenes Servicios Auxiliares y Otros",
      src: "/capturas/mpd-inscripciones-vigentes.png",
      // Después del tercer párrafo y no al final del paso: el cuarto es el
      // consejo de Nexo, que ya no habla del menú, y la captura ahí abajo
      // quedaba huérfana de lo que ilustra.
      trasParrafo: 3,
    },
  ],
};

/** Un paso del material viejo, con la forma de la guía nueva. */
function comoPaso(p: PasoViejo): PasoGuia {
  const puntos = p.puntos ? p.puntos.items.map((i) => `${i.titulo}. ${i.texto}`) : [];
  return {
    n: p.n,
    titulo: p.titulo,
    resumen: p.resumen,
    cuerpo: [...p.cuerpo, ...puntos, ...(p.consejo ? [p.consejo] : [])],
    // Las de arriba, más las que el material viejo trajera. Un paso sin
    // capturas devuelve la lista vacía y no renderiza nada.
    capturas: [
      ...(CAPTURAS_MPD[p.n] ?? []),
      ...p.capturas.map((c, i) => ({
        id: `mpd-paso${p.n}-extra-${i + 1}`,
        descripcion: c.alt,
        src: c.archivo,
      })),
    ],
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
  // En el MPD, el ① es la franja de estado y nada más. Lo que había acá se
  // fue por repetido, no por recortar:
  //
  //  · un párrafo que decía «la convocatoria todavía no está publicada;
  //    cuando salga son cinco días hábiles, adelantá lo que puedas», que es
  //    palabra por palabra lo que dice la franja. Y con un agravante: la
  //    franja sale de la base y cambia sola el día que abra la inscripción,
  //    este párrafo no. Iban a terminar contradiciéndose, y el escrito a mano
  //    era el que iba a quedar mintiendo.
  //  · un «Verificá siempre en el sitio oficial», que es el mismo aviso que
  //    cierra la guía en el pie.
  //  · los dos enlaces oficiales, que están completos en «De dónde sale esta
  //    guía»: éstos eran un `slice(0, 2)` de esa misma lista.
  //
  // El MPF sí llena las dos listas y su ① se sigue viendo entero: lo que
  // decide qué aparece es el material de cada organismo, no la plantilla.
  estado: {
    cuerpo: [],
    enlaces: [],
  },

  // ② Es el checklist del material viejo: qué tener antes de empezar.
  antes: {
    titulo: fuente.checklist.titulo,
    cuerpo: [fuente.checklist.bajada],
    // Plegada y no en `items`. Son cuatro requisitos con un párrafo cada uno
    // —por qué hace falta la PC con Windows, por qué el CUIL y no el DNI— y
    // desplegados ocupaban media pantalla antes del paso a paso. Así se ven
    // los cuatro titulares juntos y el porqué está a un clic, sin recortarlo.
    items: null,
    plegables: fuente.checklist.items.map((i) => ({ titulo: i.titulo, texto: i.texto })),
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

  // ⑤ y ⑥ como pasos, de la parte 2 de la guía de Nexo. Ese PDF es la fuente
  // única de las dos etapas: reemplaza a lo que el material viejo decía en
  // «usuario-para-rendir», «el-dia-del-examen» y «que-se-estudia», que
  // quedaba a medio camino y sin capturas.
  pasosIngreso: PASOS_INGRESO,
  pasosExamen: PASOS_EXAMEN,
  introIngreso: INTRO_INGRESO,
  despues: null,
  examen: null,

  // ⑦
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
