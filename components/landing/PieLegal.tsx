import Link from "next/link";
import { pie } from "@/content/legales";

/** El aviso de no oficialidad va en todas las vistas: el pie está en el layout. */
export function PieLegal() {
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

        <div className="nota-prov">
          <b>{pie.notaProvisoriaTitulo}</b>
          {pie.notaProvisoriaTexto}
        </div>
      </div>
    </footer>
  );
}
