"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { revision as t, TEMAS } from "@/content/revision";
import { aprobar, frenar, siguiente } from "@/lib/acciones/revision";
import type { Cola, Filtro, PreguntaARevisar } from "@/lib/revision/datos";

type Estado = "quieto" | "guardando" | "error";

export function Revisor({ inicial }: { inicial: Cola }) {
  const [cola, setCola] = useState(inicial);
  const [filtro, setFiltro] = useState<Filtro>({});
  const [saltadas, setSaltadas] = useState<string[]>([]);
  const [estado, setEstado] = useState<Estado>("quieto");
  const [respuesta, setRespuesta] = useState("");
  const [tema, setTema] = useState("");
  const [otroTema, setOtroTema] = useState("");
  const [nota, setNota] = useState("");
  const [frenando, setFrenando] = useState(false);

  const pregunta = cola.pregunta;
  // «hay» y sin pregunta no debería pasar; si pasa, el cartel neutro es el
  // único que no afirma algo falso.
  const vacio = cola.estado === "hay" ? t.vacio.todo_revisado : t.vacio[cola.estado];

  // Cada pregunta arranca con lo que traía cargado. Cambiarlo es la excepción,
  // no el trámite: si hubiera que elegir todo de cero en cada una, revisar 259
  // dejaría de ser viable.
  useEffect(() => {
    setRespuesta(pregunta?.respuestaCorrecta ?? "");
    setTema(pregunta?.tema ?? "");
    setOtroTema("");
    setNota("");
    setFrenando(false);
  }, [pregunta]);

  const temaFinal = tema === "__otro__" ? otroTema.trim() : tema;

  const aplicar = useCallback((r: { ok: boolean; cola?: Cola }) => {
    if (r.ok && r.cola) {
      setCola(r.cola);
      setEstado("quieto");
      return;
    }
    setEstado("error");
  }, []);

  const confirmar = useCallback(async () => {
    if (!pregunta || !respuesta || !temaFinal || estado === "guardando") return;
    setEstado("guardando");
    aplicar(
      await aprobar({ id: pregunta.id, respuesta, tema: temaFinal, filtro, saltadas }),
    );
  }, [pregunta, respuesta, temaFinal, estado, filtro, saltadas, aplicar]);

  const saltar = useCallback(async () => {
    if (!pregunta || estado === "guardando") return;
    const nuevas = [...saltadas, pregunta.id];
    setSaltadas(nuevas);
    setEstado("guardando");
    aplicar(await siguiente({ filtro, saltadas: nuevas }));
  }, [pregunta, estado, filtro, saltadas, aplicar]);

  async function detener() {
    if (!pregunta || nota.trim().length < 3) return;
    setEstado("guardando");
    aplicar(await frenar({ id: pregunta.id, nota, filtro, saltadas }));
  }

  async function cambiarFiltro(f: Filtro) {
    setFiltro(f);
    setSaltadas([]);
    setEstado("guardando");
    aplicar(await siguiente({ filtro: f, saltadas: [] }));
  }

  // Los atajos son la diferencia entre revisar el banco y no revisarlo. No se
  // activan si el foco está en un campo de texto: ahí las teclas son letras.
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      const destino = e.target as HTMLElement | null;
      if (destino && /^(INPUT|TEXTAREA|SELECT)$/.test(destino.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const opciones = pregunta?.opciones ?? [];
      const n = Number.parseInt(e.key, 10);
      if (n >= 1 && n <= opciones.length) {
        e.preventDefault();
        setRespuesta(opciones[n - 1]!.clave);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        void confirmar();
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saltar();
      }
    }
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [pregunta, confirmar, saltar]);

  return (
    <div className="rev-caja" ref={caja}>
      <header className="rev-cabeza">
        <div>
          <h1>{t.titulo}</h1>
          <p className="rev-bajada">{t.bajada}</p>
        </div>
        <p className="rev-progreso mono">{t.progreso(cola.pendientes, cola.revisadas)}</p>
      </header>

      <div className="rev-filtros">
        <span className="rev-filtro-rotulo mono">{t.filtros.titulo}</span>
        <Chip activo={!filtro.organismo} al={() => cambiarFiltro({ ...filtro, organismo: undefined })}>
          {t.filtros.todos}
        </Chip>
        {(["mpd", "mpf"] as const).map((o) => (
          <Chip key={o} activo={filtro.organismo === o} al={() => cambiarFiltro({ ...filtro, organismo: o })}>
            {t.filtros.organismo[o]}
          </Chip>
        ))}
        <span className="rev-sep" aria-hidden="true" />
        <Chip activo={!filtro.confianza} al={() => cambiarFiltro({ ...filtro, confianza: undefined })}>
          {t.filtros.todos}
        </Chip>
        {(["alta", "media", "baja"] as const).map((c) => (
          <Chip key={c} activo={filtro.confianza === c} al={() => cambiarFiltro({ ...filtro, confianza: c })}>
            {t.filtros.confianza[c]}
          </Chip>
        ))}
      </div>

      {!pregunta ? (
        <section className="rev-vacio tarjeta-app">
          <p className="rev-vacio-titulo">{vacio.titulo}</p>
          <p>{vacio.texto}</p>
        </section>
      ) : (
        <>
          <article className="rev-pregunta tarjeta-app">
            <div className="rev-meta mono">
              <span>{pregunta.organismo.toUpperCase()}</span>
              <span>
                {t.pregunta.orden} {pregunta.orden}
              </span>
              <span>
                {t.pregunta.fuente}: {pregunta.fuente ?? "—"}
              </span>
              <span className={`rev-confianza ${pregunta.confianza}`}>
                {t.pregunta.confianza}: {pregunta.confianza}
              </span>
            </div>

            <h2 className="rev-enunciado">{pregunta.enunciado}</h2>

            {pregunta.opciones.length > 0 ? (
              <>
                <p className="rev-rotulo">{t.pregunta.respuesta}</p>
                <ul className="rev-opciones">
                  {pregunta.opciones.map((o, i) => (
                    <li key={o.clave}>
                      <button
                        type="button"
                        className={`rev-op${respuesta === o.clave ? " elegida" : ""}`}
                        onClick={() => setRespuesta(o.clave)}
                        aria-pressed={respuesta === o.clave}
                      >
                        <span className="rev-op-tecla mono">{i + 1}</span>
                        <span className="rev-op-clave mono">{o.clave}</span>
                        <span>{o.texto}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="rev-ayuda">{t.pregunta.respuestaAyuda}</p>
              </>
            ) : null}

            <div className="rev-tema">
              <label className="rev-rotulo" htmlFor="rev-tema">
                {t.pregunta.tema}
              </label>
              <select
                id="rev-tema"
                value={tema === "" ? "" : TEMAS[pregunta.organismo].includes(tema as never) ? tema : "__otro__"}
                onChange={(e) => {
                  setTema(e.target.value);
                  if (e.target.value !== "__otro__") setOtroTema("");
                }}
              >
                <option value="" disabled>
                  —
                </option>
                {TEMAS[pregunta.organismo].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
                <option value="__otro__">{t.pregunta.temaOtro}</option>
              </select>
              {tema === "__otro__" ? (
                <input
                  type="text"
                  value={otroTema}
                  onChange={(e) => setOtroTema(e.target.value)}
                  aria-label={t.pregunta.temaOtro}
                />
              ) : null}
              <p className="rev-ayuda">{t.pregunta.temaAyuda}</p>
            </div>

            {pregunta.notaRevision ? (
              <p className="rev-nota-previa">{pregunta.notaRevision}</p>
            ) : null}
          </article>

          {frenando ? (
            <div className="rev-frenar tarjeta-app">
              <label className="rev-rotulo" htmlFor="rev-nota">
                {t.pregunta.nota}
              </label>
              <textarea
                id="rev-nota"
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder={t.pregunta.notaAyuda}
              />
              <div className="rev-acciones">
                <button
                  className="btn btn-p"
                  type="button"
                  onClick={detener}
                  disabled={estado === "guardando" || nota.trim().length < 3}
                >
                  {estado === "guardando" ? t.acciones.frenando : t.acciones.frenar}
                </button>
                <button className="btn btn-s" type="button" onClick={() => setFrenando(false)}>
                  {t.acciones.saltar}
                </button>
              </div>
            </div>
          ) : (
            <div className="rev-acciones">
              <button
                className="btn btn-p"
                type="button"
                onClick={confirmar}
                disabled={estado === "guardando" || !respuesta || !temaFinal}
              >
                {estado === "guardando" ? t.acciones.aprobando : t.acciones.aprobar}
              </button>
              <button className="btn btn-s" type="button" onClick={saltar} disabled={estado === "guardando"}>
                {t.acciones.saltar}
              </button>
              <button className="btn btn-s" type="button" onClick={() => setFrenando(true)}>
                {t.acciones.frenar}
              </button>
            </div>
          )}

          {estado === "error" ? (
            <p className="auth-error" role="alert">
              {t.acciones.error}
            </p>
          ) : null}

          <ul className="rev-atajos">
            {t.atajos.lista.map((a) => (
              <li key={a.tecla}>
                <kbd>{a.tecla}</kbd> {a.que}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Chip({
  activo,
  al,
  children,
}: {
  activo: boolean;
  al: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={`rev-chip${activo ? " act" : ""}`} onClick={al} aria-pressed={activo}>
      {children}
    </button>
  );
}
