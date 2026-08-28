import Link from "next/link";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import { configDe } from "@/lib/marca/marcas";
import { miPerfil as t } from "@/content/onboarding";
import type { Marca } from "@/lib/marca/tokens";

export function CabeceraApp({ marca, enPerfil = false }: { marca: Marca; enPerfil?: boolean }) {
  const cfg = configDe(marca);

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
