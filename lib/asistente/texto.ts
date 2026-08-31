/**
 * Cómo se parten y se comparan los textos. Sin corpus adentro a propósito:
 * el buscador del catálogo corre en el navegador y no puede arrastrar las
 * 115 entradas para poder sacarle los acentos a una palabra.
 */

/**
 * Palabras que no distinguen una pregunta de otra.
 *
 * Sin esto «¿cuántas preguntas tiene el examen?» y «¿qué documentación
 * necesito para el examen?» se parecen demasiado: comparten «el» y «examen»
 * y el ruido tapa la señal.
 */
const VACIAS = new Set(
  ("a al algo alguien algun alguna algunas alguno algunos ante antes como con contra cual cuales " +
   "cuando cuanta cuantas cuanto cuantos de del desde donde dos e el ella ellas ellos en entre era " +
   "es esa esas ese eso esos esta estan estas este esto estos ha hace hacer hacia hasta hay la las " +
   "le les lo los mas me mi mis mucho muy ni no nos o otra otras otro otros para pero poco por " +
   "porque que quien quienes se ser si sin sobre son su sus tambien tanto te tener tiene tienen " +
   "todo todos tu tus un una unas uno unos y ya yo").split(" "),
);

/** Sin acentos, sin puntuación, en minúsculas: «¿Cuántas?» y «cuantas» son lo mismo. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function palabras(texto: string): string[] {
  return normalizar(texto).split(" ").filter((p) => p.length > 2 && !VACIAS.has(p));
}
