import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/** Devuelve null si el proyecto todavía no tiene Supabase configurado. */
export async function crearClienteServidor() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const almacen = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (galletas: { name: string; value: string; options: CookieOptions }[]) => {
        try {
          galletas.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el middleware refresca la sesión.
        }
      },
    },
  });
}
