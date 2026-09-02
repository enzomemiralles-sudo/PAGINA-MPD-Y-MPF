"use client";

import { useId } from "react";
import type { Pregunta } from "@/lib/guia/tipos";

/**
 * El ⑧, en acordeón.
 *
 * `<details>` nativo y no estado de React: son preguntas independientes, se
 * pueden abrir varias a la vez, funcionan sin JavaScript y el navegador ya
 * resuelve el teclado y el anuncio de expandido/colapsado.
 */
export function Preguntas({ preguntas }: { preguntas: readonly Pregunta[] }) {
  const base = useId();
  return (
    <div className="guia-faq">
      {preguntas.map((p) => (
        <details key={p.pregunta} name={base}>
          <summary>{p.pregunta}</summary>
          <p>{p.respuesta}</p>
        </details>
      ))}
    </div>
  );
}
