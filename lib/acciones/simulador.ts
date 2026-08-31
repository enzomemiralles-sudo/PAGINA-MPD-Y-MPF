"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { corregir, corregirTipeo, type Resultado } from "@/lib/simulador/puntaje";
import { compararTipeo } from "@/lib/simulador/tipeo";
import { traerExamen, traerIntento, segundosRestantes } from "@/lib/simulador/datos";

export type Comienzo =
  | { ok: true; intento: string }
  | { ok: false; motivo: "sin_sesion" | "sin_examen" | "sin_preguntas" | "error" };

/**
 * Sortea las preguntas del intento y las deja escritas antes de empezar.
 *
 * Se insertan las N filas de `attempt_answers` con respuesta en null, no a
 * medida que se contesta. Sin eso, un intento abandonado no sabría qué había
 * sorteado, y retomar sería imposible: la persona volvería a un examen
 * distinto del que dejó.
 */
export async function comenzar(examenId: string): Promise<Comienzo> {
  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, motivo: "error" };

  const { data: sesion } = await sb.auth.getUser();
  if (!sesion.user) return { ok: false, motivo: "sin_sesion" };

  const examen = await traerExamen(examenId);
  if (!examen) return { ok: false, motivo: "sin_examen" };

  // Sale de la vista pública: sólo entran las preguntas que la política deja
  // leer, o sea las revisadas de un examen publicado.
  const { data: disponibles } = await sb
    .from("questions_public")
    .select("id")
    .eq("exam_id", examenId);

  const ids = ((disponibles ?? []) as { id: string }[]).map((f) => f.id);
  if (ids.length === 0) return { ok: false, motivo: "sin_preguntas" };

  const sorteadas = mezclar(ids).slice(0, examen.cantidadPreguntas);

  const { data: intento, error } = await sb
    .from("attempts")
    .insert({ user_id: sesion.user.id, exam_id: examenId })
    .select("id")
    .single();

  if (error || !intento) return { ok: false, motivo: "error" };
  const intentoId = (intento as { id: string }).id;

  const { error: errorFilas } = await sb.from("attempt_answers").insert(
    sorteadas.map((questionId, i) => ({
      attempt_id: intentoId,
      question_id: questionId,
      orden: i + 1,
      respuesta: null,
    })),
  );

  if (errorFilas) {
    // Un intento sin preguntas es peor que ninguno: quedaría en curso para
    // siempre y el hub ofrecería retomar un examen vacío.
    await sb.from("attempts").delete().eq("id", intentoId);
    return { ok: false, motivo: "error" };
  }

  revalidatePath("/simulador");
  return { ok: true, intento: intentoId };
}

/** Fisher-Yates. Con 176 preguntas y 20 por intento, el sesgo importa. */
function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

/**
 * Guarda una respuesta. Se llama en cada cambio, con debounce del lado del
 * cliente: si se corta la luz se pierde, como mucho, la última.
 *
 * No hace falta comprobar de quién es el intento: la política de
 * `attempt_answers` sólo deja tocar las filas de intentos propios. Lo que sí
 * se comprueba es que el intento siga abierto, que RLS no puede saber.
 */
export async function guardarRespuesta(
  intentoId: string,
  preguntaId: string,
  respuesta: string | null,
  marcada: boolean,
): Promise<{ ok: boolean }> {
  const sb = await crearClienteServidor();
  if (!sb) return { ok: false };

  const { data: intento } = await sb
    .from("attempts")
    .select("estado")
    .eq("id", intentoId)
    .maybeSingle();

  if (!intento || (intento as { estado: string }).estado !== "en_curso") return { ok: false };

  const { error } = await sb
    .from("attempt_answers")
    .update({ respuesta, marcada, actualizado_en: new Date().toISOString() })
    .eq("attempt_id", intentoId)
    .eq("question_id", preguntaId);

  return { ok: !error };
}

export type Entrega =
  | { ok: true; resultado: Resultado }
  | { ok: false; motivo: "sin_intento" | "sin_clave" | "error" };

/**
 * Corrige y cierra el intento.
 *
 * Corre entera del lado del servidor y con el cliente de servicio, porque
 * `respuesta_correcta` está cortada por GRANT de columna: no la puede leer ni
 * la anon key ni la de una persona con sesión. La respuesta correcta no viaja
 * al navegador hasta que el intento está cerrado.
 *
 * La pertenencia se comprueba ANTES, con el cliente de la persona: si RLS no
 * le devuelve el intento, no es suyo y no se sigue. El cliente de servicio se
 * usa recién después, y sólo sobre las filas de ese intento.
 */
export async function entregar(intentoId: string): Promise<Entrega> {
  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, motivo: "error" };

  const intento = await traerIntento(intentoId);
  if (!intento) return { ok: false, motivo: "sin_intento" };

  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, motivo: "sin_clave" };

  const { data: correctas } = await admin
    .from("questions")
    .select("id, respuesta_correcta")
    .in("id", intento.respuestas.map((r) => r.questionId));

  const esperada = new Map(
    ((correctas ?? []) as { id: string; respuesta_correcta: string }[]).map((q) => [
      q.id,
      q.respuesta_correcta,
    ]),
  );

  const esTipeo = intento.examen.modalidad === "tipeo";

  const corregidas = intento.respuestas.map((r) => {
    const correcta = esperada.get(r.questionId);
    if (r.respuesta === null || correcta === undefined) return { ...r, correcta: null };
    return { ...r, correcta: esTipeo ? null : r.respuesta === correcta };
  });

  const resultado = esTipeo
    ? corregirTipeo(erroresDeTipeo(intento.respuestas, esperada), intento.examen.reglas)
    : corregir(
        corregidas.map((r) => ({
          correcta: r.correcta,
          tema: intento.preguntas.find((p) => p.id === r.questionId)?.tema ?? null,
        })),
        intento.examen.reglas,
      );

  await admin.from("attempt_answers").upsert(
    corregidas.map((r) => ({
      attempt_id: intentoId,
      question_id: r.questionId,
      orden: r.orden,
      respuesta: r.respuesta,
      marcada: r.marcada,
      correcta: r.correcta,
    })),
    { onConflict: "attempt_id,question_id" },
  );

  const { error } = await admin
    .from("attempts")
    .update({
      estado: segundosRestantes(intento) === 0 ? "expirado" : "finalizado",
      finalizado_en: new Date().toISOString(),
      puntaje: resultado.puntaje,
    })
    .eq("id", intentoId);

  if (error) return { ok: false, motivo: "error" };

  revalidatePath("/simulador");
  revalidatePath(`/simulador/resultado/${intentoId}`);
  return { ok: true, resultado };
}

/** En el tipeo el error no es la pregunta: son los caracteres que no coinciden. */
function erroresDeTipeo(
  respuestas: readonly { questionId: string; respuesta: string | null }[],
  esperada: ReadonlyMap<string, string>,
): number {
  return respuestas.reduce((total, r) => {
    const texto = esperada.get(r.questionId);
    if (texto === undefined) return total;
    return total + compararTipeo(texto, r.respuesta ?? "").errores;
  }, 0);
}
