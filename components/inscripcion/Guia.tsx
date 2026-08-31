import {
  despues,
  enlaces as tEnlaces,
  guia as tGuia,
  fuente as tFuente,
  repaso as tRepaso,
} from "@/content/inscripcion/textos";
import { Estado } from "@/components/inscripcion/Estado";
import { Trampas } from "@/components/inscripcion/Trampas";
import { Paso } from "@/components/inscripcion/Paso";
import { Seccion } from "@/components/inscripcion/Seccion";
import { Errores } from "@/components/inscripcion/Errores";
import { Videos } from "@/components/inscripcion/Videos";
import type { Video } from "@/lib/inscripcion/datos";
import type { Guia as Dato } from "@/lib/inscripcion/tipos";
import type { Concurso } from "@/lib/tipos";

/**
 * Una guía entera, de punta a punta.
 *
 * I-08: acá está la estructura, una sola vez. El MPD y el MPF no son dos
 * páginas parecidas: son este componente con distintos datos. El día que
 * exista el manual del MPF no hay nada que maquetar.
 *
 * El orden es el del recorrido de quien llega: en qué anda el trámite, qué
 * necesito antes, lo que más caro sale, los pasos, lo que viene después,
 * qué hago si algo falla, y el material.
 */
export function Guia({
  guia,
  concurso,
  videos,
}: {
  guia: Dato;
  concurso: Concurso | null;
  videos: Video[];
}) {
  return (
    <div className="ins-guia" data-para={guia.organismo}>
      <Estado concurso={concurso} />

      <section className="ins-checklist">
        <h2 className="ins-titulo">{guia.checklist.titulo}</h2>
        <p className="ins-bajada">{guia.checklist.bajada}</p>
        <ul className="ins-checklist-lista">
          {guia.checklist.items.map((i) => (
            <li key={i.titulo}>
              <p className="ins-punto-titulo">{i.titulo}</p>
              <p className="ins-punto-texto">{i.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      {guia.destacado ? (
        <section className="ins-destacado">
          <h2 className="ins-destacado-titulo">{guia.destacado.titulo}</h2>
          {guia.destacado.cuerpo.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ) : null}

      <Trampas guia={guia} />

      <section className="ins-pasos">
        <h2 className="ins-titulo">{tGuia.titulo}</h2>
        <p className="ins-bajada">{tGuia.bajada}</p>

        <nav className="ins-indice" aria-label={tGuia.indice}>
          <ol>
            {guia.pasos.map((p) => (
              <li key={p.n}>
                <a href={`#${guia.organismo}-paso-${p.n}`}>
                  <span className="ins-indice-n">{p.n}</span>
                  <span>{p.titulo}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ins-pasos-lista">
          {guia.pasos.map((p) => (
            <Paso key={p.n} paso={p} org={guia.organismo} />
          ))}
        </div>
      </section>

      {guia.secciones.length > 0 ? (
        <section className="ins-despues">
          <h2 className="ins-titulo">{despues.titulo}</h2>
          <p className="ins-bajada">{despues.bajada}</p>
          <div className="ins-secciones">
            {guia.secciones.map((s) => (
              <Seccion key={s.ancla} seccion={s} org={guia.organismo} />
            ))}
          </div>
        </section>
      ) : null}

      <Errores guia={guia} />
      <Videos videos={videos} organismo={guia.organismo} />

      <section className="ins-repaso" id={`${guia.organismo}-${tRepaso.ancla}`}>
        <h2 className="ins-titulo">{guia.repaso.titulo}</h2>
        <p className="ins-bajada">{tRepaso.bajada}</p>
        <div className="ins-repaso-grupos">
          {guia.repaso.grupos.map((g) => (
            <div key={g.titulo} className="ins-repaso-grupo">
              <p className="ins-repaso-titulo">{g.titulo}</p>
              <ul>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="ins-enlaces">
        <h2 className="ins-titulo">{tEnlaces.titulo}</h2>
        <p className="ins-bajada">{tEnlaces.bajada}</p>
        <ul className="ins-enlaces-lista">
          {guia.enlaces.map((e) => (
            <li key={e.que}>
              <span className="ins-enlace-que">{e.que}</span>
              {e.url ? (
                <a href={e.url} target="_blank" rel="noopener noreferrer">
                  {e.donde}
                </a>
              ) : (
                <span className="ins-enlace-donde">{e.donde}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="ins-fuente">
        <span className="ins-rotulo">{tFuente.rotulo}</span>
        <span>{guia.fuente}</span>
      </p>
    </div>
  );
}
