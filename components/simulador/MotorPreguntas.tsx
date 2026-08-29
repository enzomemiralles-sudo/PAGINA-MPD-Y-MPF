"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { rendir as t } from "@/content/simulador";
import { entregar, guardarRespuesta } from "@/lib/acciones/simulador";
import type { Intento } from "@/lib/simulador/datos";
import { Cronometro } from "@/components/simulador/Cronometro";
import { GrillaPreguntas, type EstadoPregunta } from "@/components/simulador/GrillaPreguntas";

type Marca = { respuesta: string | null; marcada: boolean };

/**
 * El examen de opción múltiple. Sirve al teórico de los dos organismos y al
 * práctico del MPF: los tres se responden igual, y lo que cambia —duración,
 * cuántas trae, cuánto descuenta— sale de la fila de `exams`.
 *
 * Se guarda en cada cambio, con un respiro de medio segundo para no escribir
 * una vez por tecla. Si se corta la luz se pierde, como mucho, la última
 * respuesta.
 */
export function MotorPreguntas({
  intento,
  segundos,
}: {
  intento: Intento;
  segundos: number;
}) {
  const router = useRouter();
  const [actual, setActual] = useState(0);
  const [marcas, setMarcas] = useState<Record<string, Marca>>(() =>
    Object.fromEntries(
      intento.respuestas.map((r) => [r.questionId, { respuesta: r.respuesta, marcada: r.marcada }]),
    ),
  );
  const [guardando, setGuardando] = useState<"quieto" | "guardando" | "guardado" | "error">("quieto");
  const [confirmando, setConfirmando] = useState(false);
  const [entregando, setEntregando] = useState(false);
  const [expiro, setExpiro] = useState(false);

  const pendientes = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const entregada = useRef(false);

  const preguntas = intento.preguntas;
  const pregunta = preguntas[actual];

  const guardar = useCallback(
    (preguntaId: string, marca: Marca) => {
      const anterior = pendientes.current.get(preguntaId);
      if (anterior) clearTimeout(anterior);
      setGuardando("guardando");
      pendientes.current.set(
        preguntaId,
        setTimeout(async () => {
          const r = await guardarRespuesta(intento.id, preguntaId, marca.respuesta, marca.marcada);
          setGuardando(r.ok ? "guardado" : "error");
        }, 500),
      );
    },
    [intento.id],
  );

  function responder(preguntaId: string, respuesta: string) {
    const previa = marcas[preguntaId] ?? { respuesta: null, marcada: false };
    // Volver a tocar la opción elegida la desmarca: dejar en blanco descuenta
    // menos que errar, así que tiene que poderse deshacer.
    const marca = { ...previa, respuesta: previa.respuesta === respuesta ? null : respuesta };
    setMarcas((m) => ({ ...m, [preguntaId]: marca }));
    guardar(preguntaId, marca);
  }

  function alternarMarcada(preguntaId: string) {
    const previa = marcas[preguntaId] ?? { respuesta: null, marcada: false };
    const marca = { ...previa, marcada: !previa.marcada };
    setMarcas((m) => ({ ...m, [preguntaId]: marca }));
    guardar(preguntaId, marca);
  }

  const cerrar = useCallback(async () => {
    if (entregada.current) return;
    entregada.current = true;
    setEntregando(true);
    // Lo que quedó en el debounce se escribe antes de corregir: sin esto, la
    // última respuesta se pierde justo cuando más importa.
    for (const [id, tarea] of pendientes.current) {
      clearTimeout(tarea);
      const m = marcas[id];
      if (m) await guardarRespuesta(intento.id, id, m.respuesta, m.marcada);
    }
    pendientes.current.clear();

    const r = await entregar(intento.id);
    if (r.ok) {
      router.push(`/simulador/resultado/${intento.id}`);
      return;
    }
    entregada.current = false;
    setEntregando(false);
    setConfirmando(false);
    setGuardando("error");
  }, [intento.id, marcas, router]);

  const seAcaboElTiempo = useCallback(() => {
    setExpiro(true);
    void cerrar();
  }, [cerrar]);

  useEffect(() => {
    const tareas = pendientes.current;
    return () => {
      for (const tarea of tareas.values()) clearTimeout(tarea);
    };
  }, []);

  const estados: EstadoPregunta[] = useMemo(
    () =>
      preguntas.map((p) => {
        const m = marcas[p.id];
        if (m?.marcada) return "marcada";
        return m?.respuesta ? "respondida" : "vacia";
      }),
    [preguntas, marcas],
  );

  const sinResponder = estados.filter((_, i) => !marcas[preguntas[i]!.id]?.respuesta).length;

  if (!pregunta) return null;
  const marca = marcas[pregunta.id] ?? { respuesta: null, marcada: false };

  return (
    <div className="rend">
      <header className="rend-barra">
        <p className="rend-pos mono">{t.posicion(actual + 1, preguntas.length)}</p>
        <Cronometro segundos={segundos} onFin={seAcaboElTiempo} />
      </header>

      {expiro ? (
        <p className="rend-expiro" role="status">
          {t.seAcabo}
        </p>
      ) : null}

      <article className="rend-pregunta tarjeta-app">
        <h2 className="rend-enunciado">{pregunta.enunciado}</h2>

        <ul className="rend-opciones">
          {pregunta.opciones.map((o) => (
            <li key={o.clave}>
              <button
                type="button"
                className={`rend-op${marca.respuesta === o.clave ? " elegida" : ""}`}
                onClick={() => responder(pregunta.id, o.clave)}
                aria-pressed={marca.respuesta === o.clave}
              >
                <span className="rend-op-clave mono">{o.clave}</span>
                <span className="rend-op-texto">{o.texto}</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`rend-marcar${marca.marcada ? " si" : ""}`}
          onClick={() => alternarMarcada(pregunta.id)}
          aria-pressed={marca.marcada}
        >
          {marca.marcada ? t.marcada : t.marcar}
        </button>
      </article>

      <div className="rend-pasos">
        <button
          type="button"
          className="btn btn-s"
          onClick={() => setActual((i) => Math.max(0, i - 1))}
          disabled={actual === 0}
        >
          {t.anterior}
        </button>
        <span className="rend-estado" aria-live="polite">
          {guardando === "guardando" ? t.guardando : null}
          {guardando === "guardado" ? t.guardado : null}
          {guardando === "error" ? t.sinGuardar : null}
        </span>
        <button
          type="button"
          className="btn btn-s"
          onClick={() => setActual((i) => Math.min(preguntas.length - 1, i + 1))}
          disabled={actual === preguntas.length - 1}
        >
          {t.siguiente}
        </button>
      </div>

      <GrillaPreguntas estados={estados} actual={actual} ir={setActual} />

      {confirmando ? (
        <div className="rend-confirmar tarjeta-app" role="alertdialog" aria-label={t.confirmarTitulo}>
          <p className="rend-confirmar-titulo">{t.confirmarTitulo}</p>
          <p className="rend-confirmar-texto">
            {sinResponder === 0 ? t.confirmarTodo : t.confirmarSinResponder(sinResponder)}
          </p>
          <div className="rend-confirmar-botones">
            <button className="btn btn-p" type="button" onClick={cerrar} disabled={entregando}>
              {entregando ? t.entregando : t.confirmarSi}
            </button>
            <button
              className="btn btn-s"
              type="button"
              onClick={() => setConfirmando(false)}
              disabled={entregando}
            >
              {t.confirmarNo}
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-p rend-entregar"
          type="button"
          onClick={() => setConfirmando(true)}
          disabled={entregando}
        >
          {entregando ? t.entregando : t.entregar}
        </button>
      )}
    </div>
  );
}
