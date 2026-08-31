import { CONTRADICCIONES, RESPALDO, fuentePorId, type Fuente } from "@/content/asistente/fuentes";
import { TODO, buscar, esOficial, type Ambito, type Entrada } from "@/lib/asistente/buscar";

/** A-07. Los tres estados, que son el corazón de la pestaña. */
export type Certeza = "respaldada" | "orientativa" | "sin_respuesta";

export type Contraste = { entrada: Entrada; que: string };

export type Respuesta = {
  certeza: Certeza;
  entrada: Entrada | null;
  fuente: Fuente | null;
  /** Dónde, dentro de la fuente: «Artículo 27». */
  donde: string | null;
  /** Otras entradas que responden lo mismo, para «¿de dónde sale?» (A-09). */
  relacionadas: Entrada[];
  /** Cuando el documento y el corpus difieren, se muestran los dos (no se elige). */
  contraste: Contraste | null;
};

/** Cambia la entrada del chat por la oficial cuando las dos hablan del mismo tema. */
function promoverOficial(entrada: Entrada, ambito: Ambito): Entrada {
  const choque = CONTRADICCIONES.find((c) => c.corpus === entrada.id);
  if (!choque) return entrada;
  const oficial = TODO.find((e) => e.id === choque.oficial);
  return oficial && (ambito === "ambos" || oficial.organismo === ambito) ? oficial : entrada;
}

const SIN_RESPUESTA: Respuesta = {
  certeza: "sin_respuesta",
  entrada: null,
  fuente: null,
  donde: null,
  relacionadas: [],
  contraste: null,
};

/**
 * Qué fuente respalda una entrada, si alguna.
 *
 * Verde no es una estimación: es tener esto. Una entrada oficial lo trae
 * consigo; una del corpus, sólo si está en la tabla de respaldo, que se
 * escribió leyendo el documento.
 */
export function respaldo(entrada: Entrada): { fuente: Fuente; donde: string } | null {
  const ref = esOficial(entrada)
    ? { fuente: entrada.fuente, donde: entrada.donde }
    : RESPALDO[entrada.id];
  if (!ref) return null;
  const fuente = fuentePorId(ref.fuente);
  return fuente ? { fuente, donde: ref.donde } : null;
}

/**
 * La respuesta a una consulta, con su nivel de certeza.
 *
 * El asistente no redacta: elige una entrada y la muestra. Si ninguna llega al
 * umbral, dice que no sabe (A-08). Nunca compone una respuesta a partir de
 * varias, porque eso es exactamente donde se cuela lo inventado.
 */
export function responder(consulta: string, ambito: Ambito): Respuesta {
  const resultados = buscar(consulta, ambito);
  const mejor = resultados[0];
  if (!mejor) return SIN_RESPUESTA;

  // Si lo que mejor puntúa es la versión del chat de un tema donde el
  // documento dice otra cosa, manda el documento. La coincidencia literal
  // favorece al corpus —está escrito con las mismas palabras que usa la
  // gente— y ahí es justamente donde no hay que dejarlo ganar.
  const entrada = promoverOficial(mejor.entrada, ambito);
  const conFuente = respaldo(entrada);
  const otras = resultados.slice(1).map((r) => r.entrada);

  // ¿Este tema tiene una discrepancia registrada entre el documento y el chat?
  const choque = CONTRADICCIONES.find(
    (c) => c.oficial === entrada.id || c.corpus === entrada.id,
  );
  const otroId = choque ? (choque.oficial === entrada.id ? choque.corpus : choque.oficial) : null;
  const otroLado = otroId
    ? ([...otras, ...buscar(entrada.pregunta, ambito, 8).map((r) => r.entrada)].find(
        (e) => e.id === otroId,
      ) ?? null)
    : null;

  return {
    certeza: conFuente ? "respaldada" : "orientativa",
    entrada,
    fuente: conFuente?.fuente ?? null,
    donde: conFuente?.donde ?? null,
    relacionadas: otras.filter((e) => e.id !== otroId),
    contraste: choque && otroLado ? { entrada: otroLado, que: choque.que } : null,
  };
}
