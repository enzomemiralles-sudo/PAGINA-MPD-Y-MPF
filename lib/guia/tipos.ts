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

  /** ④ Los cuatro pasos. */
  pasos: PasoGuia[];

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
