"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteServidor } from "@/lib/supabase/server";
import { esRevisor, traerCola, type Cola, type Filtro } from "@/lib/revision/datos";

const filtro = z.object({
  organismo: z.enum(["mpd", "mpf"]).optional(),
  confianza: z.enum(["alta", "media", "baja"]).optional(),
});

const aprobacion = z.object({
  id: z.string().uuid(),
  // La respuesta que quedó, que puede no ser la que venía marcada: corregirla
  // es justamente lo que esta pantalla existe para poder hacer.
  respuesta: z.string().trim().min(1).max(16),
  tema: z.string().trim().min(2).max(120),
  filtro,
  saltadas: z.array(z.string().uuid()).max(500),
});

const freno = z.object({
  id: z.string().uuid(),
  nota: z.string().trim().min(3).max(1000),
  filtro,
  saltadas: z.array(z.string().uuid()).max(500),
});

export type Respuesta = { ok: true; cola: Cola } | { ok: false };

/** Quién está revisando, para dejarlo escrito en la pregunta. */
async function quienRevisa(): Promise<string | null> {
  const sb = await crearClienteServidor();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user?.id ?? null;
}

/**
 * Aprueba una pregunta y devuelve la siguiente.
 *
 * Devuelve la siguiente en la misma llamada a propósito: revisar 259
 * preguntas con una recarga de página por cada una es una tarde; así es un
 * rato. La cola vuelve entera —incluidos los contadores— para que la pantalla
 * no tenga que pedirla aparte.
 */
export async function aprobar(entrada: unknown): Promise<Respuesta> {
  const parseo = aprobacion.safeParse(entrada);
  if (!parseo.success) return { ok: false };
  if (!(await esRevisor())) return { ok: false };

  const admin = crearClienteAdmin();
  if (!admin) return { ok: false };

  const { error } = await admin
    .from("questions")
    .update({
      respuesta_correcta: parseo.data.respuesta,
      tema: parseo.data.tema,
      revisada: true,
      revisada_por: await quienRevisa(),
      revisada_en: new Date().toISOString(),
      nota_revision: null,
    })
    .eq("id", parseo.data.id);

  if (error) return { ok: false };

  revalidatePath("/simulador");
  return { ok: true, cola: await traerCola(parseo.data.filtro, parseo.data.saltadas) };
}

/**
 * Deja una pregunta frenada, con el motivo escrito.
 *
 * No la borra ni la aprueba: la baja a confianza baja y guarda la nota. Una
 * pregunta con un problema real —hay al menos dos, anotadas en
 * material/preguntas/REVISAR.md— tiene que quedar registrada, no desaparecer.
 */
export async function frenar(entrada: unknown): Promise<Respuesta> {
  const parseo = freno.safeParse(entrada);
  if (!parseo.success) return { ok: false };
  if (!(await esRevisor())) return { ok: false };

  const admin = crearClienteAdmin();
  if (!admin) return { ok: false };

  const { error } = await admin
    .from("questions")
    .update({
      confianza: "baja",
      revisada: false,
      nota_revision: parseo.data.nota,
      revisada_por: await quienRevisa(),
      revisada_en: new Date().toISOString(),
    })
    .eq("id", parseo.data.id);

  if (error) return { ok: false };
  return { ok: true, cola: await traerCola(parseo.data.filtro, parseo.data.saltadas) };
}

/** La siguiente, sin tocar nada. Es lo que hace «saltar» y lo que hacen los filtros. */
export async function siguiente(entrada: {
  filtro: Filtro;
  saltadas: string[];
}): Promise<Respuesta> {
  const parseo = z
    .object({ filtro, saltadas: z.array(z.string().uuid()).max(500) })
    .safeParse(entrada);
  if (!parseo.success) return { ok: false };
  if (!(await esRevisor())) return { ok: false };
  return { ok: true, cola: await traerCola(parseo.data.filtro, parseo.data.saltadas) };
}
