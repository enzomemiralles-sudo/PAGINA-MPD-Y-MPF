import Link from "next/link";
import { ClipboardList, BookOpen } from "lucide-react";
import type { organismos } from "@/content/simulador";

type Org = (typeof organismos)[number];

/**
 * Un ícono por organismo, el mismo que en la guía de inscripción y en los
 * insumos: el portapapeles es el MPF y el libro es el MPD en todo el sitio.
 * Son las tres pantallas donde hay que elegir organismo, y conviene que se
 * reconozca por la misma marca visual en las tres.
 */
const ICONOS = { mpf: ClipboardList, mpd: BookOpen } as const;

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
  const Icono = ICONOS[org.clave];

  return (
    <article className="sim-org tarjeta-app">
      <div className="sim-org-cabeza">
        <span className="sim-org-icono-fondo">
          <Icono className="sim-org-icono" aria-hidden="true" />
        </span>
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