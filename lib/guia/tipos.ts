import type { Organismo } from "@/lib/tipos";

/**
 * LA FORMA DE UNA GUÍA DE INSCRIPCIÓN
 *
 * Una sola plantilla, dos archivos de contenido. La estructura ① a ⑨ vive acá,
 * en el tipo, y no en el JSX de cada organismo: el MPD y el MPF tienen que
 * sentirse la misma pantalla, no dos páginas parecidas. Lo que el material de
 * un organismo no cubra se declara `null` y esa sección no se renderiza.
 *
 * La sección ⑨, el checklist final, no está en el tipo a propósito: no es
 * contenido, se arma sola con lo que la persona fue marcando en ④ más la
 * documentación de ②.
 */

/**
 * Una advertencia.
 *
 * Componente propio y no un párrafo en negrita: son las cosas que hacen perder
 * el turno, y en un instructivo largo un párrafo en negrita se lee como
 * énfasis, no como alarma.
 */
export type Advertencia = {
  /** `alta` es «esto te deja afuera»; `media`, «esto te va a hacer perder tiempo». */
  peso: "alta" | "media";
  texto: string;
};

/**
 * Una captura de pantalla del sistema real.
 *
 * `src` en null significa que la captura todavía no existe. No es lo mismo que
 * no haber previsto el hueco: el hueco está declarado, con su id y su
 * descripción, así que en el entorno de preview se ve exactamente qué falta y
 * dónde va. En producción no se renderiza nada.
 */
export type Captura = {
  id: string;
  /** Qué se ve. Es el alt cuando la captura existe. */
  descripcion: string;
  src: string | null;
  /**
   * A dónde lleva la captura, cuando muestra una pantalla a la que se puede
   * ir. Es para las que son la puerta de entrada de un paso —la del portal
   * del MPD, por ejemplo—: verla y no poder tocarla obliga a copiar la
   * dirección a mano del texto de al lado.
   *
   * Opcional: la mayoría son capturas de la aplicación instalada, que no
   * tiene URL, y ahí un enlace prometería algo que no existe.
   */
  url?: string;
  /**
   * Después de qué párrafo del paso va, contando desde 1.
   *
   * Sin esto, todas las capturas caen juntas al final de la explicación, que
   * es el orden por defecto de la plantilla. Sirve mientras las capturas de
   * un paso ilustren la explicación entera; deja de servir cuando una muestra
   * lo que dice un párrafo puntual y el paso sigue hablando de otra cosa
   * después —ahí la captura queda lejos de lo que ilustra—.
   *
   * Un número más grande que la cantidad de párrafos la deja al final, igual
   * que si no se declarara.
   */
  trasParrafo?: number;
};

/** Un video. `youtubeId` en null es un hueco declarado, igual que la captura. */
export type Video = {
  id: string;
  titulo: string;
  youtubeId: string | null;
};

export type Enlace = { texto: string; url: string };

/**
 * Un paso del ④.
 *
 * El orden de composición es fijo y lo impone la plantilla, no el contenido:
 * explicación → captura → video → advertencia. Un paso que arme su propio
 * orden rompe el ritmo de la guía.
 */
export type PasoGuia = {
  n: number;
  titulo: string;
  /** Una línea: qué se hace acá. Se lee en el índice y en el checklist. */
  resumen: string;
  cuerpo: string[];
  capturas: Captura[];
  videos: Video[];
  advertencias: Advertencia[];
  enlace: Enlace | null;
};

/** Una sección de texto: ②, ⑤, ⑥ o ⑦. */
export type SeccionTexto = {
  titulo: string;
  cuerpo: string[];
  /** Lista con viñetas, si el contenido la pide. */
  items: string[] | null;
  /**
   * Lo mismo que `items`, pero con el titular y su explicación separados para
   * poder plegarla: se ve la lista de titulares y cada uno se abre al tocarlo.
   *
   * Es para las listas donde cada punto trae un párrafo detrás —«Antes de
   * empezar necesitás tener», del MPD, son cuatro requisitos con su porqué—:
   * desplegadas ocupan media pantalla y tapan el paso a paso, que es a donde
   * la persona va.
   *
   * Cuando está, la sección la muestra en lugar de `items`. Opcional para no
   * obligar a las secciones que no la necesitan (las del MPF pasan `items`
   * en null y no cambian).
   */
  plegables?: { titulo: string; texto: string }[];
  advertencias: Advertencia[];
  enlaces: Enlace[];
};

export type Pregunta = { pregunta: string; respuesta: string };

export type Guia = {
  organismo: Organismo;
  sigla: string;
  nombre: string;
  cargo: string;

  /** ① El texto propio del organismo. El estado vivo sale de `concursos`. */
  estado: { cuerpo: string[]; enlaces: Enlace[] };

  /** ② Qué hay que tener listo. Sus `documentacion` alimentan el ⑨. */
  antes: (SeccionTexto & { documentacion: string[] }) | null;

  /** ③ Sólo advertencias: es la sección que existe para eso. */
  saber: Advertencia[];

  /** ④ Los cuatro pasos de la inscripción. Alimentan el ⑨. */
  pasos: PasoGuia[];

  /**
   * ⑤ y ⑥ en versión paso a paso: entrar a la plataforma del examen, y
   * rendirlo.
   *
   * Un organismo cubre cada etapa de una de las dos formas, nunca de las dos:
   * con estos pasos, o con la sección de texto de abajo. La página muestra el
   * acordeón cuando la lista tiene algo y la sección de texto cuando no, así
   * que llenar las dos dejaría una etapa escrita dos veces.
   *
   * El MPD las trae como pasos, de la parte 2 de la guía de Nexo. El MPF
   * todavía las tiene como texto corrido y pasa las listas vacías.
   */
  pasosIngreso: PasoGuia[];
  pasosExamen: PasoGuia[];
  /** La bajada del ⑤ cuando va como pasos: el acordeón no tiene `cuerpo`. */
  introIngreso: string[];

  /** ⑤ a ⑦. `null` cuando el material del organismo no lo cubre. */
  despues: SeccionTexto | null;
  examen: SeccionTexto | null;
  resultados: SeccionTexto | null;

  /** ⑧ Entre 8 y 12. */
  preguntas: Pregunta[];

  /** De dónde salió, para el pie. */
  fuentes: Enlace[];
};

/** Todas las capturas de una guía, para saber qué material falta producir. */
export function capturasDe(guia: Guia): Captura[] {
  return guia.pasos.flatMap((p) => p.capturas);
}

/** Todos los videos de una guía. */
export function videosDe(guia: Guia): Video[] {
  return guia.pasos.flatMap((p) => p.videos);
}

export type { Organismo };
