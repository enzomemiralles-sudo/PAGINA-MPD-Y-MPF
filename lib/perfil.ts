import { crearClienteServidor } from "@/lib/supabase/server";
import type { Marca } from "@/lib/marca/tokens";
import type { TipoPerfil } from "@/lib/marca/marcas";

export type Perfil = {
  user_id: string;
  tipo_perfil: TipoPerfil | null;
  marca: Exclude<Marca, "dual" | "neutro"> | null;
  onboarding_completado: boolean;
  fecha_aceptacion: string | null;
  anio_egreso: number | null;
  jurisdiccion: string | null;
  matriculado: boolean | null;
  area_ejercicio: string | null;
  anio_ingreso: number | null;
  como_conocio: string | null;
  trabaja_juridico: string | null;
  dni: string | null;
  telefono: string | null;
};

const COLUMNAS =
  "user_id, tipo_perfil, marca, onboarding_completado, fecha_aceptacion, anio_egreso, " +
  "jurisdiccion, matriculado, area_ejercicio, anio_ingreso, como_conocio, trabaja_juridico, dni, telefono";

/** El perfil de quien está en sesión, o null si no hay sesión o no hay fila. */
export async function traerPerfil(): Promise<Perfil | null> {
  const sb = await crearClienteServidor();
  if (!sb) return null;

  const { data: sesion } = await sb.auth.getUser();
  if (!sesion.user) return null;

  const { data } = await sb
    .from("profiles")
    .select(COLUMNAS)
    .eq("user_id", sesion.user.id)
    .maybeSingle();

  return (data as Perfil | null) ?? null;
}
