"use client";

import Link from "next/link";
import {
  certezas,
  contraste as tContraste,
  respuesta as t,
  siguiente,
} from "@/content/asistente";
import type { RespuestaVista } from "@/lib/acciones/asistente";
import type { EntradaVista } from "@/lib/asistente/vista";

/** El sello de certeza. Es lo primero que se ve de una respuesta (A-07). */
export function Sello({ certeza }: { certeza: keyof typeof certezas }) {
  const c = certezas[certeza];
  return (
    <p className="asis-sello" data-certeza={certeza}>
      <span aria-hidden="true">{c.icono}</span>
      <span className="asis-sello-titulo">{c.titulo}</span>
    </p>
  );
}

/** De dónde sale, con el enlace para ir a comprobarlo (A-06). */
export function Fuente({ entrada }: { entrada: EntradaVista }) {
  if (!entrada.fuente) return null;
  return (
    <div className="asis-fuente">
      <p className="asis-rotulo">{t.rotuloFuente}</p>
      <p className="asis-fuente-nombre">
        {entrada.fuente.nombre}
        {entrada.donde ? <span className="asis-fuente-donde"> · {entrada.donde}</span> : null}
      </p>
      <a
        className="asis-fuente-enlace"
        href={entrada.fuente.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.verFuente}
      </a>
    </div>
  );
}

/**
 * A-09. De dónde sale la respuesta, en detalle.
 *
 * Va cerrado: quien sólo quiere la respuesta no tiene que pasar por acá. Pero
 * está en todas, también en las amarillas, y ahí es donde más importa: dice
 * con todas las letras que no hay documento y que lo que hay es la memoria
 * de quienes rindieron.
 */
export function Origen({ entrada }: { entrada: EntradaVista }) {
  return (
    <details className="asis-origen">
      <summary>{t.origen}</summary>
      <div className="asis-origen-cuerpo">
        {entrada.fuente ? (
          <>
            <p className="asis-origen-fuente">
              {entrada.fuente.nombre}
              {entrada.donde ? ` · ${entrada.donde}` : ""}
            </p>
            <p className="asis-origen-que">{entrada.fuente.que}</p>
            <a href={entrada.fuente.url} target="_blank" rel="noopener noreferrer">
              {t.verFuente}
            </a>
          </>
        ) : (
          <p className="asis-origen-que">{t.origenSinFuente}</p>
        )}

        {entrada.consultas > 0 ? (
          <p className="asis-origen-cuenta">
            <span className="asis-rotulo">{t.origenCorpus}</span>
            <span>{t.origenConsultas(entrada.consultas, entrada.personas)}</span>
          </p>
        ) : null}
      </div>
    </details>
  );
}

/** Las advertencias propias de la entrada: jurisdicción, nota, convocatoria. */
export function Advertencias({ entrada }: { entrada: EntradaVista }) {
  return (
    <>
      {entrada.jurisdiccion ? (
        <p className="asis-jurisdiccion">
          <span className="asis-rotulo">{t.jurisdiccionRotulo}</span>
          <span>{t.jurisdicciones[entrada.jurisdiccion]}</span>
        </p>
      ) : null}
      {entrada.nota ? <p className="asis-nota">{entrada.nota}</p> : null}
      {entrada.atada ? <p className="asis-nota">{t.atada}</p> : null}
    </>
  );
}

/**
 * Cuando el documento y lo que circula en los grupos no dicen lo mismo.
 *
 * No se elige una de las dos. Se muestran las dos y se dice en qué difieren:
 * quien estudia necesita saber que hay una discrepancia, sobre todo cuando la
 * versión que circula es la que se olvida de algo.
 */
function Contraste({ entrada, que }: { entrada: EntradaVista; que: string }) {
  return (
    <div className="asis-contraste">
      <p className="asis-contraste-titulo">{tContraste.titulo}</p>
      <p className="asis-contraste-que">{que}</p>
      <div className="asis-contraste-otra">
        <p className="asis-rotulo">{tContraste.loQueDice}</p>
        <p className="asis-contraste-preg">{entrada.pregunta}</p>
        <p>{entrada.respuesta}</p>
      </div>
      <p className="asis-contraste-cierre">{tContraste.cierre}</p>
    </div>
  );
}

/** A-11. Qué hacer después de leer la respuesta. */
export function Siguiente({ alPreguntarDeNuevo }: { alPreguntarDeNuevo: () => void }) {
  return (
    <div className="asis-siguiente">
      <p className="asis-rotulo">{siguiente.rotulo}</p>
      <div className="asis-siguiente-opciones">
        <Link className="btn btn-s" href={siguiente.simulador.destino}>
          {siguiente.simulador.texto}
        </Link>
        <a className="btn btn-s" href={siguiente.normativa.destino}>
          {siguiente.normativa.texto}
        </a>
        <a className="btn btn-s" href={siguiente.frecuentes.destino}>
          {siguiente.frecuentes.texto}
        </a>
        <button type="button" className="btn btn-s" onClick={alPreguntarDeNuevo}>
          {siguiente.otra.texto}
        </button>
      </div>
    </div>
  );
}

/**
 * Una respuesta completa, siempre con la misma forma (A-06): sello, respuesta,
 * fuente, de dónde sale, consulta relacionada. Nunca un párrafo suelto.
 */
export function Respuesta({
  parte,
  mostrarOrganismo,
}: {
  parte: RespuestaVista;
  mostrarOrganismo: boolean;
}) {
  const { entrada } = parte;
  if (!entrada) return null;

  return (
    <article className="asis-respuesta" data-certeza={parte.certeza}>
      <header className="asis-respuesta-cabeza">
        <Sello certeza={parte.certeza === "respaldada" ? "respaldada" : "orientativa"} />
        {mostrarOrganismo ? (
          <span className="asis-org-etiqueta">{entrada.organismo.toUpperCase()}</span>
        ) : null}
      </header>

      <p className="asis-respuesta-preg">{entrada.pregunta}</p>
      <p className="asis-respuesta-texto">{entrada.respuesta}</p>

      {parte.certeza === "orientativa" ? (
        <p className="asis-orientativa">{certezas.orientativa.detalle}</p>
      ) : null}

      <Advertencias entrada={entrada} />
      {parte.contraste ? (
        <Contraste entrada={parte.contraste.entrada} que={parte.contraste.que} />
      ) : null}

      <Fuente entrada={entrada} />
      <Origen entrada={entrada} />

      {parte.relacionada ? (
        <div className="asis-relacionada">
          <p className="asis-rotulo">{t.rotuloRelacionada}</p>
          <p>{parte.relacionada.pregunta}</p>
        </div>
      ) : null}
    </article>
  );
}
