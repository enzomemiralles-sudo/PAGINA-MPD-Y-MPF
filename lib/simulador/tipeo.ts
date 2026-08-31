/**
 * El práctico de tipeo del MPD.
 *
 * Ya no es un esbozo con supuestos: la metodología está en el **Reglamento
 * para el Ingreso de Personal al Ministerio Público de la Defensa** (texto
 * ordenado conforme Res. DGN 1124/15), artículos 25 a 29. Lo que dice, en
 * limpio, es lo que hay acá abajo.
 *
 * Lo único que sigue sin estar es el texto real del examen, que no se publica.
 * Los de material/tipeo/textos.json están escritos para esto, con el largo que
 * fija el reglamento.
 */

/**
 * Lo que dice el reglamento. No son supuestos: son artículos.
 *
 * Art. 27º — «deberán copiar un texto de ciento treinta (130) palabras,
 * respetando su formato». La unidad de error es **la palabra**, y una palabra
 * no cuenta como bien escrita si tiene errores de tipeo u ortografía, está
 * duplicada, no está en el texto original, tiene errores de acentuación, está
 * cortada o unida indebidamente, tiene errores de mayúscula o minúscula, o
 * tiene errores de formato. Cada término erróneo descuenta cinco puntos, y
 * cada palabra no escrita descuenta otros cinco: los dos se suman.
 *
 * Art. 29º — las dos instancias, teórico y tipeo, se rinden en **treinta
 * minutos en total**, no treinta cada una.
 *
 * Art. 25º — se califica de 0 a 100 y se aprueba con 60 en cada prueba.
 */
export const REGLAS_TIPEO = {
  /** Art. 27º: la unidad de error es la palabra, no el carácter. */
  unidadDeError: "palabra" as const,
  /** Art. 27º: ciento treinta palabras. */
  palabras: 130,
  /** Art. 29º: treinta minutos para el teórico y el tipeo juntos. */
  minutosDeLaSesionCompleta: 30,
  /**
   * Lo único que el simulador todavía no hace: comparar negritas, cursivas y
   * subrayados. El reglamento los cuenta como error de formato, o sea que una
   * palabra con el formato mal es una palabra mal. Falta implementarlo, y
   * hasta entonces la pantalla lo dice en vez de fingir que lo mide.
   */
  comparaFormato: false,
} as const;

export type UnidadDeError = "caracter" | "palabra";

export type ComparacionTipeo = {
  /** Errores según la unidad configurada. Es lo que multiplica el descuento. */
  errores: number;
  /** Palabras escritas sobre las del texto original, de 0 a 1. */
  avance: number;
  esperadas: number;
  escritas: number;
};

/**
 * Distancia de edición (Levenshtein) entre dos secuencias.
 *
 * No alcanza con comparar posición por posición: una palabra de más al
 * principio correría todo el resto y contaría como error cada una de las que
 * siguen, cuando en realidad hubo un solo error. La distancia de edición
 * cuenta las operaciones —agregar, borrar, cambiar—, que es exactamente lo
 * que el artículo 27º llama errores: la palabra cambiada, la duplicada, la
 * que no está en el original y la que falta escribir.
 *
 * Es genérica porque se usa igual sobre palabras y sobre caracteres.
 *
 * Va por filas y no por matriz completa: con textos de mil caracteres la
 * matriz entera son un millón de celdas y no hacen falta.
 */
function distancia<T>(a: ArrayLike<T>, b: ArrayLike<T>): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let anterior = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i += 1) {
    const actual = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      actual.push(Math.min(actual[j - 1]! + 1, anterior[j]! + 1, anterior[j - 1]! + costo));
    }
    anterior = actual;
  }

  return anterior[b.length]!;
}

/** La distancia entre dos textos, contada por caracteres. */
export function distanciaDeEdicion(a: string, b: string): number {
  return a === b ? 0 : distancia(a, b);
}

/**
 * Separa en palabras.
 *
 * No normaliza nada: el reglamento cuenta como error la acentuación, la
 * mayúscula y la puntuación pegada, así que «Nación,» y «nacion» son palabras
 * distintas de «Nación» y tienen que serlo también acá.
 */
export function palabras(texto: string): string[] {
  return texto.trim().split(/\s+/).filter(Boolean);
}

/** Recorta sólo los saltos de línea que el editor mete solo al principio y al final. */
const limpiar = (t: string) => t.replace(/^\n+|\n+$/g, "");

/**
 * Compara lo escrito contra el texto que había que copiar.
 *
 * Cuenta los dos descuentos del artículo 27º de una sola vez: la palabra mal
 * escrita y la palabra no escrita son, las dos, una operación de edición.
 */
export function compararTipeo(
  esperado: string,
  escrito: string,
  unidad: UnidadDeError = REGLAS_TIPEO.unidadDeError,
): ComparacionTipeo {
  const a = limpiar(esperado);
  const b = limpiar(escrito);
  const pa = palabras(a);
  const pb = palabras(b);

  return {
    errores: unidad === "palabra" ? distancia(pa, pb) : distanciaDeEdicion(a, b),
    avance: pa.length === 0 ? 0 : Math.min(1, pb.length / pa.length),
    esperadas: pa.length,
    escritas: pb.length,
  };
}

/**
 * Los errores cometidos hasta acá, sin contar lo que todavía no se escribió.
 *
 * Hace falta porque durante el examen la comparación contra el texto entero
 * no informa nada: quien copió un tercio y se equivocó una vez vería ochenta
 * y pico de errores, que son las palabras que le faltan. Es verdad al
 * entregar —el reglamento descuenta por cada palabra no escrita— e inútil
 * mientras se escribe.
 *
 * Se resuelve comparando contra el prefijo del original que mejor encaje. La
 * última fila de la matriz ya trae, para cada prefijo, su distancia: una sola
 * pasada da todas y alcanza con quedarse con la menor. Al terminar el texto,
 * ese mínimo es la distancia completa, así que el número no salta al final.
 */
export function erroresHastaAca(
  esperado: string,
  escrito: string,
  unidad: UnidadDeError = REGLAS_TIPEO.unidadDeError,
): number {
  const a = unidad === "palabra" ? palabras(limpiar(escrito)) : [...limpiar(escrito)];
  const b = unidad === "palabra" ? palabras(limpiar(esperado)) : [...limpiar(esperado)];
  if (a.length === 0) return 0;
  if (b.length === 0) return a.length;

  let anterior = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const actual = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      actual.push(Math.min(actual[j - 1]! + 1, anterior[j]! + 1, anterior[j - 1]! + costo));
    }
    anterior = actual;
  }
  return Math.min(...anterior);
}
