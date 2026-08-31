import { CORPUS, type EntradaFaq } from "@/content/asistente/corpus.generado";
import { OFICIALES, type EntradaOficial } from "@/content/asistente/oficiales";

export type Organismo = "mpd" | "mpf";
/** A-02: el selector es obligatorio. «ambos» es «todavía no sé», no «mezclá». */
export type Ambito = Organismo | "ambos";

export type Entrada = EntradaFaq | EntradaOficial;
export const esOficial = (e: Entrada): e is EntradaOficial => "fuente" in e;

/** Todo lo que el asistente puede llegar a decir. Nada se genera fuera de acá. */
export const TODO: Entrada[] = [...OFICIALES, ...CORPUS];

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

/** Qué proporción de la consulta cubre una frase suelta. */
function cobertura(buscadas: Set<string>, frase: string): number {
  const enFrase = new Set(palabras(frase));
  let encontradas = 0;
  for (const p of buscadas) if (enFrase.has(p)) encontradas += 1;
  return encontradas / buscadas.size;
}

/**
 * Cuánto se parece una consulta a una entrada.
 *
 * Se compara contra cada formulación por separado —la pregunta, y cada una de
 * las formas en que alguien lo preguntó de verdad en el chat— y gana la mejor.
 * Juntarlas todas en una bolsa de palabras haría que una entrada gane armando
 * la consulta con pedazos de frases que hablan de otra cosa: «¿cuánto dura el
 * examen?» le ganaría a la entrada que tiene esa pregunta exacta anotada,
 * porque otra dice «examen» en su título y «dura» en una variante sobre la
 * vigencia de la lista.
 *
 * El cuerpo de la respuesta y la categoría cuentan aparte y pesan poco: sirven
 * para desempatar, no para que una entrada que menciona la palabra al pasar se
 * presente como si respondiera la pregunta.
 */
export function puntaje(consulta: string, e: Entrada): number {
  const buscadas = new Set(palabras(consulta));
  if (buscadas.size === 0) return 0;

  const porPregunta = cobertura(buscadas, e.pregunta);
  const porVariante = Math.max(0, ...e.variantes.map((v) => cobertura(buscadas, v)));
  // La pregunta gana los empates contra una variante: es la formulación que la
  // entrada elige para sí misma.
  const frase = Math.max(porPregunta, porVariante * 0.95);

  const contexto = Math.max(
    cobertura(buscadas, e.respuesta),
    cobertura(buscadas, e.categoria),
  );

  // Lo oficial gana los empates: si el documento y la memoria del chat dicen
  // lo mismo, se muestra el que se puede verificar.
  return (frase * 0.8 + contexto * 0.2) * (esOficial(e) ? 1.15 : 1);
}

/** Debajo de esto no hay respuesta: se contesta que no se sabe (A-08). */
export const UMBRAL = 0.34;

export type Resultado = { entrada: Entrada; puntaje: number };

/**
 * Busca en el corpus del ámbito elegido.
 *
 * El filtro por organismo es duro y va primero: mezclar el MPD con el MPF es
 * el peor error posible acá (A-02), así que una entrada del otro concurso no
 * compite ni aunque sea la que mejor puntúa.
 */
export function buscar(consulta: string, ambito: Ambito, cuantas = 5): Resultado[] {
  const universo = ambito === "ambos" ? TODO : TODO.filter((e) => e.organismo === ambito);
  return universo
    .map((entrada) => ({ entrada, puntaje: puntaje(consulta, entrada) }))
    .filter((r) => r.puntaje >= UMBRAL)
    // El desempate es explícito a propósito: si el orden dependiera de cómo
    // quedaron las entradas en el archivo, agregar una entrada nueva cambiaría
    // en silencio la respuesta a preguntas que no tienen nada que ver.
    .sort((a, b) =>
      b.puntaje - a.puntaje ||
      Number(esOficial(b.entrada)) - Number(esOficial(a.entrada)) ||
      a.entrada.id.localeCompare(b.entrada.id),
    )
    .slice(0, cuantas);
}
