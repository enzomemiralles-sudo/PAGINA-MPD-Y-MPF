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

  const documentacion = guia.antes?.documentacion ?? [];
  const faltan = total - hechos.size;

  return (
    <>
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

      {/* ⑨ El checklist final */}
      <section className="guia-seccion" id="checklist">
        <h2 className="guia-seccion-titulo">{t.secciones.checklist}</h2>
        <p className="guia-bajada">{t.checklistBajada}</p>

        <div className="guia-checklist">
          {documentacion.length > 0 ? (
            <div>
              <h3 className="guia-checklist-titulo mono">{t.documentacion}</h3>
              <ul>
                {documentacion.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h3 className="guia-checklist-titulo mono">{t.losPasos}</h3>
            <ul>
              {guia.pasos.map((p) => (
                <li key={p.n} data-hecho={hechos.has(p.n) ? "si" : "no"}>
                  <span aria-hidden="true">{hechos.has(p.n) ? "✓" : "○"}</span>
                  {p.titulo}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="guia-faltan" aria-live="polite">
          {cargado ? (faltan === 0 ? t.completo : t.faltan(faltan)) : null}
        </p>

        <button type="button" className="btn btn-s" onClick={() => window.print()}>
          {t.imprimir}
        </button>
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
