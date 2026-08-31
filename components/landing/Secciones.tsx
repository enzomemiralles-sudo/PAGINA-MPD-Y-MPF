import {
  asistenteSeccion,
  hero,
  inscripcionSeccion,
  gratisSeccion,
} from "@/content/landing";
import { Vidrio } from "@/components/marca/Vidrio";
import { Revelar } from "@/components/marca/Revelar";

function Titulo({ lineas }: { lineas: readonly string[] }) {
  return (
    <h2 style={{ marginTop: "1.1rem" }}>
      {lineas.map((l, i) => (
        <span key={l}>
          {l}
          {i < lineas.length - 1 ? <br /> : null}
        </span>
      ))}
    </h2>
  );
}

/**
 * A-14. El bloque del asistente en la pestaña de muestra.
 *
 * La caja de la derecha es una muestra, no el asistente: quien todavía no
 * tiene cuenta no puede preguntar. Por eso el campo está deshabilitado y el
 * botón es el enlace para crear la cuenta —hacerlo parecer usable y que no
 * pasara nada al escribir sería peor que no mostrarlo—.
 *
 * Los tres sellos de abajo son el resumen de lo que hace la herramienta, y el
 * tercero es el que la distingue: avisa cuando no sabe.
 */
export function SeccionAsistente() {
  const t = asistenteSeccion;
  return (
    <section className="env sec" id="asistente">
      <div className="dos">
        <Revelar indice={0}>
          <span className="eyebrow mono">{t.eyebrow}</span>
          <Titulo lineas={t.titulo} />
          <p className="asis-muestra-bajada">{t.bajada}</p>
          {t.parrafos.map((p) => (
            <p className="asis-muestra-parrafo" key={p}>
              {p}
            </p>
          ))}
        </Revelar>

        <Revelar indice={1}>
          <Vidrio className="tarjeta">
            <p className="asis-muestra-titulo">{t.caja.titulo}</p>
            <div className="asis-muestra-campo" aria-hidden="true">
              {t.caja.marcador}
            </div>
            <p className="asis-muestra-ejemplo mono">{t.caja.ejemplo}</p>
            <a className="btn btn-acento asis-muestra-cta" href={hero.ctaPrimarioHref}>
              {t.caja.cta}
            </a>
          </Vidrio>

          <ul className="asis-muestra-sellos">
            {t.sellos.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Revelar>
      </div>
    </section>
  );
}

export function SeccionInscripcion() {
  const t = inscripcionSeccion;
  return (
    <section className="env sec" id="inscripcion">
      <Revelar indice={0}>
        <div style={{ maxWidth: "38rem" }}>
          <span className="eyebrow mono">{t.eyebrow}</span>
          <Titulo lineas={t.titulo} />
          <p style={{ marginTop: "1.4rem", fontSize: ".97rem" }}>{t.texto}</p>
        </div>
      </Revelar>

      <div className="tres" style={{ marginTop: "2.5rem" }}>
        {t.tarjetas.map((c, i) => (
          <Revelar indice={i + 1} key={c.titulo}>
            <Vidrio className="tarjeta">
              {/* El rótulo usa --marca-revisar y no --acento-2: con --acento-2
                  quedaba transparente en las marcas dual y na. PLAN.md §4c. */}
              <span className="mono eyebrow-revisar">{c.rotulo}</span>
              <h3 style={{ margin: ".7rem 0 .6rem" }}>{c.titulo}</h3>
              <p style={{ fontSize: ".85rem", lineHeight: 1.55 }}>{c.texto}</p>
            </Vidrio>
          </Revelar>
        ))}
      </div>

      <Revelar indice={4}>
        <ul className="lista" style={{ marginTop: "2.5rem", maxWidth: "46rem" }}>
          {t.items.map((i) => (
            <li key={i.n}>
              <span className="n">{i.n}</span>
              <span>
                <b>{i.titulo}</b> {i.texto}
              </span>
            </li>
          ))}
        </ul>
      </Revelar>
    </section>
  );
}

export function SeccionGratis() {
  const t = gratisSeccion;
  return (
    <section className="env sec gratis">
      <Revelar indice={0}>
        <div className="agua" aria-label={t.agua.join(" ")}>
          <span className="l1" aria-hidden="true">{t.agua[0]}</span>
          <span className="l2" aria-hidden="true">{t.agua[1]}</span>
        </div>
      </Revelar>

      <div className="puertas-grid">
        {t.puertas.map((p, i) => (
          <Revelar indice={i + 1} key={p.titulo}>
            <Vidrio className={`pcard ${p.clase}`}>
              <h3>{p.titulo}</h3>
              <span className="quien">{p.quien}</span>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a className="btn btn-s" style={{ width: "100%" }} href={p.href}>
                {p.cta}
              </a>
            </Vidrio>
          </Revelar>
        ))}
      </div>

      <Revelar indice={4}>
        <p className="porque">
          <b style={{ color: "var(--papel)" }}>{t.porqueTitulo}</b>
          {t.porqueTexto}
        </p>
      </Revelar>
    </section>
  );
}
