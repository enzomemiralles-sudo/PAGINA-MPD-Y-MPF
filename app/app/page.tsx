import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { crearClienteServidor } from "@/lib/supabase/server";
import { traerPerfil } from "@/lib/perfil";
import { AplicarPiel } from "@/components/marca/AplicarPiel";
import { Tarjeta } from "@/components/marca/Tarjeta";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import { configDe, textosDe } from "@/lib/marca/marcas";

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

  const cfg = configDe(perfil.marca);
  const textos = textosDe(perfil.marca);

  return (
    <>
      <AplicarPiel marca={perfil.marca} superficie="clara" />

      <header className="app-cabecera">
        <div className="env app-nav">
          <div className="app-marca">
            {perfil.marca === "nexo" && cfg ? (
              <Image src={cfg.logo} alt={cfg.nombre} width={560} height={137} priority />
            ) : (
              <>
                <LogoNuevaAbogacia conCartel={false} />
                <span className="nombre">{cfg?.nombre}</span>
              </>
            )}
          </div>
          <div className="app-acciones">
            <form action="/auth/salir" method="post">
              <button className="btn btn-s" type="submit">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="env app-cuerpo">
        <h1>{textos.bienvenida}</h1>
        <p style={{ marginTop: "1rem", maxWidth: "34rem", color: "var(--texto-tenue)" }}>
          Entraste como <b style={{ color: "var(--texto)" }}>{data.user.email}</b>. Esta es la
          interfaz de {textos.nombre}: los colores, la tipografía y los textos ya salen de tu
          perfil.
        </p>

        <Tarjeta className="tarjeta" style={{ marginTop: "2rem", maxWidth: "34rem" }}>
          <p style={{ color: "var(--texto-tenue)", lineHeight: 1.6 }}>
            Lo que sigue: el modal «Contanos un poco más» y la pantalla «Mi perfil».
          </p>
          <div className="hero-btns" style={{ marginTop: "1.2rem", justifyContent: "flex-start" }}>
            <button className="btn btn-acento" type="button">
              Botón principal
            </button>
            <button className="btn btn-a" type="button">
              Con degradé
            </button>
            <button className="btn btn-s" type="button">
              Secundario
            </button>
          </div>
        </Tarjeta>
      </main>
    </>
  );
}
