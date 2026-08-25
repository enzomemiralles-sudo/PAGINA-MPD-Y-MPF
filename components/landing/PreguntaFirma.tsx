"use client";

import { useState } from "react";
import { preguntaFirma as t } from "@/content/landing";
import { Vidrio } from "@/components/marca/Vidrio";

/**
 * La pregunta de muestra del hero. Son radio buttons reales dentro de un
 * fieldset con legend, no divs con onClick: se navega y se responde con teclado.
 */
export function PreguntaFirma({ preguntasRestantes }: { preguntasRestantes: number }) {
  const [elegida, setElegida] = useState<string | null>(null);
  const revelado = elegida !== null;
  const acerto = elegida === t.correcta;

  return (
    <section className="env">
      <Vidrio className="pregunta">
        <span className="eyebrow mono">{t.eyebrow}</span>
        <p className="enunciado">{t.enunciado}</p>

        <fieldset className="opciones" disabled={revelado}>
          <legend className="mono" style={{ color: "var(--papel-débil)", marginBottom: ".6rem" }}>
            {t.leyenda}
          </legend>

          {t.opciones.map((o) => {
            const clases = ["op"];
            if (revelado) {
              clases.push("bloq");
              if (o.id === t.correcta) clases.push("correcta");
              else if (o.id === elegida) clases.push("incorrecta");
            }
            return (
              <label key={o.id} className={clases.join(" ")}>
                <input
                  type="radio"
                  name="pregunta-firma"
                  value={o.id}
                  checked={elegida === o.id}
                  onChange={() => setElegida(o.id)}
                />
                <span className="letra" aria-hidden="true">
                  {o.id}
                </span>
                <span>{o.texto}</span>
              </label>
            );
          })}
        </fieldset>

        <div className={`revelado${revelado ? " on" : ""}`} aria-live="polite">
          <p className="veredicto" style={{ color: acerto ? "var(--ok)" : "var(--error)" }}>
            {revelado ? (acerto ? t.veredictoBien : t.veredictoMal) : ""}
          </p>
          <p style={{ fontSize: ".88rem", lineHeight: 1.55 }}>{t.explicacion}</p>
          <span className="cita mono">{t.cita}</span>
          <div>
            <a className="mas" href="#simulador">
              {t.masPlantilla(preguntasRestantes)}
            </a>
          </div>
        </div>
      </Vidrio>
    </section>
  );
}
