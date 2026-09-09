"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { guia as t } from "@/content/guia";
import type { Guia, PasoGuia } from "@/lib/guia/tipos";
import { Advertencia } from "./Advertencia";
import { Captura, VideoSlot } from "./Huecos";

/**
 * El ④ y el ⑨: los pasos y el checklist que se arma con ellos.
 *
 * Van juntos en un componente porque comparten estado: el checklist final no
 * es una lista suelta, es el reflejo de lo que la persona fue marcando arriba.
 * Separarlos obligaría a levantar el estado a un contexto para que dos hijos
 * lean lo mismo, y no hay un tercero que lo necesite.
 *
 * Juntos en el archivo, separados en la página: devuelve las dos secciones
 * como hermanas, cada una con su tarjeta blanca. Antes el componente entraba
 * dentro de una <section> escrita en la página y el ⑨ quedaba anidado en el
 * ④; con una tarjeta por sección eso sería un marco adentro de otro.
 *
 * El ⑨ es una fila de cuatro marcas y nada más. Tenía además la
 * documentación de ②, los títulos de los pasos, cuántos faltaban y un botón
 * para imprimir; todo eso repetía lo que ya está más arriba en la misma
 * pantalla, y a dos bloques de distancia el resumen no resumía nada.
 *
 * Lo marcado persiste en localStorage y por organismo: alguien puede estar
 * inscribiéndose a los dos, y su avance en el MPF no es su avance en el MPD.
 * Es lo único que la guía guarda, y no sale de este navegador.
 *
 * Un paso a la vez, en acordeón: el actual abierto y el resto cerrado, pero
 * cualquiera se puede abrir. Nada obliga a seguir el orden.
 */
/**
 * Lo que comparten los tres acordeones: qué pasos están hechos, cuál está
 * abierto, y la memoria de lo marcado.
 *
 * Está acá y no repetido en cada componente porque la parte delicada —leer
 * localStorage después del primer render, y no romperse cuando el navegador
 * lo bloquea— es exactamente la misma para los tres, y dos copias de eso
 * terminan divergiendo en la que nadie vuelve a mirar.
 *
 * `clave` separa las memorias: alguien puede estar inscribiéndose a los dos
 * organismos, y su avance en la etapa 2 del MPD no es su avance en la 3 ni en
 * el MPF.
 */
function useAvance(clave: string, pasos: PasoGuia[]) {
  const [hechos, setHechos] = useState<Set<number>>(new Set());
  const [abierto, setAbierto] = useState<number | null>(null);
  const [cargado, setCargado] = useState(false);

  const almacen = `guia:${clave}:hechos`;

  // Se lee después del primer render: el HTML del servidor no puede saber qué
  // marcó esta persona, y pintarlo distinto en la hidratación es un salto.
  useEffect(() => {
    try {
      const crudo = window.localStorage.getItem(almacen);
      const nums: number[] = crudo ? JSON.parse(crudo) : [];
      const set = new Set(Array.isArray(nums) ? nums.filter((n) => typeof n === "number") : []);
      setHechos(set);
      // Se abre el primero que falta, que es donde quedó.
      const primero = pasos.find((p) => !set.has(p.n));
      setAbierto(primero ? primero.n : null);
    } catch {
      // Modo privado o storage bloqueado: la guía funciona igual, sin memoria.
      setAbierto(pasos[0]?.n ?? null);
    }
    setCargado(true);
  }, [almacen, pasos]);

  const alternar = useCallback(
    (n: number) => {
      setHechos((antes) => {
        const ahora = new Set(antes);
        if (ahora.has(n)) ahora.delete(n);
        else ahora.add(n);
        try {
          window.localStorage.setItem(almacen, JSON.stringify([...ahora]));
        } catch {
          // Sin persistencia, pero el paso igual queda marcado en esta visita.
        }
        return ahora;
      });
    },
    [almacen],
  );

  return { hechos, abierto, setAbierto, cargado, alternar };
}

/** La fila de marcas: un número por paso, con su tilde cuando está hecho. */
function Marcas({ pasos, hechos, clase }: { pasos: PasoGuia[]; hechos: Set<number>; clase?: string }) {
  return (
    <ol className={clase ? `guia-checklist-fila ${clase}` : "guia-checklist-fila"}>
      {pasos.map((p) => (
        <li key={p.n} data-hecho={hechos.has(p.n) ? "si" : "no"}>
          <span className="guia-checklist-marca" aria-hidden="true">
            {hechos.has(p.n) ? "✓" : "○"}
          </span>
          <span className="guia-checklist-n" aria-hidden="true">
            {p.n}
          </span>
          {/* Un número suelto no dice nada leído en voz alta. Acá va lo que se
              ve —el paso, su nombre y si está hecho— para quien usa lector de
              pantalla. */}
          <span className="sr-only">
            {t.paso(p.n)}: {p.titulo}. {hechos.has(p.n) ? t.checklistHecho : t.checklistPendiente}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Pasos({ guia, clave }: { guia: Guia; clave: string }) {
  const total = guia.pasos.length;
  const { hechos, abierto, setAbierto, cargado, alternar } = useAvance(clave, guia.pasos);

  return (
    <>
      {/* ④ Con su tarjeta y su título. El título vivía en la página, que
          envolvía a este componente en una <section>; ahora que cada sección
          es una tarjeta, esa envoltura habría dejado la del checklist metida
          adentro de la del paso a paso. Las dos salen de acá, hermanas. */}
      <section className="guia-seccion instructivo-mpd-tarjeta" id="pasos">
        <h2 className="guia-seccion-titulo">{t.secciones.pasos}</h2>

        {/* El progreso. `cargado` evita que parpadee «0 de 4» antes de leer
            lo guardado. */}
        <div className="guia-progreso" role="group" aria-label={t.progresoAyuda}>
          <div className="guia-barra">
            <i style={{ width: `${cargado ? (hechos.size / total) * 100 : 0}%` }} />
          </div>
          {/* Sin `.mono`, igual que el rótulo del paso. */}
          <span className="guia-progreso-texto">
            {cargado ? t.progreso(hechos.size, total) : t.progreso(0, total)}
          </span>
        </div>

        <ol className="guia-pasos">
          {guia.pasos.map((p) => (
            <Paso
              key={p.n}
              paso={p}
              total={total}
              prefijo="pasos"
              hecho={hechos.has(p.n)}
              abierto={abierto === p.n}
              onAbrir={() => setAbierto(abierto === p.n ? null : p.n)}
              onHecho={() => alternar(p.n)}
            />
          ))}
        </ol>
      </section>

      {/* ⑨ El checklist final */}
      <section className="guia-seccion instructivo-mpd-tarjeta" id="checklist">
        <h2 className="guia-seccion-titulo">{t.secciones.checklist}</h2>

        {/* Un solo renglón: los cuatro pasos por su número y su marca, nada
            más. Sigue reflejando lo mismo que antes —el estado sale del mismo
            `hechos` que el acordeón de arriba—, pero ya no repite los títulos
            de los pasos, que están completos dos bloques más arriba. */}
        <Marcas pasos={guia.pasos} hechos={hechos} />
      </section>
    </>
  );
}

/**
 * Una etapa que va como acordeón: las etapas 2 y 3 del MPD.
 *
 * Comparte el `Paso` y la memoria de lo marcado con el ④, así que los tres
 * acordeones se ven, se tocan y se acuerdan igual. Lo que no comparte es la
 * barra de progreso ni la tarjeta aparte del checklist: acá las marcas van
 * al pie de la misma tarjeta, chicas y sin título. El ④ necesita esa tarjeta
 * porque su checklist resume un trámite que dura días y se mira solo; estas
 * dos etapas se leen de una sentada y el resumen es apenas el recordatorio de
 * por dónde ibas.
 *
 * `id` es el ancla de la sección y también la clave con que se guarda el
 * avance, y el `<h2>` sale de acá y no de la página por el mismo motivo que el
 * del ④: la sección entera es este componente.
 */
export function PasosEtapa({
  titulo,
  id,
  clave,
  pasos,
  intro = [],
  accion,
}: {
  titulo: string;
  id: string;
  clave: string;
  pasos: PasoGuia[];
  intro?: string[];
  accion?: { texto: string; url: string };
}) {
  const { hechos, abierto, setAbierto, alternar } = useAvance(`${clave}-${id}`, pasos);

  if (pasos.length === 0) return null;

  return (
    <section className="guia-seccion instructivo-mpd-tarjeta" id={id}>
      <h2 className="guia-seccion-titulo">{titulo}</h2>

      {intro.map((p) => (
        <p key={p}>{p}</p>
      ))}

      <ol className="guia-pasos">
        {pasos.map((p) => (
          <Paso
            key={p.n}
            paso={p}
            total={pasos.length}
            prefijo={id}
            hecho={hechos.has(p.n)}
            abierto={abierto === p.n}
            onAbrir={() => setAbierto(abierto === p.n ? null : p.n)}
            onHecho={() => alternar(p.n)}
          />
        ))}
      </ol>

      {/* Las marcas al pie, sin título: acá no hace falta anunciar que es un
          checklist, porque está a dos centímetros de los pasos que resume. */}
      <Marcas pasos={pasos} hechos={hechos} clase="guia-checklist-pie" />

      {/* El mismo botón que `SeccionGuia` pone al final de una sección: la
          etapa cambió de forma, pero sigue terminando en el mismo lugar y con
          la misma oferta. */}
      {accion ? (
        <Link className="guia-accion" href={accion.url}>
          {accion.texto}
        </Link>
      ) : null}
    </section>
  );
}

/**
 * Un paso del acordeón. El orden de composición es fijo y lo impone acá.
 *
 * `onHecho` es opcional: sin él no se dibuja la casilla de «Ya lo hice». La
 * inscripción es un trámite que se hace de a ratos durante días y marcar el
 * avance sirve; entrar a la plataforma y rendir pasan de una sentada, y una
 * casilla ahí sería una promesa de que algo se guarda cuando no hay nada que
 * guardar.
 */
function Paso({
  paso,
  total,
  prefijo,
  hecho = false,
  abierto,
  onAbrir,
  onHecho,
}: {
  paso: PasoGuia;
  total: number;
  prefijo: string;
  hecho?: boolean;
  abierto: boolean;
  onAbrir: () => void;
  onHecho?: () => void;
}) {
  // El prefijo es obligatorio porque hay tres acordeones en la misma página y
  // los tres numeran desde 1: sin él habría tres elementos con id "paso-1", el
  // `aria-controls` apuntaría al cuerpo equivocado y el ancla llevaría siempre
  // al primero.
  const idPaso = `${prefijo}-paso-${paso.n}`;
  const idCuerpo = `${idPaso}-cuerpo`;

  return (
    <li className="guia-paso" data-hecho={hecho ? "si" : "no"} id={idPaso}>
      <h3 className="guia-paso-cabeza">
        <button
          type="button"
          className="guia-paso-boton"
          onClick={onAbrir}
          aria-expanded={abierto}
          aria-controls={idCuerpo}
        >
          {/* Sin `.mono`: el rótulo va en la letra de la página. De esa clase
              sólo quedaba en pie la familia; el cuerpo, el tracking y las
              mayúsculas ya los pisa `.guia-paso-n`. */}
          <span className="guia-paso-n">{t.deCuantos(paso.n, total)}</span>
          <span className="guia-paso-titulo">{paso.titulo}</span>
          <span className="guia-paso-resumen">{paso.resumen}</span>
          <span className="guia-paso-flecha" aria-hidden="true">
            {abierto ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div className="guia-paso-cuerpo" id={idCuerpo} hidden={!abierto}>
        {/* explicación → captura → video → advertencia, siempre en este orden.
            Una captura puede pedir un lugar dentro de la explicación con
            `trasParrafo`; el resto sigue cayendo junto, después del último
            párrafo. */}
        {paso.cuerpo.map((c, i) => (
          <Fragment key={c}>
            <p>{c}</p>
            {paso.capturas
              .filter((cap) => cap.trasParrafo === i + 1)
              .map((cap) => (
                <Captura key={cap.id} {...cap} />
              ))}
          </Fragment>
        ))}

        {paso.capturas
          .filter((c) => c.trasParrafo === undefined || c.trasParrafo > paso.cuerpo.length)
          .map((c) => (
            <Captura key={c.id} {...c} />
          ))}

        {paso.videos.map((v) => (
          <VideoSlot key={v.id} {...v} />
        ))}

        {paso.advertencias.map((a) => (
          <Advertencia key={a.texto} {...a} />
        ))}

        {paso.enlace ? (
          <a
            className="guia-enlace"
            href={paso.enlace.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {paso.enlace.texto} ↗
          </a>
        ) : null}

        {onHecho ? (
          <label className="guia-hecho">
            <input type="checkbox" checked={hecho} onChange={onHecho} />
            <span>{hecho ? t.desmarcar : t.hecho}</span>
          </label>
        ) : null}
      </div>
    </li>
  );
}
