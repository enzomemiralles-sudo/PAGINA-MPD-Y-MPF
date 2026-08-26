import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const sb = await crearClienteServidor();
  if (sb) await sb.auth.signOut();
  return NextResponse.redirect(new URL("/ingresar", request.nextUrl.origin), { status: 303 });
}
