"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { rendir as tr, tipeo as t } from "@/content/simulador";
import { entregar, guardarRespuesta } from "@/lib/acciones/simulador";
import { compararTipeo, erroresHastaAca } from "@/lib/simulador/tipeo";
import type { Intento } from "@/lib/simulador/datos";
import { Cronometro } from "@/components/simulador/Cronometro";

/**
 * El práctico de tipeo del MPD.
 *
 * No es un cuestionario: se copia un texto y se mide la precisión. El conteo
 * en vivo se hace acá porque el texto original está a la vista —es lo que hay
 * que copiar—, así que mostrarlo no revela nada. El puntaje que queda
 * guardado igual lo calcula el servidor, con el mismo cálculo.
 *
 * Está esbozado a propósito: la metodología oficial no está confirmada. Lo que
 * falta y por qué está en PLAN-SIMULADOR.md §6, y el supuesto se muestra en
 * pantalla en vez de esconderse.
 */
export function MotorTipeo({ intento, segundos }: { intento: Intento; segundos: number }) {
  const router = useRouter();
  const pregunta = intento.preguntas[0];
  const guardada = intento.respuestas[0];

  const [escrito, setEscrito] = useState(guardada?.respuesta ?? "");
  const [entregando, setEntregando] = useState(false);
  const [expiro, setExpiro] = useState(false);
  const pendiente = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entregada = useRef(false);
  const ultimo = useRef(escrito);

  const original = pregunta?.enunciado ?? "";
  const comparacion = useMemo(() => compararTipeo(original, escrito), [original, escrito]);
  // Durante el examen se cuentan los errores cometidos, no los caracteres que
  // faltan. Al entregar, el servidor cuenta el texto entero: lo que quedó sin
  // escribir también descuenta, y el aviso de abajo lo dice.
  const errores = useMemo(() => erroresHastaAca(original, escrito), [original, escrito]);

  function escribir(texto: string) {
    setEscrito(texto);
    ultimo.current = texto;
    if (pendiente.current) clearTimeout(pendiente.current);
    if (!pregunta) return;
    pendiente.current = setTimeout(() => {
      void guardarRespuesta(intento.id, pregunta.id, texto, false);
    }, 700);
  }

  const cerrar = useCallback(async () => {
    if (entregada.current || !pregunta) return;
    entregada.current = true;
    setEntregando(true);
    if (pendiente.current) clearTimeout(pendiente.current);
    await guardarRespuesta(intento.id, pregunta.id, ultimo.current, false);

    const r = await entregar(intento.id);
    if (r.ok) {
      router.push(`/simulador/resultado/${intento.id}`);
      return;
    }
    entregada.current = false;
    setEntregando(false);
  }, [intento.id, pregunta, router]);

  const seAcaboElTiempo = useCallback(() => {
    setExpiro(true);
    void cerrar();
  }, [cerrar]);

  useEffect(() => () => {
    if (pendiente.current) clearTimeout(pendiente.current);
  }, []);

  if (!pregunta) return null;

  return (
    <div className="rend tip">
      <header className="rend-barra">
        <p className="rend-pos mono">{t.titulo}</p>
        <Cronometro segundos={segundos} onFin={seAcaboElTiempo} />
      </header>

      {expiro ? (
        <p className="rend-expiro" role="status">
          {tr.seAcabo}
        </p>
      ) : null}

      <p className="tip-consigna">{t.consigna}</p>

      <div className="tip-columnas">
        <section className="tip-original tarjeta-app">
          <h2 className="tip-rotulo mono">{t.original}</h2>
          <div className="tip-texto">{original}</div>
        </section>

        <section className="tip-escribir tarjeta-app">
          <h2 className="tip-rotulo mono">{t.tuTexto}</h2>
          <textarea
            className="tip-area"
            value={escrito}
            onChange={(e) => escribir(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-label={t.tuTexto}
          />
        </section>
      </div>

      <div className="tip-medidas">
        <div>
          <span className="tip-medida-rotulo mono">{t.avance}</span>
          <span className="tip-medida">{Math.round(comparacion.avance * 100)}%</span>
        </div>
        <div>
          <span className="tip-medida-rotulo mono">{t.erroresRotulo}</span>
          <span className={`tip-medida${errores > 0 ? " mal" : ""}`}>{errores}</span>
        </div>
      </div>
      <div className="tip-barra" aria-hidden="true">
        <i style={{ width: `${Math.round(comparacion.avance * 100)}%` }} />
      </div>

      <button className="btn btn-p rend-entregar" type="button" onClick={cerrar} disabled={entregando}>
        {entregando ? tr.entregando : t.entregar}
      </button>

      <div className="tip-supuesto">
        <p>{t.faltante}</p>
        <p>{t.supuesto}</p>
        <p>{t.formato}</p>
      </div>
    </div>
  );
}
