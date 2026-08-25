import { nav } from "@/content/landing";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";

export function Cabecera() {
  return (
    <header className="cabecera">
      <div className="env nav">
        <div className="marcas">
          <LogoNexo />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia />
        </div>

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
