import { guia as t } from "@/content/inscripcion/textos";
import { Aviso } from "@/components/inscripcion/Aviso";
import type { Organismo, Paso as Dato } from "@/lib/inscripcion/tipos";

/**
 * Un paso de la guía (I-04).
 *
 * El orden de adentro es el de quien lo está haciendo: dónde estoy, qué hago,
 * qué tengo que mirar, qué me pueden decir. Los avisos van después del cuerpo
 * y antes del consejo, porque son parte del instructivo; el consejo de Nexo va
 * último y se ve distinto, porque es opinión y no procedimiento.
 *
 * Las capturas se dibujan si las hay. Hoy no hay ninguna: el hueco está hecho
 * y no se dibuja nada mientras esté vacío.
 */
export function Paso({ paso, org }: { paso: Dato; org: Organismo }) {
  return (
    <article className="ins-paso" id={`${org}-paso-${paso.n}`}>
      <header className="ins-paso-cabeza">
        <span className="ins-paso-n" aria-hidden="true">
          {paso.n}
        </span>
        <div className="ins-paso-titulos">
          <h3 className="ins-paso-titulo">
            <span className="sr-only">{t.paso(paso.n)}. </span>
            {paso.titulo}
          </h3>
          <p className="ins-paso-resumen">{paso.resumen}</p>
        </div>
      </header>

      <div className="ins-paso-cuerpo">
        {paso.donde ? (
          <p className="ins-paso-donde">
            <span className="ins-rotulo">{t.donde}</span>
            <span>{paso.donde}</span>
          </p>
        ) : null}

        {paso.cuerpo.map((p) => (
          <p key={p}>{p}</p>
        ))}

        {paso.puntos ? (
          <div className="ins-puntos">
            <p className="ins-puntos-titulo">{paso.puntos.titulo}</p>
            <ol className="ins-puntos-lista">
              {paso.puntos.items.map((i) => (
                <li key={i.titulo}>
                  <p className="ins-punto-titulo">{i.titulo}</p>
                  <p className="ins-punto-texto">{i.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {paso.capturas.map((c) => (
          <figure key={c.archivo} className="ins-captura">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.archivo} alt={c.alt} loading="lazy" />
            <figcaption>{c.pie}</figcaption>
          </figure>
        ))}

        {paso.avisos.map((a) => (
          <Aviso key={a.titulo} aviso={a} />
        ))}

        {paso.consejo ? (
          <div className="ins-consejo">
            <p className="ins-rotulo">{t.consejo}</p>
            <p>{paso.consejo}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
