import { palabras, esOficial, TODO, type Ambito, type Entrada, type Organismo } from "@/lib/asistente/buscar";
import { respaldo } from "@/lib/asistente/responder";
import type { Certeza } from "@/lib/asistente/responder";
import type { Fuente } from "@/content/asistente/fuentes";

/**
 * Una entrada lista para mostrar.
 *
 * Deja afuera las variantes completas —son citas textuales del chat y pesan
 * un tercio del corpus— y se queda con `claves`, las palabras sueltas que
 * hacen falta para que el filtro del catálogo encuentre «notas» cuando
 * alguien escribe «resultados».
 */
export type EntradaVista = {
  id: string;
  organismo: Organismo;
  jurisdiccion: "nacion" | "pba" | "caba" | null;
  categoria: string;
  pregunta: string;
  respuesta: string;
  nota: string | null;
  certeza: Exclude<Certeza, "sin_respuesta">;
  fuente: Fuente | null;
  donde: string | null;
  consultas: number;
  personas: number;
  atada: boolean;
  /** Cómo lo escribió la gente, en palabras sueltas. Para filtrar el catálogo. */
  claves: string;
};

export function aVista(e: Entrada): EntradaVista {
  const con = respaldo(e);
  const propias = new Set(palabras(e.pregunta));
  const claves = [...new Set([...e.variantes.flatMap(palabras), ...palabras(e.categoria)])]
    .filter((w) => !propias.has(w))
    .join(" ");

  return {
    id: e.id,
    organismo: e.organismo,
    jurisdiccion: e.ambito ?? null,
    categoria: e.categoria,
    pregunta: e.pregunta,
    respuesta: e.respuesta,
    nota: e.nota,
    certeza: con ? "respaldada" : "orientativa",
    fuente: con?.fuente ?? null,
    donde: con?.donde ?? null,
    consultas: e.consultas,
    personas: e.personas,
    atada: e.atadaALaConvocatoria,
    claves,
  };
}

export type Grupo = { categoria: string; ancla: string | null; entradas: EntradaVista[] };

/**
 * A qué sección de los accesos rápidos (A-03) lleva cada categoría.
 *
 * El mapeo es 1 a 1 con las categorías que ya trae el corpus. No se reparten
 * entradas a mano entre secciones: la categoría es dato del material, y
 * moverla sería interpretar.
 */
const ANCLAS: Record<string, string> = {
  "Temario y material de estudio": "contenidos",
  "Formato y modalidad del examen": "modalidad",
};

/**
 * Todas las preguntas ya respondidas de un organismo, agrupadas.
 *
 * Las categorías se ordenan por cuánta gente preguntó de ese tema, y las
 * preguntas dentro de cada una también. En el MPF eso sale del corpus, que
 * cuenta consultas de verdad; en el MPD, que no las trae, queda el orden en
 * que están escritas, que ya viene curado.
 *
 * Lo oficial va primero dentro de su categoría: si el documento y el chat
 * hablan del mismo tema, arriba va el que se puede verificar.
 */
export function catalogo(organismo: Organismo): Grupo[] {
  const grupos = new Map<string, EntradaVista[]>();
  const peso = new Map<string, number>();

  for (const e of TODO) {
    if (e.organismo !== organismo) continue;
    const lista = grupos.get(e.categoria) ?? [];
    lista.push(aVista(e));
    grupos.set(e.categoria, lista);
    peso.set(e.categoria, (peso.get(e.categoria) ?? 0) + e.consultas);
  }

  const orden = (a: EntradaVista, b: EntradaVista) =>
    b.consultas - a.consultas ||
    Number(b.certeza === "respaldada") - Number(a.certeza === "respaldada") ||
    a.id.localeCompare(b.id);

  return [...grupos.entries()]
    .sort((a, b) => (peso.get(b[0]) ?? 0) - (peso.get(a[0]) ?? 0) || a[0].localeCompare(b[0]))
    .map(([categoria, entradas]) => ({
      categoria,
      ancla: ANCLAS[categoria] ?? null,
      entradas: entradas.sort(orden),
    }));
}

/**
 * Las preguntas por las que conviene empezar (A-10).
 *
 * En el MPF salen de la cuenta real del corpus: cuánta gente preguntó cada
 * cosa en los grupos. En el MPD el material no trae esa cuenta, así que queda
 * el orden del catálogo, que ya viene curado y pone primero lo que tiene
 * respaldo oficial.
 *
 * Se muestran con la pregunta tal como está escrita, no con un rótulo
 * genérico: «¿Cómo es el examen?» puede querer decir cinco cosas distintas, y
 * la que está en el material dice cuál.
 */
export function masPreguntadas(organismo: Organismo, cuantas = 8): EntradaVista[] {
  return catalogo(organismo)
    .flatMap((g) => g.entradas)
    .sort((a, b) =>
      b.consultas - a.consultas ||
      Number(b.certeza === "respaldada") - Number(a.certeza === "respaldada"),
    )
    .slice(0, cuantas);
}

/** Cuántas preguntas hay respondidas, para no prometer un número inventado. */
export function cuantas(ambito: Ambito): number {
  return ambito === "ambos" ? TODO.length : TODO.filter((e) => e.organismo === ambito).length;
}

/** Cuántas de ellas tienen fuente oficial detrás. */
export function cuantasRespaldadas(organismo: Organismo): number {
  return TODO.filter((e) => e.organismo === organismo && respaldo(e) !== null).length;
}

export { esOficial };
