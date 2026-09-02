import { crearClienteServidor } from "@/lib/supabase/server";
import { segundosRestantes, traerExamen, type Examen } from "@/lib/simulador/datos";
import { porTema, type DesempenoTema } from "@/lib/simulador/puntaje";

/**
 * Lo que la home de cada puerta necesita saber de esta persona.
 *
 * Es el bloque de retención del preview: el saludo, «retomar donde quedaste» y
 * las barras de progreso por tema. No es decoración — es lo que hace que
 * alguien vuelva — así que sale de datos reales y nunca se rellena. Si no hay
 * intentos, la home invita a empezar el primero en lugar de esconder el bloque
 * y quedar como un menú suelto.
 */

export type Retomar = {
  intentoId: string;
  examen: Examen;
  respondidas: number;
  total: number;
  segundos: number;
};

export type EstadoHome = {
  /** El intento a medio hacer, si lo hay. */
  retomar: Retomar | null;
  /** Cómo le fue por tema en lo que ya rindió. Vacío si todavía no rindió. */
  temas: DesempenoTema[];
  /** Cuántos exámenes terminó. Decide si la home saluda o invita a empezar. */
  terminados: number;
};

const VACIO: EstadoHome = { retomar: null, temas: [], terminados: 0 };

export async function traerEstadoHome(): Promise<EstadoHome> {
  const sb = await crearClienteServidor();
  if (!sb) return VACIO;

  // RLS ya limita las filas a las de esta persona: no hace falta filtrar por
  // usuario acá, y filtrarlo a mano daría una falsa sensación de seguridad.
  const { data: filas } = await sb
    .from("attempts")
    .select("id, exam_id, estado, iniciado_en")
    .order("iniciado_en", { ascending: false })
    .limit(30);

  const intentos = (filas ?? []) as {
    id: string;
    exam_id: string;
    estado: "en_curso" | "finalizado" | "expirado";
    iniciado_en: string;
  }[];
  if (intentos.length === 0) return VACIO;

  const terminados = intentos.filter((i) => i.estado !== "en_curso").length;

  // ---- el que quedó a medias ----
  let retomar: Retomar | null = null;
  const enCurso = intentos.find((i) => i.estado === "en_curso");
  if (enCurso) {
    const examen = await traerExamen(enCurso.exam_id);
    if (examen) {
      const { data: resp } = await sb
        .from("attempt_answers")
        .select("respuesta")
        .eq("attempt_id", enCurso.id);
      const todas = (resp ?? []) as { respuesta: string | null }[];
      retomar = {
        intentoId: enCurso.id,
        examen,
        respondidas: todas.filter((r) => r.respuesta !== null).length,
        total: todas.length,
        segundos: segundosRestantes({ iniciadoEn: enCurso.iniciado_en, examen }),
      };
    }
  }

  // ---- cómo le fue por tema ----
  // Sólo de lo ya corregido: durante un intento en curso `correcta` es null,
  // porque la respuesta correcta no viaja al cliente hasta que se entrega.
  const cerrados = intentos.filter((i) => i.estado !== "en_curso").map((i) => i.id);
  let temas: DesempenoTema[] = [];
  if (cerrados.length > 0) {
    const { data: respuestas } = await sb
      .from("attempt_answers")
      .select("question_id, correcta")
      .in("attempt_id", cerrados)
      .not("correcta", "is", null);

    const corregidas = (respuestas ?? []) as { question_id: string; correcta: boolean }[];
    if (corregidas.length > 0) {
      const { data: preguntas } = await sb
        .from("questions_public")
        .select("id, tema")
        .in("id", [...new Set(corregidas.map((r) => r.question_id))]);

      const temaDe = new Map(
        ((preguntas ?? []) as { id: string; tema: string | null }[]).map((p) => [p.id, p.tema]),
      );
      temas = porTema(
        corregidas.map((r) => ({ correcta: r.correcta, tema: temaDe.get(r.question_id) ?? null })),
      );
    }
  }

  return { retomar, temas, terminados };
}
