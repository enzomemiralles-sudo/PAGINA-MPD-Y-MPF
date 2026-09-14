"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { caja as t, certezas, respuesta as tR } from "@/content/asistente";
import { preguntar, type Contestacion } from "@/lib/acciones/asistente";
import { useAsistente } from "@/components/asistente/estado";
import { Respuesta, Sello, Siguiente } from "@/components/asistente/Respuesta";
import { DejarConsulta } from "@/components/asistente/DejarConsulta";

/**
 * `useLayoutEffect` corre antes del pintado y `useEffect` después. Acá hace
 * falta el primero: con el segundo, la caja se ve un cuadro con el alto viejo
 * cada vez que crece, y eso a velocidad de tecleo tiembla. En el servidor no
 * corre ninguno y React avisa por consola si ve un efecto de layout durante el
 * render, de ahí el alias —el mismo que usa `AplicarPiel`—.
 */
const enElCuadro = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A-04, A-05 y el lugar donde aparece la respuesta.
 *
 * No es un chat con historial: cada consulta reemplaza a la anterior. Un hilo
 * invitaría a conversar, y esto no conversa —busca entre respuestas ya
 * escritas—. Mostrar una sola respuesta a la vez es también lo que hace que
 * el sello de certeza se lea, en vez de perderse entre burbujas.
 */
export function Caja() {
  const { ambito } = useAsistente();
  const id = useId();
  const campo = useRef<HTMLTextAreaElement>(null);
  const [texto, setTexto] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [salida, setSalida] = useState<Contestacion | null>(null);
  const [error, setError] = useState<"vacia" | "falla" | null>(null);

  /**
   * El alto de la caja sigue al contenido: crece sola a medida que se escribe
   * y vuelve a achicarse al borrar. El agarre para estirarla a mano se retiró
   * en el CSS —`resize: none`—; desacomodaba la pantalla y ya no hace falta.
   *
   * Va en un efecto y no en el `onChange` porque el texto también cambia desde
   * afuera, al tocar uno de los ejemplos, y ahí no hay tecleo que lo dispare.
   *
   * El `height = "auto"` de la primera línea no sobra: sin él `scrollHeight`
   * devuelve el alto que la caja ya tiene, así que crecería y nunca se
   * achicaría.
   *
   * El tope lo pone el `max-height` del CSS. Pasado ese punto la caja deja de
   * crecer y el texto scrollea adentro, que es lo que evita que una pregunta
   * larga se coma la pantalla.
   */
  enElCuadro(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [texto]);

  function enfocar() {
    campo.current?.focus();
    campo.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function buscar(consulta: string) {
    if (consulta.trim().length < 3) {
      setError("vacia");
      setSalida(null);
      return;
    }
    setBuscando(true);
    setError(null);
    try {
      setSalida(await preguntar(consulta, ambito));
    } catch {
      setError("falla");
      setSalida(null);
    } finally {
      setBuscando(false);
    }
  }

  function usarEjemplo(ejemplo: string) {
    setTexto(ejemplo);
    void buscar(ejemplo);
  }

  function deNuevo() {
    setSalida(null);
    setTexto("");
    setError(null);
    enfocar();
  }

  // Con «no estoy seguro» cada respuesta lleva su organismo a la vista: las
  // dos se muestran por separado y nunca combinadas (A-02).
  const etiquetar = ambito === "ambos";
  const sinRespuesta = salida !== null && salida.partes.every((p) => p.certeza === "sin_respuesta");

  return (
    <section className="asis-caja" id={t.ancla}>
      <p className="asis-caja-ayuda">{t.ayuda}</p>

      <form
        className="asis-form"
        onSubmit={(e) => {
          e.preventDefault();
          void buscar(texto);
        }}
      >
        <label className="asis-rotulo" htmlFor={`${id}-q`}>
          {t.rotulo}
        </label>
        <textarea
          id={`${id}-q`}
          ref={campo}
          rows={2}
          value={texto}
          placeholder={t.marcador}
          aria-invalid={error === "vacia"}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            // Enter manda; Shift+Enter hace un renglón. Es una pregunta, no
            // un texto largo: pedir que se llegue al botón es una fricción de
            // más, sobre todo en el teléfono.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void buscar(texto);
            }
          }}
        />
        <button className="btn btn-p" type="submit" disabled={buscando}>
          {buscando ? t.pensando : t.enviar}
        </button>
      </form>

      {error === "vacia" ? <p className="campo-error">{t.vacia}</p> : null}
      {error === "falla" ? (
        <p className="campo-error" role="alert">
          {t.falla}
        </p>
      ) : null}

      {salida === null ? (
        <div className="asis-ejemplos">
          <p className="asis-rotulo">{t.ejemplosRotulo}</p>
          <div className="asis-ejemplos-lista">
            {t.ejemplos.map((e) => (
              <button
                key={e}
                type="button"
                className="asis-ejemplo"
                onClick={() => usarEjemplo(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {salida !== null ? (
        <div className="asis-salida" aria-live="polite">
          <p className="asis-consulta">
            <span className="asis-rotulo">{tR.rotuloPregunta}</span>
            <span>{salida.consulta}</span>
          </p>

          {sinRespuesta ? (
            // A-07 rojo y A-08: no encontró, y no inventa nada para rellenar.
            <div className="asis-respuesta" data-certeza="sin_respuesta">
              <Sello certeza="sin_respuesta" />
              <p className="asis-respuesta-texto">{certezas.sin_respuesta.detalle}</p>
              <a className="btn btn-s" href="#normativa">
                {certezas.sin_respuesta.cta}
              </a>
              {/* A-12: el formulario aparece solo, acá, con la consulta ya
                  escrita. Volver a tipearla sería pedirle el trabajo dos
                  veces a quien ya no encontró lo que buscaba. */}
              <DejarConsulta consultaInicial={salida.consulta} origen="asistente" compacto />
            </div>
          ) : (
            salida.partes.map((p) => (
              <Respuesta key={p.organismo ?? p.entrada?.id} parte={p} mostrarOrganismo={etiquetar} />
            ))
          )}

          <Siguiente alPreguntarDeNuevo={deNuevo} />
        </div>
      ) : null}
    </section>
  );
}
