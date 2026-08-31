import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { traerPerfil } from "@/lib/perfil";
import { ModalDatos } from "@/components/app/ModalDatos";
import { textosDe } from "@/lib/marca/marcas";
import { herramientas } from "@/content/app";
import Link from "next/link";

export const metadata: Metadata = { title: "Tu cuenta — Nexo Derecho × Nueva Abogacía" };
export const dynamic = "force-dynamic";

/**
 * La pestaña principal.
 *
 * No dice «bienvenido» ni repite lo que la persona acaba de elegir: al
 * terminar el perfil se entra acá directamente, y una pantalla que sólo confirma
 * lo que ya sabés es un paso de más.
 *
 * El cuerpo lista las herramientas que ya existen, y sólo esas: sin esto no hay
 * forma de llegar al simulador ni al asistente salvo escribiendo la dirección
 * a mano. La de inscripción se suma cuando exista; anunciarla antes sería el
 * «próximamente» que las reglas del proyecto prohíben. La cabecera con «Mi
 * perfil» la pone el layout del grupo (sesion).
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

      <section className="app-herramientas">
        <h1>{herramientas.titulo}</h1>
        <p className="app-herramientas-bajada">{herramientas.bajada}</p>

        <div className="app-herramientas-lista">
          {herramientas.items.map((h) => (
            <Link key={h.destino} className="app-herramienta tarjeta-app" href={h.destino}>
              <span className="app-herramienta-titulo">{h.titulo}</span>
              <span className="app-herramienta-texto">{h.texto}</span>
              <span className="app-herramienta-cta">{h.cta} →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
