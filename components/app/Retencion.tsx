import Link from "next/link";
import { primerSimulacro, retomar as t, saludo, temas as tTemas } from "@/content/app";
import type { EstadoHome } from "@/lib/simulador/home";

/**
 * El bloque de retención de la home de puerta.
 *
 * Es lo que hace que alguien vuelva, así que no se esconde nunca. Tiene tres
 * estados y los tres muestran algo:
 *
 *  · con un examen a medias, el saludo dice cuánto falta y la tarjeta lleva de
 *    vuelta a la pregunta donde quedó;
 *  · sin nada empezado pero con exámenes rendidos, saluda y muestra cómo viene
 *    por tema;
 *  · sin ningún intento, invita a empezar el primero. Nunca queda como un menú
 *    suelto.
 *
 * La tarjeta de retomar no muestra puntaje parcial. Podría calcularlo el
 * servidor, pero la pantalla de rendir no lo muestra —la respuesta correcta no
 * viaja al cliente hasta entregar— y mostrarlo acá contradiría eso.
 */
export function Retencion({ nombre, estado }: { nombre: string | null; estado: EstadoHome }) {
  const { retomar, temas, terminados } = estado;
  const faltan = retomar ? retomar.total - retomar.respondidas : 0;

  const segunda = retomar
    ? saludo.faltan(faltan)
    : terminados > 0
      ? saludo.seguimos
      : saludo.primeraVez;

  return (
    <div className="portal-retencion">
      {/* Sin nombre no hay saludo, y no hay tampoco «Hola, usuario»: la frase
          de estado se queda sola al frente, que sigue siendo el titular y el
          elemento LCP. Hoy es lo que pasa siempre —nada escribe el nombre
          todavía— pero la regla vale igual cuando lo escriba algo. */}
      <h1 className="portal-saludo">
        {nombre ? <>{saludo.hola(nombre)} </> : null}
        <span>{segunda}</span>
      </h1>

      {retomar ? (
        <div className="portal-retomar">
          <div>
            <span className="portal-et mono">{t.rotulo}</span>
            <b>{retomar.examen.titulo}</b>
            <p className="portal-sub">
              {retomar.segundos > 0
                ? t.detalle(
                    retomar.respondidas,
                    retomar.total,
                    Math.floor(retomar.segundos / 60),
                    retomar.segundos % 60,
                  )
                : t.sinTiempo(retomar.respondidas, retomar.total)}
            </p>
          </div>
          <Link className="btn btn-a" href={`/simulador/rendir/${retomar.intentoId}`}>
            {t.cta}
          </Link>
        </div>
      ) : (
        <div className="portal-retomar">
          <div>
            <span className="portal-et mono">
              {terminados > 0 ? tTemas.rotulo : primerSimulacro.rotulo}
            </span>
            <b>{terminados > 0 ? primerSimulacro.texto : primerSimulacro.titulo}</b>
            {terminados === 0 ? <p className="portal-sub">{primerSimulacro.texto}</p> : null}
          </div>
          <Link className="btn btn-a" href="/simulador">
            {primerSimulacro.cta}
          </Link>
        </div>
      )}

      {temas.length > 0 ? (
        <div className="portal-barras">
          {temas.map((d) => (
            <div className="portal-barra" key={d.tema}>
              <p className="portal-barra-f">
                <span>{d.tema}</span>
                <span className="mono">{d.porcentaje}%</span>
              </p>
              <span className="portal-barra-t" aria-hidden="true">
                <i style={{ width: `${d.porcentaje}%` }} />
              </span>
              <span className="sr-only">
                {d.correctas} de {d.total}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
