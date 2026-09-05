import Link from "next/link";
import { pie } from "@/content/legales";
import { laOtra } from "@/lib/marca/marcas";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import type { Marca } from "@/lib/marca/tokens";

/**
 * El pie. El aviso de no oficialidad va en todas las vistas.
 *
 * La línea de coorganización es la única pieza que depende de la puerta: en
 * sesión el encabezado lleva un solo logo, el de la agrupación del perfil; el
 * de la otra aparece acá, chico, para que se siga viendo que el sitio es de
 * las dos.
 */
export function PieLegal({ marca = "dual" }: { marca?: Marca }) {
  const otra = laOtra(marca);

  return (
    <footer className="pie">
      <div className="env">
        <p className="aviso">{pie.aviso}</p>

        <div className="pie-links">
          {pie.links.map((l) =>
            "externo" in l && l.externo ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.texto}
              </a>
            ) : (
              <Link key={l.href} href={l.href}>
                {l.texto}
              </Link>
            ),
          )}
        </div>

        {otra ? (
          <p className="pie-coorg">
            <span className="mono">{pie.coorganizacion}</span>
            {otra.id === "nexo" ? <LogoNexo alto={14} /> : <LogoNuevaAbogacia alto={48} />}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
