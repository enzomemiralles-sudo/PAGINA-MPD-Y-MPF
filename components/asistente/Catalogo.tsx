import { frecuentes as t } from "@/content/asistente";
import { catalogo, masPreguntadas } from "@/lib/asistente/vista";
import { Ficha } from "@/components/asistente/Ficha";
import { Filtro } from "@/components/asistente/Filtro";
import { Atajos } from "@/components/asistente/Atajos";
import type { Organismo } from "@/lib/asistente/buscar";

const ORGANISMOS: Organismo[] = ["mpd", "mpf"];

/**
 * A-10. Las preguntas que ya están respondidas, para quien prefiere buscar
 * antes que escribir.
 *
 * No es un accesorio del chat: mucha gente prefiere mirar una lista y tiene
 * razón, porque se ve de una qué hay y qué no. Por eso está completo —todas
 * las entradas, no una selección— y agrupado por tema, con lo más preguntado
 * arriba.
 *
 * Los dos organismos se arman en el servidor y el selector esconde el que no
 * corresponde. Cuesta unos kilobytes de HTML y evita mandar el corpus al
 * navegador, tener dos implementaciones de la búsqueda y esperar una ida y
 * vuelta cada vez que alguien abre una pregunta.
 */
export function Catalogo() {
  return (
    <section className="asis-catalogo" id={t.ancla}>
      <h2 className="asis-titulo">{t.titulo}</h2>
      <p className="asis-bajada">{t.bajada}</p>

      {ORGANISMOS.map((org) => {
        const top = masPreguntadas(org);
        const conCuenta = top.some((e) => e.consultas > 0);
        return (
          <div key={org} className="asis-top" data-para={org}>
            <p className="asis-top-titulo">{t.masPreguntadas.titulo}</p>
            <p className="asis-top-ayuda">
              {conCuenta ? t.masPreguntadas.ayuda : t.masPreguntadas.ayudaSinCuenta}
            </p>
            <ol className="asis-top-lista">
              {top.map((e) => (
                <li key={e.id}>
                  <button type="button" className="asis-top-item" data-abre={`ficha-${e.id}`}>
                    <span className="asis-punto" data-certeza={e.certeza} aria-hidden="true" />
                    <span className="asis-top-preg">{e.pregunta}</span>
                    {e.consultas > 0 ? (
                      <span className="asis-top-veces">{t.masPreguntadas.veces(e.consultas)}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        );
      })}

      <Filtro />
      <Atajos />

      <div className="asis-cat">
        {ORGANISMOS.map((org) => (
          <div key={org} className="asis-cat-org" data-para={org}>
            <p className="asis-org-etiqueta asis-cat-org-rotulo">{org.toUpperCase()}</p>
            {catalogo(org).map((g) => (
              <div key={g.categoria} className="asis-cat-grupo" data-categoria={g.categoria}>
                <h3 className="asis-cat-cat">{g.categoria}</h3>
                {g.entradas.map((e) => (
                  <Ficha key={e.id} entrada={e} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="asis-cat-vacio" hidden>
        {t.buscador.sinResultados}
      </p>
    </section>
  );
}
