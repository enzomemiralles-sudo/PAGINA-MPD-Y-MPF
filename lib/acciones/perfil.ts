"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";
import { MARCA_DE_PERFIL, type TipoPerfil } from "@/lib/marca/marcas";

export type ResultadoPerfil = { ok: true; marca: "nexo" | "na" } | { ok: false; error: string };

const esquema = z.enum(["abogado", "estudiante", "otro"]);

/**
 * Guarda el perfil elegido y la marca que le corresponde.
 *
 * La marca se deriva del perfil pero se guarda aparte, para poder cambiarla
 * después sin tocar el tipo de perfil.
 */
export async function elegirPerfil(tipo: TipoPerfil): Promise<ResultadoPerfil> {
  const parseo = esquema.safeParse(tipo);
  if (!parseo.success) return { ok: false, error: "Perfil no válido." };

  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: "El ingreso todavía no está conectado." };

  const { data: sesion } = await sb.auth.getUser();
  if (!sesion.user) return { ok: false, error: "Se cerró la sesión. Volvé a ingresar." };

  const marca = MARCA_DE_PERFIL[parseo.data];

  const { error } = await sb
    .from("profiles")
    .upsert({ user_id: sesion.user.id, tipo_perfil: parseo.data, marca }, { onConflict: "user_id" });

  if (error) return { ok: false, error: "No pudimos guardar tu perfil. Probá de nuevo." };

  revalidatePath("/app");
  return { ok: true, marca };
}
