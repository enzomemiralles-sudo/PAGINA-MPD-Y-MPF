import type { Metadata } from "next";
import { PantallaAuth } from "@/components/auth/PantallaAuth";
import { FormularioNuevaClave } from "@/components/auth/FormularioNuevaClave";
import { crearClienteServidor } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nueva contraseña — Nexo Derecho × Nueva Abogacía" };

// Depende de la sesión: nunca se prerenderiza. Sin esto, un build hecho sin
// las variables de Supabase la deja estática y se comporta distinto que en Vercel.
export const dynamic = "force-dynamic";

/**
 * Se llega acá desde el enlace del correo, ya con sesión abierta por el
 * callback. Sin sesión, el enlace venció.
 */
export default async function NuevaClave() {
  const sb = await crearClienteServidor();
  const { data } = sb ? await sb.auth.getUser() : { data: { user: null } };

  return (
    <PantallaAuth>
      <FormularioNuevaClave haySesion={!!data.user} />
    </PantallaAuth>
  );
}
