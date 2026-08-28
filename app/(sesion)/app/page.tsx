import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { traerPerfil } from "@/lib/perfil";
import { ModalDatos } from "@/components/app/ModalDatos";
import { textosDe } from "@/lib/marca/marcas";

export const metadata: Metadata = { title: "Tu cuenta — Nexo Derecho × Nueva Abogacía" };
export const dynamic = "force-dynamic";

/**
 * La pestaña principal.
 *
 * No dice «bienvenido» ni repite lo que la persona acaba de elegir: al
 * terminar el perfil se entra acá directamente, y una pantalla que sólo confirma
 * lo que ya sabés es un paso de más.
 *
 * El cuerpo está vacío a propósito hasta que existan las herramientas. Simulador,
 * asistente e inscripción llegan en las tandas 4, 5 y 6, y hasta entonces poner
 * un «próximamente» sería justo lo que las reglas del proyecto prohíben. La
 * cabecera con «Mi perfil» la pone el layout del grupo (sesion).
 */
export default async function App() {
  const perfil = await traerPerfil();
  if (!perfil) redirect("/ingresar");
  if (!perfil.marca) redirect("/elegir-perfil");

  const textos = textosDe(perfil.marca);

  return (
    <main className="env app-cuerpo">
      {/* La primera vez se abre solo. Se puede cerrar y completar después. */}
      {perfil.tipo_perfil && !perfil.onboarding_completado ? (
        <ModalDatos
          tipo={perfil.tipo_perfil}
          org={textos.corto}
          legal={textos.legalGuarda}
          bajada={textos.modalBajada}
        />
      ) : null}
    </main>
  );
}
