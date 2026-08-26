"use client";

import { useId } from "react";
import { modal as t, type Campo } from "@/content/onboarding";

/**
 * Los campos del perfil. Los usan el modal y «Mi perfil», así que viven acá y
 * no duplicados en los dos lugares.
 *
 * «opcional» va visible al lado de la etiqueta, no escondido en un tooltip.
 */
export function CamposPerfil({
  campos,
  valores,
  onCambio,
  org,
  deshabilitado = false,
}: {
  campos: Campo[];
  valores: Record<string, string>;
  onCambio: (nombre: string, valor: string) => void;
  org: string;
  deshabilitado?: boolean;
}) {
  const base = useId();

  return (
    <div className="campos-perfil">
      {campos.map((c) => {
        const id = `${base}-${c.nombre}`;
        const etiqueta = c.plantilla ? c.etiqueta.replace("{org}", org) : c.etiqueta;
        const valor = valores[c.nombre] ?? "";

        return (
          <div className="campo" key={c.nombre}>
            <label htmlFor={id}>
              {etiqueta}
              {c.opcional ? <span className="opcional"> · {t.opcional}</span> : null}
            </label>

            {c.tipo === "opciones" ? (
              <select
                id={id}
                value={valor}
                onChange={(e) => onCambio(c.nombre, e.target.value)}
                disabled={deshabilitado}
              >
                <option value="">Elegí una opción</option>
                {c.opciones?.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.texto}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                type={c.tipo === "numero" ? "number" : "text"}
                inputMode={c.tipo === "numero" ? "numeric" : undefined}
                min={c.tipo === "numero" ? 1950 : undefined}
                max={c.tipo === "numero" ? 2100 : undefined}
                value={valor}
                onChange={(e) => onCambio(c.nombre, e.target.value)}
                disabled={deshabilitado}
                autoComplete={c.nombre === "telefono" ? "tel" : "off"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
