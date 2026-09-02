import {
  asistenteSeccion,
  hero,
  inscripcionSeccion,
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

/**
 * I-09. El bloque de inscripción en la pestaña de muestra.
 *
 * Sólo anuncia lo que existe. Los cuatro destacados que pide CAMBIOS.md
 * incluyen capturas de pantalla y videos, y hoy no hay ninguno de los dos:
 * mostrarlos igual sería prometer una sección vacía. Cada uno dice de qué
 * depende y `loQueHay` cuenta los datos, así que aparecen solos el día que se
 * carguen.
 *
 * Lo mismo con las tarjetas de concurso: una por guía cargada.
 */
export function SeccionInscripcion({
  hay,
  concursos,
}: {
  hay: Record<string, boolean>;
  concursos: { sigla: string; nombre: string; cargo: string }[];
}) {
  const t = inscripcionSeccion;
  const destacados = t.destacados.filter((d) => hay[d.depende]);

  return (
    <section className="env sec" id="inscripcion">
      <div className="dos">
        <Revelar indice={0}>
          <span className="eyebrow mono">{t.eyebrow}</span>
          <Titulo lineas={t.titulo} />
          <p className="ins-muestra-texto">{t.texto}</p>

          {destacados.length > 0 ? (
            <ul className="ins-muestra-destacados">
              {destacados.map((d) => (
                <li key={d.texto}>
                  <span aria-hidden="true">{d.icono}</span> {d.texto}
                </li>
              ))}
            </ul>
          ) : null}
        </Revelar>

        <Revelar indice={1}>
          {concursos.length > 0 ? (
            <div className="ins-muestra-concursos">
              {concursos.map((c) => (
                <Vidrio className="tarjeta" key={c.sigla}>
                  <span className="mono eyebrow-revisar">{c.sigla}</span>
                  <h3 className="ins-muestra-concurso">{c.nombre}</h3>
                  <p className="ins-muestra-cargo">{c.cargo}</p>
                  <a className="btn btn-acento ins-muestra-cta" href={t.ctaHref}>
                    {t.cta}
                  </a>
                </Vidrio>
              ))}
            </div>
          ) : null}

          <div className="ins-muestra-cierre">
            <p className="ins-muestra-cierre-titulo">{t.cierre.titulo}</p>
            <p className="ins-muestra-cierre-texto">{t.cierre.texto}</p>
            <a className="btn btn-s" href={t.cierre.href}>
              {t.cierre.cta}
            </a>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
