"use server";

import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Organismo } from "@/lib/tipos";

const esquema = z.object({
  email: z.string().trim().toLowerCase().email(),
  organismo: z.enum(["mpd", "mpf"]),
  consentDatos: z.literal(true),
  consentWsp: z.boolean(),
});

export type ResultadoAlerta = { ok: true } | { ok: false; motivo: "mail" | "consentimiento" | "guardar" };

export async function suscribirAlerta(entrada: {
  email: string;
  organismo: Organismo;
  consentDatos: boolean;
  consentWsp: boolean;
}): Promise<ResultadoAlerta> {
  const parseo = esquema.safeParse(entrada);
  if (!parseo.success) {
    const rompeConsentimiento = parseo.error.issues.some((i) => i.path[0] === "consentDatos");
    return { ok: false, motivo: rompeConsentimiento ? "consentimiento" : "mail" };
  }

  const sb = await crearClienteServidor();
  // Sin Supabase configurado el formulario igual valida y responde: así se
  // puede ver el flujo completo andando antes de tener la base.
  if (!sb) return { ok: true };

  const { error } = await sb.from("alertas").insert({
    email: parseo.data.email,
    organismo: parseo.data.organismo,
    consent_wsp: parseo.data.consentWsp,
  });

  // 23505 es "ya existe": para quien se suscribe dos veces el resultado es el mismo.
  if (error && error.code !== "23505") return { ok: false, motivo: "guardar" };
  return { ok: true };
}
