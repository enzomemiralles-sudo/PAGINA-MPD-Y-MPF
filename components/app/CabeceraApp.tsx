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
export function CabeceraApp({ marca, revisor = false }: { marca: Marca; revisor?: boolean }) {
  const cfg = configDe(marca);
  const ruta = usePathname() ?? "";
  const enPerfil = ruta.startsWith("/mi-perfil");

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

        {/* El lema de la agrupación. Va a la derecha del logo y desaparece
            en pantallas angostas, donde compite con las acciones. */}
        {cfg ? <span className="app-lema mono">{cfg.lema}</span> : null}

        <div className="app-acciones">
          {/* Sólo para quien revisa. Al resto la ruta ni le aparece ni le
              responde: /revisar devuelve 404 si el rol no es revisor. */}
          {revisor && !ruta.startsWith("/revisar") ? (
            <Link className="btn btn-s" href="/revisar">
              {t.revisar}
            </Link>
          ) : null}
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
