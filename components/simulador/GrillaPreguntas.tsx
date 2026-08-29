"use client";

import { rendir as t } from "@/content/simulador";

export type EstadoPregunta = "respondida" | "marcada" | "vacia";

/**
 * El navegador de preguntas, como el del examen real: se puede saltar a
 * cualquiera y se ve de un vistazo qué falta.
 *
 * Los estados no se distinguen sólo por color —el marcado lleva un punto y el
 * respondido va en negrita—, porque un examen que se navega por color deja
 * afuera a quien no distingue esos colores.
 */
export function GrillaPreguntas({
  estados,
  actual,
  ir,
}: {
  estados: readonly EstadoPregunta[];
  actual: number;
  ir: (i: number) => void;
}) {
  return (
    <nav className="rend-grilla" aria-label={t.navegador}>
      <ol>
        {estados.map((estado, i) => (
          <li key={i}>
            <button
              type="button"
              className={`rend-gq ${estado}${i === actual ? " act" : ""}`}
              onClick={() => ir(i)}
              aria-current={i === actual ? "true" : undefined}
              aria-label={t.posicion(i + 1, estados.length)}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
      <ul className="rend-leyenda">
        <li><i className="respondida" />{t.leyendaRespondida}</li>
        <li><i className="marcada" />{t.leyendaMarcada}</li>
        <li><i className="vacia" />{t.leyendaSinResponder}</li>
      </ul>
    </nav>
  );
}
