"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";
import { MARCA_DE_PERFIL, type TipoPerfil } from "@/lib/marca/marcas";
import type { Marca } from "@/lib/marca/tokens";

export type ResultadoPerfil = { ok: true; marca: Marca } | { ok: false; error: string };

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

  // Sólo para que el primer pintado de /app salga con la piel correcta. La
  // fuente de verdad sigue siendo la fila en profiles: si la cookie miente,
  // <AplicarPiel> la corrige apenas responde el servidor.
  const galletas = await cookies();
  galletas.set("marca", marca, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });

  revalidatePath("/app");
  return { ok: true, marca };
}
