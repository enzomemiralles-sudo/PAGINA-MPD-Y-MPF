import { LogoNexo } from "@/components/marca/LogoNexo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { traerPerfil } from "@/lib/perfil";
import { AplicarPiel } from "@/components/marca/AplicarPiel";
import { Tarjeta } from "@/components/marca/Tarjeta";
import { CabeceraApp } from "@/components/app/CabeceraApp";
import { ModalDatos } from "@/components/app/ModalDatos";
import { textosDe } from "@/lib/marca/marcas";

export const metadata: Metadata = { title: "Tu cuenta — Nexo Derecho × Nueva Abogacía" };
export const dynamic = "force-dynamic";

/**
 * Etapa (b): la pantalla principal ya tematizada. El modal de datos y el
 * contenido llegan en las etapas siguientes.
 */
export default async function App() {
  const sb = await crearClienteServidor();
  if (!sb) redirect("/ingresar");

  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/ingresar");

  const perfil = await traerPerfil();
  if (!perfil?.marca) redirect("/elegir-perfil");

  const textos = textosDe(perfil.marca);

  return (
    <>
      <AplicarPiel marca={perfil.marca} superficie="clara" />

      <CabeceraApp marca={perfil.marca} />

      <main className="env app-cuerpo">
        <h1>{textos.bienvenida}</h1>
        <p style={{ marginTop: "1rem", maxWidth: "34rem", color: "var(--texto-tenue)" }}>
          Entraste como <b style={{ color: "var(--texto)" }}>{data.user.email}</b>. Esta es la
          interfaz de {textos.nombre}: los colores, la tipografía y los textos ya salen de tu
          perfil.
        </p>

        <Tarjeta className="tarjeta" style={{ marginTop: "2rem", maxWidth: "34rem" }}>
          <p style={{ color: "var(--texto-tenue)", lineHeight: 1.6 }}>
            Acá va a vivir el contenido: los simulacros, la normativa y las guías. Mientras tanto,
            tus datos los podés ver y cambiar en «Mi perfil».
          </p>
        </Tarjeta>
      </main>

      {/* La primera vez se abre solo. Se puede cerrar y completar después. */}
      {perfil.tipo_perfil && !perfil.onboarding_completado ? (
        <ModalDatos
          tipo={perfil.tipo_perfil}
          org={textos.corto}
          legal={textos.legalGuarda}
          bajada={textos.modalBajada}
        />
      ) : null}
    </>
  );
}
