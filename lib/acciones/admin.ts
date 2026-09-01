"use server";

import { revalidatePath } from "next/cache";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { esRevisor } from "@/lib/revision/datos";
import { lote, problemasDe, type Problema } from "@/lib/admin/esquema";

export type ResultadoCarga =
  | { ok: true; cargadas: number; repetidas: number; examen: string }
  | { ok: false; motivo: "sin_permiso" | "sin_clave" | "sin_examen" | "json" | "base"; detalle: string; problemas: Problema[] };

const nada = (
  motivo: "sin_permiso" | "sin_clave" | "sin_examen" | "json" | "base",
  detalle: string,
  problemas: Problema[] = [],
): ResultadoCarga => ({ ok: false, motivo, detalle, problemas });

/**
 * Carga preguntas pegando JSON.
 *
 * Tres cosas que no cambian por más que cambie el formato de entrada:
 *
 *  1. Entran con `revisada = false`. Siempre. El JSON no tiene manera de
 *     pedir lo contrario, y la política de la base no las deja leer hasta que
 *     alguien las apruebe una por una en /revisar. Una respuesta mal cargada
 *     le enseña algo falso a quien se juega un puesto de trabajo.
 *  2. Se valida entero antes de escribir nada. Si una sola pregunta está mal,
 *     no entra ninguna: media carga es peor que ninguna, porque hay que
 *     averiguar cuál es la mitad que entró.
 *  3. Vuelve a pegar el mismo JSON y no se duplica. Se comparan los
 *     enunciados que ya tiene ese examen, que es lo que pasa de verdad:
 *     pegar, ver un error, corregirlo, volver a pegar.
 */
export async function cargarPreguntas(entrada: {
  json: string;
}): Promise<ResultadoCarga> {
  if (!(await esRevisor())) return nada("sin_permiso", "Esta pantalla es sólo para revisores.");

  const admin = crearClienteAdmin();
  if (!admin) {
    return nada(
      "sin_clave",
      "Falta SUPABASE_SERVICE_ROLE_KEY. Sin ella no se puede escribir en questions: la respuesta correcta está cortada por permiso de columna.",
    );
  }

  // ---- 1. ¿es JSON? ----
  let crudo: unknown;
  try {
    crudo = JSON.parse(entrada.json);
  } catch (e) {
    return nada("json", `El texto no es JSON válido: ${e instanceof Error ? e.message : "no se pudo leer"}`);
  }

  // ---- 2. ¿tiene la forma? ----
  const parseo = lote.safeParse(crudo);
  if (!parseo.success) {
    return nada("json", "El JSON tiene la forma equivocada.", problemasDe(parseo.error));
  }
  const datos = parseo.data;

  // ---- 3. ¿a qué examen va? ----
  const { data: examenes } = await admin
    .from("exams")
    .select("id, titulo, instancia, modalidad, concursos!inner(organismo)")
    .eq("instancia", datos.instancia)
    .eq("modalidad", datos.modalidad)
    .eq("concursos.organismo", datos.organismo)
    .limit(1);

  const examen = (examenes ?? [])[0] as { id: string; titulo: string } | undefined;
  if (!examen) {
    return nada(
      "sin_examen",
      `No hay ningún examen de ${datos.organismo.toUpperCase()} · ${datos.instancia} · ${datos.modalidad}. Revisá que la instancia y la modalidad existan para ese organismo.`,
    );
  }

  // ---- 4. lo que ya está ----
  const { data: yaEstan, error: errorLeer } = await admin
    .from("questions")
    .select("enunciado, orden")
    .eq("exam_id", examen.id);
  if (errorLeer) return nada("base", `No se pudo leer lo que ya está cargado: ${errorLeer.message}`);

  const previas = (yaEstan ?? []) as { enunciado: string; orden: number }[];
  const conocidos = new Set(previas.map((p) => p.enunciado.trim()));
  let orden = previas.reduce((max, p) => Math.max(max, p.orden), 0);

  const nuevas = datos.preguntas.filter((p) => !conocidos.has(p.enunciado));
  const repetidas = datos.preguntas.length - nuevas.length;

  if (nuevas.length === 0) {
    return { ok: true, cargadas: 0, repetidas, examen: examen.titulo };
  }

  // ---- 5. adentro ----
  const filas = nuevas.map((p) => ({
    exam_id: examen.id,
    orden: ++orden,
    enunciado: p.enunciado,
    tipo: p.tipo,
    opciones: p.opciones,
    respuesta_correcta: p.respuesta,
    explicacion: p.explicacion,
    fuente_normativa: p.fuente,
    tema: p.tema,
    confianza: p.confianza,
    // No sale del JSON y no puede salir: ver el comentario de arriba.
    revisada: false,
  }));

  const { error } = await admin.from("questions").insert(filas);
  if (error) return nada("base", `La base rechazó la carga: ${error.message}`);

  revalidatePath("/revisar");
  return { ok: true, cargadas: filas.length, repetidas, examen: examen.titulo };
}
