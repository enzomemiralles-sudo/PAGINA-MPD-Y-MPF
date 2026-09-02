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
 */
export function SeccionGuia({ seccion, id }: { seccion: SeccionTexto | null; id: string }) {
  if (!seccion) return null;

  return (
    <section className="guia-seccion" id={id}>
      <h2 className="guia-seccion-titulo">{seccion.titulo}</h2>

      {seccion.cuerpo.map((c) => (
        <p key={c}>{c}</p>
      ))}

      {seccion.items ? (
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
    </section>
  );
}
