import { estados as t } from "@/content/inscripcion/textos";
import type { Concurso } from "@/lib/tipos";

/**
 * En qué anda el trámite hoy.
 *
 * Sale de la tabla `concursos`, no de una constante: el día que el MPD pase a
 * inscripción abierta, esta franja cambia sola y con ella el tono de toda la
 * página. Sin esto habría que acordarse de editar un texto justo el día que
 * abre la inscripción, que es el peor día para acordarse de algo.
 */
export function Estado({ concurso }: { concurso: Concurso | null }) {
  if (!concurso) return null;
  const texto = t[concurso.estado];

  return (
    <aside className="ins-estado" data-estado={concurso.estado}>
      <p className="ins-rotulo">{t.rotulo}</p>
      <p className="ins-estado-titulo">{texto.titulo}</p>
      <p className="ins-estado-texto">{texto.texto}</p>
      {concurso.fecha_cierre_inscripcion && concurso.estado === "inscripcion_abierta" ? (
        <p className="ins-estado-fecha">
          Cierra el{" "}
          {new Date(`${concurso.fecha_cierre_inscripcion}T12:00:00`).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
          })}
          .
        </p>
      ) : null}
      {concurso.url_oficial ? (
        <a href={concurso.url_oficial} target="_blank" rel="noopener noreferrer">
          {t.verFicha}
        </a>
      ) : null}
    </aside>
  );
}
