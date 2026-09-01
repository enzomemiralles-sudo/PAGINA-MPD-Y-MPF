import Image from "next/image";
import { simuladorSeccion as t } from "@/content/landing";
import { Revelar } from "@/components/marca/Revelar";

/**
 * TANDA 7. El apartado del simulador en la pestaña de muestra.
 *
 * Reemplaza a la maqueta dibujada que había acá. Ésta muestra capturas reales
 * de las pantallas del simulador corriendo con preguntas reales del banco, que
 * es la razón por la que la tanda iba última: no se podía construir antes de
 * que el simulador existiera.
 *
 * El criterio es el opuesto al de `/simulador`. Allá la pantalla es directa y
 * funcional porque quien entra ya decidió practicar. Acá hay que convencer,
 * así que manda la imagen: poco texto, capturas grandes, y el orden de V-08 —
 * presentación, cómo se ve, MPF, MPD, resultados, características, y recién al
 * final el llamado.
 *
 * Las capturas van con <Image> y no con <img>: son cinco PNG de 2x y sin
 * optimizar pesarían 776 KB en la portada. Next las sirve en el tamaño que
 * hace falta y en formato moderno, y las de más abajo no se bajan hasta que
 * hagan falta.
 */

type Captura = { src: string; ancho: number; alto: number; alt: string };

function Pantalla({ captura, prioritaria = false }: { captura: Captura; prioritaria?: boolean }) {
  return (
    <div className="sim-pantalla">
      <Image
        src={captura.src}
        alt={captura.alt}
        width={captura.ancho}
        height={captura.alto}
        sizes="(min-width: 1100px) 900px, 100vw"
        priority={prioritaria}
      />
    </div>
  );
}

export function SeccionSimulador() {
  return (
    <section className="env sec" id="simulador">
      {/* V-01 · presentación */}
      <Revelar indice={0}>
        <div className="sim-muestra-cabeza">
          <span className="eyebrow mono">{t.eyebrow}</span>
          <h2 className="sim-muestra-titulo">{t.titulo[0]}</h2>
          <p className="sim-muestra-bajada">{t.bajada}</p>
          <a className="btn btn-acento" href={t.ctaHref}>
            {t.cta}
          </a>
        </div>
      </Revelar>

      {/* V-02 · así se ve, con la captura de protagonista */}
      <Revelar indice={1}>
        <div className="sim-muestra-hero">
          <h3 className="sim-muestra-sub">{t.asiSeVe.titulo}</h3>
          <Pantalla captura={t.asiSeVe.captura} prioritaria />
          <ul className="sim-muestra-frases">
            {t.asiSeVe.frases.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </Revelar>

      {/* V-03 y V-04 · un organismo por bloque, con la misma anatomía */}
      {t.organismos.map((o, i) => (
        <Revelar indice={2 + i} key={o.sigla}>
          <div className="sim-muestra-org">
            <div className="sim-muestra-org-cabeza">
              <span className="mono eyebrow-revisar">{o.sigla}</span>
              <h3 className="sim-muestra-sub">{o.nombre}</h3>
              <p className="sim-muestra-texto">{o.texto}</p>
            </div>
            <div className="sim-muestra-instancias">
              {o.instancias.map((ins) => (
                <div className="sim-muestra-instancia" key={ins.titulo}>
                  <Pantalla captura={ins.captura} />
                  <p className="sim-muestra-instancia-titulo">{ins.titulo}</p>
                  <p className="sim-muestra-instancia-texto">{ins.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </Revelar>
      ))}

      {/* V-05 · resultados */}
      <Revelar indice={4}>
        <div className="sim-muestra-resultados">
          <div>
            <h3 className="sim-muestra-sub">{t.resultados.titulo}</h3>
            <p className="sim-muestra-texto">{t.resultados.texto}</p>
          </div>
          <Pantalla captura={t.resultados.captura} />
        </div>
      </Revelar>

      {/* V-06 · características */}
      <Revelar indice={5}>
        <div className="sim-muestra-caracteristicas">
          <h3 className="sim-muestra-sub">{t.caracteristicas.titulo}</h3>
          <ul>
            {t.caracteristicas.items.map((c) => (
              <li key={c.titulo}>
                <b>{c.titulo}</b>
                <span>{c.texto}</span>
              </li>
            ))}
          </ul>
          <a className="btn btn-s" href={t.caracteristicas.ctaHref}>
            {t.caracteristicas.cta}
          </a>
        </div>
      </Revelar>

      {/* V-07 · cierre */}
      <Revelar indice={6}>
        <div className="sim-muestra-cierre">
          <p className="sim-muestra-cierre-titulo">{t.cierre.titulo}</p>
          <a className="btn btn-acento" href={t.cierre.ctaHref}>
            {t.cierre.cta}
          </a>
        </div>
      </Revelar>
    </section>
  );
}
