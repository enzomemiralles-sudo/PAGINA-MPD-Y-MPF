import { crearClienteServidor } from "@/lib/supabase/server";
import type { Marca } from "@/lib/marca/tokens";
import type { TipoPerfil } from "@/lib/marca/marcas";

export type Perfil = {
  user_id: string;
  tipo_perfil: TipoPerfil | null;
  marca: Exclude<Marca, "dual" | "neutro"> | null;
  onboarding_completado: boolean;
};

/** El perfil de quien está en sesión, o null si no hay sesión o no hay fila. */
export async function traerPerfil(): Promise<Perfil | null> {
  const sb = await crearClienteServidor();
  if (!sb) return null;

  const { data: sesion } = await sb.auth.getUser();
  if (!sesion.user) return null;

  const { data } = await sb
    .from("profiles")
    .select("user_id, tipo_perfil, marca, onboarding_completado")
    .eq("user_id", sesion.user.id)
    .maybeSingle();

  return (data as Perfil | null) ?? null;
}
