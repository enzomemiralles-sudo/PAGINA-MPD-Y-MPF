import type { Advertencia as Tipo } from "@/lib/guia/tipos";
import { guia as t } from "@/content/guia";

/**
 * Una advertencia.
 *
 * Componente propio y no un párrafo en negrita: en un instructivo largo la
 * negrita se lee como énfasis y esto es una alarma. Lleva marco, rótulo y un
 * signo, así que se distingue del cuerpo aunque no se distinga el color —que
 * es la condición para que sirva en escala de grises y para quien no ve el
 * rojo.
 *
 * El color es semántico y no de marca: el mismo en las cuatro pieles.
 */
export function Advertencia({ peso, texto }: Tipo) {
  return (
    <p className="adv" data-peso={peso}>
      <span className="adv-signo" aria-hidden="true">
        !
      </span>
      <span className="adv-rotulo mono">{peso === "alta" ? t.ojo : t.tenerEnCuenta}</span>
      <span className="adv-texto">{texto}</span>
    </p>
  );
}
