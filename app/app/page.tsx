import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { Fondo } from "@/components/landing/Fondo";
import { Vidrio } from "@/components/marca/Vidrio";

export const metadata: Metadata = { title: "Tu cuenta — Nexo Derecho × Nueva Abogacía" };

// Depende de la sesión: nunca se prerenderiza. Sin esto, un build hecho sin
// las variables de Supabase la deja estática y se comporta distinto que en Vercel.
export const dynamic = "force-dynamic";

/**
 * Etapa (a): lo mínimo para comprobar que la sesión funciona de punta a punta.
 * En la etapa (b) esta ruta pasa a ser la pantalla principal tematizada, y
 * antes de llegar acá se intercala la selección de perfil.
 */
export default async function App() {
  const sb = await crearClienteServidor();
  if (!sb) redirect("/ingresar");

  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/ingresar");

  return (
    <>
      <Fondo />
      <main className="auth-pantalla">
        <Vidrio className="auth-caja">
          <h1>Estás dentro</h1>
          <p className="auth-bajada">
            Entraste como <b style={{ color: "var(--papel)" }}>{data.user.email}</b>.
          </p>
          <p className="auth-bajada" style={{ marginTop: "1rem" }}>
            Todavía no elegiste perfil: eso llega en la próxima etapa, junto con el tema de cada
            marca.
          </p>
          <form action="/auth/salir" method="post" style={{ marginTop: "1.6rem" }}>
            <button className="btn btn-s" type="submit" style={{ width: "100%" }}>
              Cerrar sesión
            </button>
          </form>
        </Vidrio>
      </main>
    </>
  );
}
