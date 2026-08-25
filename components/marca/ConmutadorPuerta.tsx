"use client";

import { conmutador } from "@/content/landing";
import { useMarca } from "./MarcaProvider";
import type { Marca } from "@/lib/marca/tokens";

export function ConmutadorPuerta() {
  const { marca, cambiar } = useMarca();

  return (
    <div className="puertas" role="group" aria-label={conmutador.ayuda}>
      <span className="lbl">{conmutador.etiqueta}</span>
      {conmutador.opciones.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={marca === o.id}
          onClick={() => cambiar(o.id as Marca)}
        >
          <span className="txt-largo">{o.texto}</span>
          <span className="txt-corto">{o.abrev}</span>
        </button>
      ))}
    </div>
  );
}
