import { errores as t } from "@/content/inscripcion/textos";
import type { Guia } from "@/lib/inscripcion/tipos";

/** I-05. Se alimenta de lo que la gente deja sin responder en el asistente. */
export function Errores({ guia }: { guia: Guia }) {
  if (guia.errores.length === 0) return null;

  return (
    <section className="ins-errores" id={`${guia.organismo}-${t.ancla}`}>
      <h2 className="ins-titulo">{t.titulo}</h2>
      <p className="ins-bajada">{t.bajada}</p>

      <div className="ins-errores-lista">
        {guia.errores.map((e) => (
          <details key={e.titulo} className="ins-error">
            <summary>{e.titulo}</summary>
            <div className="ins-error-cuerpo">
              {e.cuerpo.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {e.paso !== null ? (
                <a href={`#${guia.organismo}-paso-${e.paso}`}>{t.verPaso(e.paso)}</a>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
