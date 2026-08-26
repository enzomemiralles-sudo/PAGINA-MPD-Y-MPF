import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión en cada request y devuelve el usuario.
 *
 * Sin esto la cookie se vence y la persona se cae sola de la sesión mientras
 * navega. La respuesta que devuelve es la que hay que retornar del middleware:
 * lleva las cookies actualizadas.
 */
export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sin Supabase configurado no hay sesión posible. El sitio público sigue
  // andando; lo protegido lo resuelve el middleware.
  if (!url || !key) return { respuesta, usuario: null, configurado: false as const };

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (galletas: { name: string; value: string; options: CookieOptions }[]) => {
        galletas.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        galletas.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  // getUser, no getSession: getUser valida el token contra Supabase.
  const { data } = await supabase.auth.getUser();
  return { respuesta, usuario: data.user, configurado: true as const };
}
