"use client";

import { useCallback, useEffect, useState } from "react";
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
export function Pasos({ guia, clave }: { guia: Guia; clave: string }) {
  const total = guia.pasos.length;
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
      const primero = guia.pasos.find((p) => !set.has(p.n));
      setAbierto(primero ? primero.n : null);
    } catch {
      // Modo privado o storage bloqueado: la guía funciona igual, sin memoria.
      setAbierto(guia.pasos[0]?.n ?? null);
    }
    setCargado(true);
  }, [almacen, guia.pasos]);

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
          <span className="guia-progreso-texto mono">
            {cargado ? t.progreso(hechos.size, total) : t.progreso(0, total)}
          </span>
        </div>

        <ol className="guia-pasos">
          {guia.pasos.map((p) => (
            <Paso
              key={p.n}
              paso={p}
              total={total}
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
            de los pasos, que están completos dos bloques más arriba.
            <ol> y no <ul>: el orden es el dato, es lo que dicen los números.
            El número va en un <span> y no como viñeta automática de la lista
            para poder ponerlo al lado de la marca y no antes del renglón. */}
        <ol className="guia-checklist-fila">
          {guia.pasos.map((p) => (
            <li key={p.n} data-hecho={hechos.has(p.n) ? "si" : "no"}>
              <span className="guia-checklist-marca" aria-hidden="true">
                {hechos.has(p.n) ? "✓" : "○"}
              </span>
              <span className="guia-checklist-n" aria-hidden="true">
                {p.n}
              </span>
              {/* Un número suelto no dice nada leído en voz alta. Acá va lo
                  que se ve —el paso, su nombre y si está hecho— para quien
                  usa lector de pantalla. */}
              <span className="sr-only">
                {t.paso(p.n)}: {p.titulo}. {hechos.has(p.n) ? t.checklistHecho : t.checklistPendiente}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

/** Un paso del acordeón. El orden de composición es fijo y lo impone acá. */
function Paso({
  paso,
  total,
  hecho,
  abierto,
  onAbrir,
  onHecho,
}: {
  paso: PasoGuia;
  total: number;
  hecho: boolean;
  abierto: boolean;
  onAbrir: () => void;
  onHecho: () => void;
}) {
  const idCuerpo = `paso-${paso.n}-cuerpo`;

  return (
    <li className="guia-paso" data-hecho={hecho ? "si" : "no"} id={`paso-${paso.n}`}>
      <h3 className="guia-paso-cabeza">
        <button
          type="button"
          className="guia-paso-boton"
          onClick={onAbrir}
          aria-expanded={abierto}
          aria-controls={idCuerpo}
        >
          <span className="guia-paso-n mono">{t.deCuantos(paso.n, total)}</span>
          <span className="guia-paso-titulo">{paso.titulo}</span>
          <span className="guia-paso-resumen">{paso.resumen}</span>
          <span className="guia-paso-flecha" aria-hidden="true">
            {abierto ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div className="guia-paso-cuerpo" id={idCuerpo} hidden={!abierto}>
        {/* explicación → captura → video → advertencia, siempre en este orden */}
        {paso.cuerpo.map((c) => (
          <p key={c}>{c}</p>
        ))}

        {paso.capturas.map((c) => (
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

        <label className="guia-hecho">
          <input type="checkbox" checked={hecho} onChange={onHecho} />
          <span>{hecho ? t.desmarcar : t.hecho}</span>
        </label>
      </div>
    </li>
  );
}
