import Link from "next/link";
import type { organismos } from "@/content/simulador";

type Org = (typeof organismos)[number];

/**
 * La tarjeta grande de un organismo (S-02).
 *
 * Lista sus dos instancias porque la diferencia entre el MPF y el MPD no está
 * en el nombre: está en que uno toma búsqueda e investigación y el otro toma
 * tipeo. Quien entra tiene que poder verlo antes de elegir.
 *
 * No dice cuántas preguntas hay (S-09).
 */
export function TarjetaOrganismo({ org }: { org: Org }) {
  return (
    <article className="sim-org tarjeta-app">
      <div className="sim-org-cabeza">
        <span className="sim-org-sigla mono">{org.sigla}</span>
        <h3 className="sim-org-nombre">{org.nombre}</h3>
      </div>

      <ul className="sim-org-instancias">
        {org.instancias.map((i) => (
          <li key={i.instancia}>
            <span className="sim-org-instancia">{i.titulo}</span>
            <span className="sim-org-detalle">{i.detalle}</span>
          </li>
        ))}
      </ul>

      <Link className="btn btn-p sim-org-cta" href={`/simulador/${org.clave}`}>
        {org.cta}
      </Link>
    </article>
  );
}
