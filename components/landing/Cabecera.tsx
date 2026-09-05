import Link from "next/link";
import { nav } from "@/content/landing";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";

export function Cabecera() {
  return (
    <header className="cabecera">
      <div className="env nav">
        {/* El logo también es un botón: lleva siempre al inicio, como en la
            cabecera de sesión (CabeceraApp), que ya hace lo mismo con /app. */}
        <Link href="/" className="marcas" aria-label="Inicio">
          <LogoNexo />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia />
        </Link>

        <nav className="links" aria-label="Secciones">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.texto}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a className="btn btn-p" href={nav.ctaHref}>
            {nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
