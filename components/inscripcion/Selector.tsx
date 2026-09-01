"use client";

import { useId } from "react";
import { selector as t } from "@/content/inscripcion/textos";
import { useInscripcion } from "@/components/inscripcion/contexto";
import type { Organismo } from "@/lib/inscripcion/tipos";

/**
 * I-02. El selector de concurso.
 *
 * No se dibuja cuando hay una sola guía cargada: un selector de una opción no
 * es un selector, es un rótulo que no hace nada. Aparece solo el día que
 * exista la guía del MPF, sin tocar código.
 */
export function Selector({ opciones }: { opciones: { org: Organismo; sigla: string; nombre: string }[] }) {
  const { org, elegir } = useInscripcion();
  const id = useId();

  if (opciones.length < 2) return null;

  return (
    <div className="ins-selector" role="radiogroup" aria-labelledby={`${id}-r`}>
      <p className="ins-selector-rotulo" id={`${id}-r`}>
        {t.rotulo}
      </p>
      <p className="ins-selector-ayuda">{t.ayuda}</p>

      <div className="ins-opciones">
        {opciones.map((o) => (
          <label key={o.org} className="ins-opcion" data-elegida={org === o.org}>
            <input
              type="radio"
              name="concurso"
              value={o.org}
              checked={org === o.org}
              onChange={() => elegir(o.org)}
            />
            <span className="ins-opcion-sigla">{o.sigla}</span>
            <span className="ins-opcion-nombre">{o.nombre}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
