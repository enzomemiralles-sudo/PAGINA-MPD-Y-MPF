import { CORPUS, type EntradaFaq } from "@/content/asistente/corpus.generado";
import { OFICIALES, type EntradaOficial } from "@/content/asistente/oficiales";
import { palabras } from "@/lib/asistente/texto";

export type Organismo = "mpd" | "mpf";
/** A-02: el selector es obligatorio. «ambos» es «todavía no sé», no «mezclá». */
export type Ambito = Organismo | "ambos";

export type Entrada = EntradaFaq | EntradaOficial;
export const esOficial = (e: Entrada): e is EntradaOficial => "fuente" in e;

/** Todo lo que el asistente puede llegar a decir. Nada se genera fuera de acá. */
export const TODO: Entrada[] = [...OFICIALES, ...CORPUS];

export { normalizar, palabras } from "@/lib/asistente/texto";

type Cruce = {
  /** Qué proporción de la consulta cubre la frase. */
  deLaConsulta: number;
  /** Qué proporción de la frase usa la consulta. */
  deLaFrase: number;
  /** Cuántas palabras coinciden, en crudo. */
  cuantas: number;
};

const SIN_CRUCE: Cruce = { deLaConsulta: 0, deLaFrase: 0, cuantas: 0 };

function cruzar(buscadas: Set<string>, frase: string): Cruce {
  const enFrase = new Set(palabras(frase));
  if (enFrase.size === 0) return SIN_CRUCE;
  let cuantas = 0;
  for (const p of buscadas) if (enFrase.has(p)) cuantas += 1;
  return {
    deLaConsulta: cuantas / buscadas.size,
    deLaFrase: cuantas / enFrase.size,
    cuantas,
  };
}

/**
 * Cuánto vale que una frase coincida con la consulta.
 *
 * Manda cuánto de la consulta cubre, pero cuánto de la frase se usa también
 * pesa un poco: las variantes son citas textuales del chat y algunas son
 * párrafos enteros. Sin esto, un mensaje de treinta palabras sobre otro tema
 * que de casualidad dice «sistema» valía tanto como una variante de cuatro
 * palabras que habla exactamente de eso.
 */
function valor(c: Cruce): number {
  return c.deLaConsulta * (0.75 + 0.25 * c.deLaFrase);
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

  const cruces = [cruzar(buscadas, e.pregunta), ...e.variantes.map((v) => cruzar(buscadas, v))];

  // Cuántas palabras de la consulta encontró la mejor formulación. Es el
  // control que evita la respuesta segura y equivocada: sin él, «¿cómo es el
  // sistema de evaluación?» —dos palabras que cuentan— pasaba el umbral con
  // sólo una de las dos, y contestaba con la entrada de inscripción porque
  // alguien escribió «sistema» en el chat. Una palabra suelta no es respaldo.
  const coincidencias = Math.max(...cruces.map((c) => c.cuantas));
  if (coincidencias < Math.min(2, buscadas.size)) return 0;

  // La pregunta gana los empates contra una variante: es la formulación que la
  // entrada elige para sí misma.
  const frase = Math.max(
    valor(cruces[0] ?? SIN_CRUCE),
    Math.max(0, ...cruces.slice(1).map(valor)) * 0.95,
  );

  const contexto = Math.max(
    cruzar(buscadas, e.respuesta).deLaConsulta,
    cruzar(buscadas, e.categoria).deLaConsulta,
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
