import { crearClienteAdmin } from "@/lib/supabase/admin";
import { traerPerfil } from "@/lib/perfil";
import type { Organismo } from "@/lib/tipos";

export type Filtro = {
  organismo?: Organismo;
  confianza?: "alta" | "media" | "baja";
};

export type PreguntaARevisar = {
  id: string;
  organismo: Organismo;
  orden: number;
  enunciado: string;
  tipo: "multiple_choice" | "tipeo";
  opciones: { clave: string; texto: string }[];
  respuestaCorrecta: string;
  fuente: string | null;
  tema: string | null;
  confianza: "alta" | "media" | "baja";
  notaRevision: string | null;
};

export type Cola = {
  pregunta: PreguntaARevisar | null;
  pendientes: number;
  revisadas: number;
};

const VACIA: Cola = { pregunta: null, pendientes: 0, revisadas: 0 };

/**
 * Comprueba que quien pide sea revisor.
 *
 * Se hace con el cliente de la persona, no con el de servicio: la fila de
 * `profiles` la devuelve RLS sólo a su dueño, así que si vuelve un rol, es el
 * suyo. Recién después se usa el cliente de servicio, que no pregunta nada.
 *
 * Todo lo de este archivo y el de acciones pasa por acá primero. Sin eso,
 * cualquiera con una cuenta podría leer las respuestas correctas.
 */
export async function esRevisor(): Promise<boolean> {
  const perfil = await traerPerfil();
  return perfil?.rol === "revisor";
}

type Fila = {
  id: string;
  orden: number;
  enunciado: string;
  tipo: PreguntaARevisar["tipo"];
  opciones: { clave: string; texto: string }[] | null;
  respuesta_correcta: string;
  fuente_normativa: string | null;
  tema: string | null;
  confianza: PreguntaARevisar["confianza"];
  nota_revision: string | null;
  exams: { concursos: { organismo: Organismo } };
};

const CAMPOS =
  "id, orden, enunciado, tipo, opciones, respuesta_correcta, fuente_normativa, " +
  "tema, confianza, nota_revision, exams!inner(concursos!inner(organismo))";

function armar(f: Fila): PreguntaARevisar {
  return {
    id: f.id,
    organismo: f.exams.concursos.organismo,
    orden: f.orden,
    enunciado: f.enunciado,
    tipo: f.tipo,
    opciones: f.opciones ?? [],
    respuestaCorrecta: f.respuesta_correcta,
    fuente: f.fuente_normativa,
    tema: f.tema,
    confianza: f.confianza,
    notaRevision: f.nota_revision,
  };
}

/**
 * La próxima sin revisar, más cuánto falta.
 *
 * Devuelve de a una y no una lista: revisar es una decisión por pregunta, y
 * una lista de 259 en pantalla invita a aprobar de a lotes sin leer, que es
 * exactamente lo que la regla quiere evitar.
 *
 * `saltadas` son las que se dejaron para después en esta sesión. No se
 * guardan en la base: saltar no es un estado, es «ahora no».
 */
export async function traerCola(
  filtro: Filtro = {},
  saltadas: readonly string[] = [],
): Promise<Cola> {
  if (!(await esRevisor())) return VACIA;

  const admin = crearClienteAdmin();
  if (!admin) return VACIA;

  const contar = async (revisada: boolean) => {
    let q = admin
      .from("questions")
      .select(CAMPOS, { count: "exact", head: true })
      .eq("revisada", revisada);
    if (filtro.organismo) q = q.eq("exams.concursos.organismo", filtro.organismo);
    if (filtro.confianza) q = q.eq("confianza", filtro.confianza);
    const { count } = await q;
    return count ?? 0;
  };

  const [pendientes, revisadas] = await Promise.all([contar(false), contar(true)]);

  let q = admin.from("questions").select(CAMPOS).eq("revisada", false);
  if (filtro.organismo) q = q.eq("exams.concursos.organismo", filtro.organismo);
  if (filtro.confianza) q = q.eq("confianza", filtro.confianza);
  // Las saltadas de esta sesión se corren al final de la cola, no se pierden.
  if (saltadas.length > 0) q = q.not("id", "in", `(${saltadas.join(",")})`);

  const { data } = await q.order("orden", { ascending: true }).limit(1);
  const fila = ((data ?? []) as unknown as Fila[])[0];

  return { pregunta: fila ? armar(fila) : null, pendientes, revisadas };
}
