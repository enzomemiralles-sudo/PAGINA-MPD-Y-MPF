import { cache } from "react";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Marca } from "@/lib/marca/tokens";
import type { TipoPerfil } from "@/lib/marca/marcas";

export type Perfil = {
  user_id: string;
  /**
   * Para saludar por el nombre en la home de la puerta.
   *
   * Es nullable, y hoy es null SIEMPRE: la migración 0003 le sacó el `not
   * null` porque la fila se crea al registrarse, antes de que la persona haya
   * dicho cómo se llama, y ninguna pantalla lo pide todavía. El tipo decía
   * `string` y el `as Perfil` de abajo tapaba la diferencia, así que la home
   * saludaba «Hola, null.». Declarado como es, el compilador obliga a
   * contemplar el caso en cada lugar donde se usa.
   */
  nombre: string | null;
  /** «revisor» habilita /revisar. Se otorga a mano en la base, nunca desde acá. */
  rol: "persona" | "revisor";
  tipo_perfil: TipoPerfil | null;
  /** La piel. `neutro` es de quien eligió «otro perfil»: no es de ninguna
   *  de las dos agrupaciones y no lleva sus colores. */
  marca: Exclude<Marca, "dual"> | null;
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
  "user_id, nombre, rol, tipo_perfil, marca, onboarding_completado, fecha_aceptacion, anio_egreso, " +
  "jurisdiccion, matriculado, area_ejercicio, anio_ingreso, como_conocio, trabaja_juridico, dni, telefono";

/**
 * El perfil de quien está en sesión, o null si no hay sesión o no hay fila.
 *
 * Va envuelto en `cache` porque desde que la cabecera vive en el layout hay
 * dos llamadas por request —el layout necesita la marca, la página necesita el
 * resto— y sin esto serían dos consultas idénticas a la base.
 */
export const traerPerfil = cache(async function traerPerfil(): Promise<Perfil | null> {
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
});
