import { certezas, respuesta as t } from "@/content/asistente";
import { normalizar } from "@/lib/asistente/texto";
import type { EntradaVista } from "@/lib/asistente/vista";

/**
 * Una pregunta del catálogo, cerrada, con su respuesta adentro.
 *
 * Se arma en el servidor y viaja como HTML: así el catálogo se puede leer y
 * filtrar sin esperar nada, funciona con el JavaScript todavía cargando, y el
 * corpus no tiene que viajar dos veces.
 *
 * `data-claves` lleva las palabras con las que la gente preguntó esto en el
 * chat. Es lo que hace que buscar «resultados» encuentre «¿cuándo salen las
 * notas?», sin tener que mandar las variantes enteras.
 */
export function Ficha({ entrada }: { entrada: EntradaVista }) {
  return (
    <details
      id={`ficha-${entrada.id}`}
      className="asis-ficha"
      data-certeza={entrada.certeza}
      data-claves={`${normalizar(entrada.pregunta)} ${entrada.claves}`}
      data-categoria={entrada.categoria}
    >
      <summary>
        <span className="asis-punto" data-certeza={entrada.certeza} aria-hidden="true" />
        {/* El color no puede ser el único portador del dato. */}
        <span className="sr-only">{certezas[entrada.certeza].titulo}. </span>
        <span className="asis-ficha-preg">{entrada.pregunta}</span>
      </summary>

      <div className="asis-ficha-cuerpo">
        <p>{entrada.respuesta}</p>

        {entrada.jurisdiccion ? (
          <p className="asis-jurisdiccion">
            <span className="asis-rotulo">{t.jurisdiccionRotulo}</span>
            <span>{t.jurisdicciones[entrada.jurisdiccion]}</span>
          </p>
        ) : null}
        {entrada.nota ? <p className="asis-nota">{entrada.nota}</p> : null}
        {entrada.atada ? <p className="asis-nota">{t.atada}</p> : null}

        {entrada.fuente ? (
          <p className="asis-ficha-fuente">
            <span className="asis-rotulo">{t.rotuloFuente}</span>
            <span>
              {entrada.fuente.nombre}
              {entrada.donde ? ` · ${entrada.donde}` : ""}
            </span>
            <a href={entrada.fuente.url} target="_blank" rel="noopener noreferrer">
              {t.verFuente}
            </a>
          </p>
        ) : (
          <p className="asis-ficha-sin-fuente">{t.origenSinFuente}</p>
        )}

        {entrada.consultas > 0 ? (
          <p className="asis-ficha-cuenta">
            {t.origenConsultas(entrada.consultas, entrada.personas)}
          </p>
        ) : null}
      </div>
    </details>
  );
}
