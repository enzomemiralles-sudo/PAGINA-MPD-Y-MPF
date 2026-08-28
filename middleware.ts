import { NextResponse, type NextRequest } from "next/server";
import { actualizarSesion } from "@/lib/supabase/middleware";

/**
 * Rutas que se ven sin cuenta.
 *
 * La landing NO se protege a propósito: existe para que gente que todavía no
 * tiene cuenta deje su mail y le avisemos cuando salga la convocatoria del MPD.
 * Si la mandáramos al login, se apaga el motor de captación. Los legales y el
 * contacto son públicos por lo que son.
 */
const PUBLICAS = ["/", "/legales", "/contacto", "/ingresar", "/crear-perfil", "/auth"];

/** Las dos puertas de entrada: con sesión ya no tienen sentido. */
const PUERTAS = ["/ingresar", "/crear-perfil"];

/** Con sesión pero sin marca elegida, todo lleva acá. */
const ELEGIR = "/elegir-perfil";

function esPublica(pathname: string) {
  return PUBLICAS.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
}

export async function middleware(request: NextRequest) {
  const { respuesta, usuario, configurado, cliente } = await actualizarSesion(request);
  const { pathname } = request.nextUrl;

  if (esPublica(pathname)) {
    // Con sesión, el login no tiene sentido: adentro. Salvo nueva-clave, a la
    // que se llega justamente CON sesión desde el enlace del correo: rebotarla
    // dejaría a la persona sin poder cambiar la contraseña.
    if (usuario && PUERTAS.some((p) => pathname.startsWith(p)) && pathname !== "/ingresar/nueva-clave") {
      const destino = request.nextUrl.clone();
      destino.pathname = "/app";
      destino.search = "";
      return NextResponse.redirect(destino);
    }
    return respuesta;
  }

  if (!usuario) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/ingresar";
    destino.search = "";
    // Para volver a donde quería ir después de ingresar.
    if (configurado && pathname !== "/") destino.searchParams.set("volver", pathname);
    return NextResponse.redirect(destino);
  }

  // Con sesión, la marca decide a dónde puede ir. La lee de profiles: es la
  // única fuente: la cookie o el localStorage se pueden falsear.
  if (!cliente) return respuesta;

  const { data } = await cliente
    .from("profiles")
    .select("marca")
    .eq("user_id", usuario.id)
    .maybeSingle();

  const tieneMarca = !!data?.marca;

  if (!tieneMarca && pathname !== ELEGIR) {
    const destino = request.nextUrl.clone();
    destino.pathname = ELEGIR;
    destino.search = "";
    return NextResponse.redirect(destino);
  }
  if (tieneMarca && pathname === ELEGIR) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/app";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  // El corte por onboarding_completado entra en la etapa (c).
  return respuesta;
}

export const config = {
  matcher: [
    /**
     * Todo menos los archivos estáticos y las imágenes: el middleware corre en
     * cada request y no tiene por qué tocar un .woff2.
     */
    "/((?!_next/static|_next/image|favicon.ico|marca/|logos/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
