"use client";

import { useId } from "react";
import { selector as t } from "@/content/asistente";
import { useAsistente } from "@/components/asistente/estado";
import type { Ambito } from "@/lib/asistente/buscar";

/**
 * A-02. Va arriba de todo y no tiene estado neutro: siempre hay uno elegido.
 *
 * Son radios de verdad, no botones: se recorren con las flechas y el lector de
 * pantalla los anuncia como «1 de 3». El grupo se arma con role="radiogroup"
 * en lugar de <fieldset><legend>, porque el legend se planta encima del borde
 * del recuadro y, al sacarlo de ahí, empuja al costado a todo lo que venga
 * después. No vale la pena pelearse con eso: el rótulo enlazado dice lo mismo.
 */
export function Selector() {
  const { ambito, elegir } = useAsistente();
  const id = useId();

  return (
    <div className="asis-selector" role="radiogroup" aria-labelledby={`${id}-r`}>
      <p className="asis-selector-rotulo" id={`${id}-r`}>
        {t.rotulo}
      </p>
      <p className="asis-selector-ayuda">{t.ayuda}</p>

      <div className="asis-opciones">
        {t.opciones.map((o) => (
          <label key={o.valor} className="asis-opcion" data-elegida={ambito === o.valor}>
            <input
              type="radio"
              name="organismo"
              value={o.valor}
              checked={ambito === o.valor}
              onChange={() => elegir(o.valor as Ambito)}
            />
            <span className="asis-opcion-sigla">{o.sigla}</span>
            <span className="asis-opcion-nombre">{o.nombre}</span>
          </label>
        ))}
      </div>

      {ambito === "ambos" ? <p className="asis-selector-aviso">{t.avisoAmbos}</p> : null}
    </div>
  );
}
