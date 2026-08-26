import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";

/**
 * Vuelta de Google y de los enlaces que mandamos por correo (confirmación de
 * cuenta y recuperación de contraseña). Cambia el código por una sesión y
 * manda a donde corresponda.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const destino = searchParams.get("destino") ?? "/app";
  const errorDelProveedor = searchParams.get("error_description") ?? searchParams.get("error");

  if (errorDelProveedor) {
    const url = new URL("/ingresar", origin);
    url.searchParams.set("error", "google");
    return NextResponse.redirect(url);
  }

  if (!code) return NextResponse.redirect(new URL("/ingresar", origin));

  const sb = await crearClienteServidor();
  if (!sb) return NextResponse.redirect(new URL("/ingresar", origin));

  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) {
    const url = new URL("/ingresar", origin);
    url.searchParams.set("error", "enlace");
    return NextResponse.redirect(url);
  }

  // Sólo destinos internos: un redirect abierto acá sería un regalo para phishing.
  const seguro = destino.startsWith("/") && !destino.startsWith("//") ? destino : "/app";
  return NextResponse.redirect(new URL(seguro, origin));
}
