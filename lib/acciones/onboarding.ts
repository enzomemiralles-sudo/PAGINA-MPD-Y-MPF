"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";

export type DatosPerfil = Record<string, string>;
export type ResultadoDatos = { ok: true } | { ok: false; error: string };

/** Un campo vacío se guarda como null, no como cadena vacía. */
const vacioEsNulo = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

const aNumero = z.preprocess(vacioEsNulo, z.coerce.number().int().min(1950).max(2100).nullable().catch(null));
const aTexto = z.preprocess(vacioEsNulo, z.string().trim().max(120).nullable().catch(null));
const aBooleano = z.preprocess(
  (v) => (v === "si" ? true : v === "no" ? false : null),
  z.boolean().nullable(),
);
const aEnum = <T extends readonly [string, ...string[]]>(valores: T) =>
  z.preprocess(vacioEsNulo, z.enum(valores).nullable().catch(null));

const esquema = z.object({
  anio_egreso: aNumero.optional(),
  jurisdiccion: aTexto.optional(),
  matriculado: aBooleano.optional(),
  area_ejercicio: aTexto.optional(),
  anio_ingreso: aNumero.optional(),
  como_conocio: aEnum(["recomendacion", "redes", "aula", "otro"]).optional(),
  trabaja_juridico: aEnum(["no", "estudio", "juzgado", "ministerio_publico", "otro"]).optional(),
  dni: aTexto.optional(),
  telefono: aTexto.optional(),
});

/**
 * Guarda los datos del onboarding.
 *
 * Todos los campos del formulario son opcionales: se puede guardar con
 * cualquiera vacío. Lo único obligatorio es la aceptación de las condiciones,
 * y de eso se guarda también el momento exacto.
 */
export async function guardarDatos(
  datos: DatosPerfil,
  acepta: boolean,
): Promise<ResultadoDatos> {
  if (!acepta) return { ok: false, error: "Necesitamos tu aceptación para seguir." };

  const parseo = esquema.safeParse(datos);
  if (!parseo.success) return { ok: false, error: "Revisá los datos cargados." };

  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: "El ingreso todavía no está conectado." };

  const { data: sesion } = await sb.auth.getUser();
  if (!sesion.user) return { ok: false, error: "Se cerró la sesión. Volvé a ingresar." };

  // La fecha de aceptación no se pisa: vale la primera vez que aceptó.
  const { data: previo } = await sb
    .from("profiles")
    .select("fecha_aceptacion")
    .eq("user_id", sesion.user.id)
    .maybeSingle();

  const { error } = await sb
    .from("profiles")
    .update({
      ...parseo.data,
      consent_datos: true,
      fecha_aceptacion: previo?.fecha_aceptacion ?? new Date().toISOString(),
      onboarding_completado: true,
    })
    .eq("user_id", sesion.user.id);

  if (error) return { ok: false, error: "No pudimos guardar tus datos. Probá de nuevo." };

  revalidatePath("/app");
  revalidatePath("/mi-perfil");
  return { ok: true };
}
