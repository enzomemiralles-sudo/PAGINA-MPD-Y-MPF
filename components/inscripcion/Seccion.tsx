import { guia as t } from "@/content/inscripcion/textos";
import { Aviso } from "@/components/inscripcion/Aviso";
import type { Organismo, Seccion as Dato } from "@/lib/inscripcion/tipos";

/**
 * Una sección de lo que viene después de inscribirse: el examen y el después.
 *
 * Misma anatomía que un paso pero sin número, porque no son cosas que se hagan
 * en orden: son cosas que hay que saber. Comparten el tratamiento de avisos y
 * consejo para que la página se lea como una sola.
 */
export function Seccion({ seccion, org }: { seccion: Dato; org: Organismo }) {
  return (
    <article className="ins-seccion" id={`${org}-${seccion.ancla}`}>
      <h3 className="ins-seccion-titulo">{seccion.titulo}</h3>
      {seccion.bajada ? <p className="ins-seccion-bajada">{seccion.bajada}</p> : null}

      <div className="ins-paso-cuerpo">
        {seccion.cuerpo.map((p) => (
          <p key={p}>{p}</p>
        ))}

        {seccion.puntos ? (
          <div className="ins-puntos">
            <p className="ins-puntos-titulo">{seccion.puntos.titulo}</p>
            <ol className="ins-puntos-lista">
              {seccion.puntos.items.map((i) => (
                <li key={i.titulo}>
                  <p className="ins-punto-titulo">{i.titulo}</p>
                  <p className="ins-punto-texto">{i.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {seccion.avisos.map((a) => (
          <Aviso key={a.titulo} aviso={a} />
        ))}

        {seccion.consejo ? (
          <div className="ins-consejo">
            <p className="ins-rotulo">{t.consejo}</p>
            <p>{seccion.consejo}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
