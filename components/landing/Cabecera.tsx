import Link from "next/link";
import { nav } from "@/content/landing";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";

/**
 * La cabecera de la portada: los dos logotipos y las tres anclas.
 *
 * Sin botón de «Empezar». Había dos en la misma pantalla —uno acá arriba y
 * otro abajo del titular— con el mismo texto y el mismo destino. Dos veces la
 * misma llamada no es el doble de invitación: es una decisión que el visitante
 * tiene que tomar dos veces, y la de arriba compite con el titular, que es lo
 * que todavía tiene que convencerlo. Queda la del hero, que llega después de
 * haber leído qué es esto.
 */
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
      </div>
    </header>
  );
}
