import Link from "next/link";
import type { SeccionTexto } from "@/lib/guia/tipos";
import { Advertencia } from "./Advertencia";

/**
 * Una sección de texto de la guía: ②, ⑤, ⑥ o ⑦.
 *
 * Devuelve null si no le pasan nada. Es la regla del proyecto puesta donde
 * corresponde: la página no tiene que acordarse de preguntar si hay contenido,
 * porque una sección vacía no se renderiza a sí misma.
 *
 * De la ⑤ para abajo no hay capturas ni videos: sólo hay material real para la
 * parte de inscripción, y un hueco de foto en «Resultados» prometería algo que
 * no va a llegar.
 *
 * La tarjeta blanca (`instructivo-mpd-tarjeta`) la pone la <section> de acá y
 * no un <div> envolvente en la página: el que decide si una sección existe es
 * este componente, y un envoltorio afuera dibujaría una tarjeta vacía cuando
 * devuelve null.
 *
 * Con `plegable`, la sección entera es un <details> y el título hace de
 * solapa. El cuerpo se arma una sola vez y se mete en una envoltura o en la
 * otra: duplicarlo en dos ramas del JSX garantizaba que algún día una se
 * actualizara y la otra no.
 *
 * `accion` es un botón al final: lleva a otra pantalla del sitio, no a una
 * fuente externa. Va aparte de `enlaces` —que son las fuentes oficiales y se
 * ven como enlaces subrayados— porque no es lo mismo «acá está el documento»
 * que «hacé esto ahora», y el botón es lo único que lo dice sin explicarlo.
 */
export function SeccionGuia({
  seccion,
  id,
  plegable = false,
  accion,
}: {
  seccion: SeccionTexto | null;
  id: string;
  plegable?: boolean;
  accion?: { texto: string; url: string };
}) {
  if (!seccion) return null;

  const cuerpo = (
    <>
      {seccion.cuerpo.map((c) => (
        <p key={c}>{c}</p>
      ))}

      {/* Los plegables mandan sobre `items`: una sección declara uno o el
          otro, nunca los dos, y si alguien pusiera ambos mostrar las dos
          listas sería repetir el mismo contenido dos veces.
          Son <details> nativos, así que se abren aunque el JavaScript no haya
          cargado. */}
      {seccion.plegables ? (
        <ul className="guia-plegables">
          {seccion.plegables.map((p) => (
            <li key={p.titulo}>
              <details className="guia-plegable">
                <summary className="guia-plegable-resumen">
                  <span className="guia-plegable-flecha" aria-hidden="true" />
                  <span className="guia-plegable-titulo">{p.titulo}</span>
                </summary>
                <p className="guia-plegable-texto">{p.texto}</p>
              </details>
            </li>
          ))}
        </ul>
      ) : seccion.items ? (
        <ul className="guia-items">
          {seccion.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : null}

      {seccion.advertencias.map((a) => (
        <Advertencia key={a.texto} {...a} />
      ))}

      {seccion.enlaces.length > 0 ? (
        <div className="guia-enlaces">
          {seccion.enlaces.map((e) => (
            <a
              key={e.url}
              className="guia-enlace"
              href={e.url}
              {...(e.url.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {e.texto}
              {e.url.startsWith("http") ? " ↗" : " →"}
            </a>
          ))}
        </div>
      ) : null}

      {accion ? (
        <Link className="guia-accion" href={accion.url}>
          {accion.texto}
        </Link>
      ) : null}
    </>
  );

  if (plegable) {
    return (
      <details className="guia-seccion instructivo-mpd-tarjeta guia-seccion-plegable" id={id}>
        <summary className="guia-seccion-resumen">
          <h2 className="guia-seccion-titulo">{seccion.titulo}</h2>
          <span className="guia-seccion-flecha" aria-hidden="true" />
        </summary>
        {cuerpo}
      </details>
    );
  }

  return (
    <section className="guia-seccion instructivo-mpd-tarjeta" id={id}>
      <h2 className="guia-seccion-titulo">{seccion.titulo}</h2>
      {cuerpo}
    </section>
  );
}
