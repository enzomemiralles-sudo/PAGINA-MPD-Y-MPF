import type { Organismo } from "@/lib/tipos";

/**
 * La forma de una guía de inscripción.
 *
 * Es la misma para los dos organismos (I-08): el MPD y el MPF tienen que
 * sentirse la misma pantalla, no dos páginas parecidas. Por eso la estructura
 * está acá, en un tipo, y no en el JSX de cada uno: hoy sólo existe la del
 * MPD, y el día que llegue la del MPF va a entrar en este molde o no va a
 * compilar.
 */

/**
 * Un aviso dentro de un paso.
 *
 * `trampa` es la categoría importante: son las cosas que hacen perder el turno
 * y que no están escritas en ningún lado oficial —la PC con Windows, el CV que
 * se congela, que no llega comprobante—. Tienen tratamiento visual propio
 * porque son lo que más valor tiene de toda la guía.
 */
export type Aviso = {
  tono: "trampa" | "ojo" | "dato";
  titulo: string;
  texto: string;
};

/**
 * Una captura de pantalla del sistema real. Hoy no hay ninguna.
 *
 * Y no es que falte pedirlas: el sistema de inscripción del MPD es una
 * aplicación Adobe Flex que se instala en Windows, y su propio código expulsa
 * a cualquier navegador desde diciembre de 2020. Esas pantallas no están en la
 * web, así que sólo pueden salir de alguien que haga el trámite. Ver B-07.
 */
export type Captura = {
  /** Ruta dentro de /public. */
  archivo: string;
  /** Qué se ve. Obligatorio: una captura sin alt no existe para quien no ve. */
  alt: string;
  /** Qué hay que mirar en ella. */
  pie: string;
};

/**
 * Un esquema del paso, dibujado por nosotros a partir del manual.
 *
 * No es una captura y se rotula como lo que es. Sirve para lo que el texto
 * explica mal: dónde cae un campo dentro de nueve páginas de formulario, o
 * cuál es el camino de menús. Cuando lleguen las capturas reales conviven,
 * porque no dicen lo mismo: el esquema ubica, la captura muestra.
 *
 * Está hecho de marcado y no de una imagen, así que se acomoda a 375px, se
 * puede leer en voz alta y sigue los colores de la marca.
 */
export type Esquema = {
  clave: "instalar" | "registro" | "cv" | "inscribirse";
  /** Qué muestra, en una línea. */
  pie: string;
};

export type Punto = { titulo: string; texto: string };

export type Paso = {
  n: number;
  titulo: string;
  /** Una línea: qué se hace en este paso. Se lee en el índice. */
  resumen: string;
  /** Dónde se hace. «concursos.mpd.gov.ar», «la aplicación». */
  donde: string | null;
  cuerpo: string[];
  puntos: { titulo: string; items: Punto[] } | null;
  avisos: Aviso[];
  /** El consejo de Nexo, en primera persona. Va aparte del instructivo. */
  consejo: string | null;
  esquema: Esquema | null;
  capturas: Captura[];
};

export type Seccion = {
  ancla: string;
  titulo: string;
  bajada: string | null;
  cuerpo: string[];
  puntos: { titulo: string; items: Punto[] } | null;
  avisos: Aviso[];
  consejo: string | null;
};

export type Enlace = { que: string; donde: string; url: string | null };

/**
 * Un error frecuente (I-05).
 *
 * Va en la guía y no en los textos del marco porque son propios del trámite:
 * los del MPD hablan de «Mis Inscripciones» y del CV de nueve páginas, y el
 * día que exista el del MPF va a tener los suyos.
 *
 * `paso` enlaza con el paso donde está explicado en detalle, para que quien
 * llegó por acá pueda ir al procedimiento entero.
 */
export type ErrorFrecuente = {
  titulo: string;
  cuerpo: string[];
  paso: number | null;
};

export type Guia = {
  organismo: Organismo;
  sigla: string;
  nombre: string;
  /** El cargo al que se inscribe. */
  cargo: string;
  /** De dónde salió todo esto. Se muestra al pie. */
  fuente: string;
  /** Qué hay que tener antes de empezar (I-03). */
  checklist: { titulo: string; bajada: string; items: Punto[] };
  /** Lo que no se puede no saber, arriba de todo. */
  destacado: { titulo: string; cuerpo: string[] } | null;
  pasos: Paso[];
  /** Parte 2 y 3 del manual: el examen y el después. */
  secciones: Seccion[];
  /** Lo que más se pregunta cuando algo no sale (I-05). */
  errores: ErrorFrecuente[];
  /** El checklist de cierre, por momento del trámite. */
  repaso: { titulo: string; grupos: { titulo: string; items: string[] }[] };
  enlaces: Enlace[];
};

/** Las trampas de una guía, juntas. Es lo que más valor tiene. */
export function trampas(guia: Guia): { aviso: Aviso; paso: number | null; ancla: string }[] {
  const dePasos = guia.pasos.flatMap((p) =>
    p.avisos
      .filter((a) => a.tono === "trampa")
      .map((aviso) => ({ aviso, paso: p.n, ancla: `paso-${p.n}` })),
  );
  const deSecciones = guia.secciones.flatMap((s) =>
    s.avisos
      .filter((a) => a.tono === "trampa")
      .map((aviso) => ({ aviso, paso: null, ancla: s.ancla })),
  );
  return [...dePasos, ...deSecciones];
}

export type { Organismo };
