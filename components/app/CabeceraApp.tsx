"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import { configDe } from "@/lib/marca/marcas";
import { miPerfil as t } from "@/content/onboarding";
import type { Marca } from "@/lib/marca/tokens";

/**
 * La cabecera de las pantallas con sesión. Se monta una sola vez, en el layout
 * del grupo (sesion).
 *
 * Es cliente por una sola razón: la acción de la derecha cambia según dónde
 * estés —«Mi perfil» en todos lados, «Volver» cuando ya estás en él— y eso
 * necesita la ruta. La marca sigue viniendo del servidor, del perfil.
 */
export function CabeceraApp({ marca }: { marca: Marca }) {
  const cfg = configDe(marca);
  const enPerfil = (usePathname() ?? "").startsWith("/mi-perfil");

  return (
    <header className="app-cabecera">
      <div className="env app-nav">
        <Link href="/app" className="app-marca" aria-label={cfg?.nombre ?? "Inicio"}>
          {marca === "nexo" ? (
            <LogoNexo alto={18} />
          ) : (
            <>
              <LogoNuevaAbogacia alto={20} />
              <span className="nombre">{cfg?.nombre}</span>
            </>
          )}
        </Link>

        <div className="app-acciones">
          {enPerfil ? (
            <Link className="btn btn-s" href="/app">
              {t.volver}
            </Link>
          ) : (
            <Link className="btn btn-s" href="/mi-perfil">
              {t.titulo}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
