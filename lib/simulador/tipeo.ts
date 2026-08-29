/**
 * El práctico de tipeo del MPD: copiar un texto respetando acentuación,
 * puntuación, mayúsculas, tabulaciones y espacios.
 *
 * TODO ESTO ES PARAMETRIZABLE A PROPÓSITO. La metodología oficial completa no
 * la tenemos todavía —ver PLAN-SIMULADOR.md §6—, así que lo que falta está
 * escrito como supuesto, en un solo lugar, y se cambia sin tocar el resto.
 */

/**
 * SUPUESTOS — sin confirmar. Ver PLAN-SIMULADOR.md §6.
 *
 * Lo que sí está confirmado por el instructivo de la DGN y por la captura del
 * examen real vive en la fila de `exams`: se parte de 100, cada error resta 5,
 * se aprueba con 60. O sea, doce errores y afuera.
 */
export const SUPUESTOS_TIPEO = {
  /**
   * Qué cuenta como un error. «caracter» es el criterio más duro de los
   * posibles: si el real resulta ser por palabra, el simulador exige de más y
   * no de menos, que es el lado seguro para equivocarse.
   */
  unidadDeError: "caracter" as "caracter" | "palabra",
  /** Cuánto texto trae el ejercicio. El real no lo sabemos. */
  caracteresAproximados: 900,
  /** Si los 30 minutos son de toda la sesión o sólo del teórico, no consta. */
  minutosCompartidosConElTeorico: true,
  /**
   * El formato (negrita, cursiva, subrayado) se pide en el examen real. Acá
   * todavía se compara sólo el texto: comparar formato necesita saber si una
   * negrita que falta es un error o son tantos errores como caracteres tenga.
   */
  comparaFormato: false,
} as const;

export type ComparacionTipeo = {
  /** Errores según la unidad configurada. Es lo que multiplica el descuento. */
  errores: number;
  /** Caracteres escritos sobre los del texto original, de 0 a 1. */
  avance: number;
  esperados: number;
  escritos: number;
};

/**
 * Distancia de edición (Levenshtein) entre dos textos.
 *
 * No alcanza con comparar posición por posición: un carácter de más al
 * principio correría todo el resto y contaría como error cada letra que
 * sigue, cuando en realidad hubo un solo error. La distancia de edición
 * cuenta las operaciones —agregar, borrar, cambiar—, que es lo que una
 * persona sensata llamaría «errores».
 *
 * Va por filas y no por matriz completa: con textos de mil caracteres la
 * matriz entera son un millón de celdas y no hacen falta.
 */
export function distanciaDeEdicion(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const anterior = new Array<number>(b.length + 1);
  const actual = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) anterior[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    actual[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      actual[j] = Math.min(actual[j - 1] + 1, anterior[j] + 1, anterior[j - 1] + costo);
    }
    for (let j = 0; j <= b.length; j += 1) anterior[j] = actual[j];
  }

  return anterior[b.length];
}

/** Separa en palabras conservando la puntuación pegada, que también se evalúa. */
function palabras(texto: string): string[] {
  return texto.split(/\s+/).filter(Boolean);
}

/**
 * Compara lo escrito contra el texto que había que copiar.
 *
 * No normaliza nada: el examen evalúa acentuación, puntuación, mayúsculas,
 * minúsculas, tabulaciones y espacios. Lo único que se recorta son los saltos
 * de línea sobrantes del principio y del final, que es donde el editor mete
 * cosas solo. La marginación no cuenta, y la marginación es justamente lo que
 * no está en el texto.
 */
export function compararTipeo(
  esperado: string,
  escrito: string,
  unidad: "caracter" | "palabra" = SUPUESTOS_TIPEO.unidadDeError,
): ComparacionTipeo {
  const a = esperado.replace(/^\n+|\n+$/g, "");
  const b = escrito.replace(/^\n+|\n+$/g, "");

  const errores =
    unidad === "palabra"
      ? distanciaDeEdicionDe(palabras(a), palabras(b))
      : distanciaDeEdicion(a, b);

  return {
    errores,
    avance: a.length === 0 ? 0 : Math.min(1, b.length / a.length),
    esperados: a.length,
    escritos: b.length,
  };
}

/** La misma distancia, sobre listas de palabras en vez de caracteres. */
function distanciaDeEdicionDe(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const anterior = new Array<number>(b.length + 1);
  const actual = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) anterior[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    actual[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      actual[j] = Math.min(actual[j - 1] + 1, anterior[j] + 1, anterior[j - 1] + costo);
    }
    for (let j = 0; j <= b.length; j += 1) anterior[j] = actual[j];
  }

  return anterior[b.length];
}
