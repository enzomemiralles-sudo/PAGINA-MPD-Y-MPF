import { crearClienteServidor } from "@/lib/supabase/server";
import type { ReglasPuntaje } from "@/lib/simulador/puntaje";
import type { ClaveOrganismo, Instancia, Modalidad } from "@/content/simulador";

export type Examen = {
  id: string;
  titulo: string;
  organismo: ClaveOrganismo;
  instancia: Instancia;
  modalidad: Modalidad;
  duracionMinutos: number;
  /** Cuántas trae el intento. No es el tamaño del banco (S-09). */
  cantidadPreguntas: number;
  reglas: ReglasPuntaje;
  /**
   * Si la instancia tiene con qué armar un intento.
   *
   * Es un booleano y no un número a propósito: el número no puede llegar a la
   * interfaz ni por accidente (S-09). Acá se decide si la instancia se puede
   * rendir, nada más.
   */
  hayPreguntas: boolean;
};

export type PreguntaVisible = {
  id: string;
  enunciado: string;
  tipo: "multiple_choice" | "tipeo";
  opciones: { clave: string; texto: string }[];
  tema: string | null;
};

export type RespuestaGuardada = {
  questionId: string;
  orden: number;
  respuesta: string | null;
  marcada: boolean;
  correcta: boolean | null;
};

export type Intento = {
  id: string;
  examen: Examen;
  estado: "en_curso" | "finalizado" | "expirado";
  iniciadoEn: string;
  finalizadoEn: string | null;
  puntaje: number | null;
  respuestas: RespuestaGuardada[];
  preguntas: PreguntaVisible[];
};

const CAMPOS_EXAMEN =
  "id, titulo, instancia, modalidad, duracion_minutos, cantidad_preguntas, " +
  "puntos_correcta, puntos_incorrecta, puntos_blanco, puntaje_inicial, puntaje_minimo";

type FilaExamen = {
  id: string;
  titulo: string;
  instancia: Instancia;
  modalidad: Modalidad;
  duracion_minutos: number;
  cantidad_preguntas: number;
  puntos_correcta: number;
  puntos_incorrecta: number;
  puntos_blanco: number;
  puntaje_inicial: number;
  puntaje_minimo: number;
};

function armarExamen(fila: FilaExamen, organismo: ClaveOrganismo, hayPreguntas: boolean): Examen {
  return {
    id: fila.id,
    titulo: fila.titulo,
    organismo,
    instancia: fila.instancia,
    modalidad: fila.modalidad,
    duracionMinutos: fila.duracion_minutos,
    cantidadPreguntas: fila.cantidad_preguntas,
    reglas: {
      puntosCorrecta: fila.puntos_correcta,
      puntosIncorrecta: fila.puntos_incorrecta,
      puntosBlanco: fila.puntos_blanco,
      puntajeInicial: fila.puntaje_inicial,
      puntajeMinimo: fila.puntaje_minimo,
    },
    hayPreguntas,
  };
}

/**
 * Cuántas preguntas publicadas tiene cada examen.
 *
 * Sale de `questions_public`, o sea que ya viene filtrado por la política:
 * sólo cuenta lo que una persona podría llegar a ver. Hoy eso da cero en las
 * instancias de opción múltiple, porque las preguntas están sin revisar, y es
 * exactamente lo que tiene que dar.
 *
 * El número no sale de esta función: sale un booleano.
 */
async function conQuePracticar(
  sb: NonNullable<Awaited<ReturnType<typeof crearClienteServidor>>>,
  examenes: readonly string[],
): Promise<Set<string>> {
  if (examenes.length === 0) return new Set();
  const { data } = await sb.from("questions_public").select("exam_id").in("exam_id", examenes);
  return new Set((data ?? []).map((f) => (f as { exam_id: string }).exam_id));
}

/** Las dos instancias de un organismo, con sus reglas. */
export async function traerInstancias(organismo: ClaveOrganismo): Promise<Examen[]> {
  const sb = await crearClienteServidor();
  if (!sb) return [];

  const { data } = await sb
    .from("exams")
    .select(`${CAMPOS_EXAMEN}, concursos!inner(organismo)`)
    .eq("concursos.organismo", organismo)
    .order("instancia", { ascending: true });

  const filas = (data ?? []) as unknown as FilaExamen[];
  const conPreguntas = await conQuePracticar(sb, filas.map((f) => f.id));

  // El teórico primero: es por donde se empieza, y el enum los devuelve en ese
  // orden, pero no está de más no depender de eso.
  return filas
    .map((f) => armarExamen(f, organismo, conPreguntas.has(f.id)))
    .sort((a, b) => (a.instancia === b.instancia ? 0 : a.instancia === "teorico" ? -1 : 1));
}

export async function traerExamen(examenId: string): Promise<Examen | null> {
  const sb = await crearClienteServidor();
  if (!sb) return null;

  const { data } = await sb
    .from("exams")
    .select(`${CAMPOS_EXAMEN}, concursos!inner(organismo)`)
    .eq("id", examenId)
    .maybeSingle();

  if (!data) return null;
  const fila = data as unknown as FilaExamen & { concursos: { organismo: ClaveOrganismo } };
  const conPreguntas = await conQuePracticar(sb, [fila.id]);
  return armarExamen(fila, fila.concursos.organismo, conPreguntas.has(fila.id));
}

/**
 * El intento sin terminar, si hay uno.
 *
 * Es lo que permite retomar: si se cierra la pestaña a mitad de un examen, el
 * hub lo ofrece de vuelta en vez de hacer empezar de cero.
 */
export async function traerIntentoEnCurso(): Promise<{ id: string; examen: Examen } | null> {
  const sb = await crearClienteServidor();
  if (!sb) return null;

  const { data } = await sb
    .from("attempts")
    .select("id, exam_id")
    .eq("estado", "en_curso")
    .order("iniciado_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  const fila = data as { id: string; exam_id: string };
  const examen = await traerExamen(fila.exam_id);
  return examen ? { id: fila.id, examen } : null;
}

/** Un intento entero, con sus preguntas en el orden en que se sortearon. */
export async function traerIntento(intentoId: string): Promise<Intento | null> {
  const sb = await crearClienteServidor();
  if (!sb) return null;

  const { data: cabecera } = await sb
    .from("attempts")
    .select("id, exam_id, estado, iniciado_en, finalizado_en, puntaje")
    .eq("id", intentoId)
    .maybeSingle();

  if (!cabecera) return null;
  const c = cabecera as {
    id: string;
    exam_id: string;
    estado: Intento["estado"];
    iniciado_en: string;
    finalizado_en: string | null;
    puntaje: number | null;
  };

  const examen = await traerExamen(c.exam_id);
  if (!examen) return null;

  const { data: filas } = await sb
    .from("attempt_answers")
    .select("question_id, orden, respuesta, marcada, correcta")
    .eq("attempt_id", intentoId)
    .order("orden", { ascending: true });

  const respuestas = ((filas ?? []) as unknown as {
    question_id: string;
    orden: number;
    respuesta: string | null;
    marcada: boolean;
    correcta: boolean | null;
  }[]).map((f) => ({
    questionId: f.question_id,
    orden: f.orden,
    respuesta: f.respuesta,
    marcada: f.marcada,
    correcta: f.correcta,
  }));

  const { data: preguntas } = await sb
    .from("questions_public")
    .select("id, enunciado, tipo, opciones, tema")
    .in("id", respuestas.map((r) => r.questionId));

  const porId = new Map(
    ((preguntas ?? []) as unknown as PreguntaVisible[]).map((p) => [p.id, p]),
  );

  return {
    id: c.id,
    examen,
    estado: c.estado,
    iniciadoEn: c.iniciado_en,
    finalizadoEn: c.finalizado_en,
    puntaje: c.puntaje,
    respuestas,
    // En el orden del sorteo, que es el que fija «pregunta 7 de 20».
    preguntas: respuestas.map((r) => porId.get(r.questionId)).filter((p): p is PreguntaVisible => !!p),
  };
}

/** Los segundos que quedan, o 0 si ya se acabó. */
export function segundosRestantes(intento: Pick<Intento, "iniciadoEn" | "examen">): number {
  const fin = new Date(intento.iniciadoEn).getTime() + intento.examen.duracionMinutos * 60_000;
  return Math.max(0, Math.round((fin - Date.now()) / 1000));
}
