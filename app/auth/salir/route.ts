import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const sb = await crearClienteServidor();
  if (sb) await sb.auth.signOut();

  const respuesta = NextResponse.redirect(new URL("/ingresar", request.nextUrl.origin), {
    status: 303,
  });
  // La piel se va con la sesión: si no, el próximo ingreso arrancaría pintado
  // con la marca de quien se fue.
  respuesta.cookies.delete("marca");
  return respuesta;
}
