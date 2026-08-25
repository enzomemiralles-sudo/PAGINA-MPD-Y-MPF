import { createClient } from "@supabase/supabase-js";

/**
 * Service role. Solo desde el servidor: lee respuesta_correcta y explicacion,
 * que nunca salen al cliente antes de finalizar un intento.
 */
export function crearClienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
