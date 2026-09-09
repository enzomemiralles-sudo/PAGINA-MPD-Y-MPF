import type { Advertencia as Tipo } from "@/lib/guia/tipos";
import { guia as t } from "@/content/guia";

/**
 * Una advertencia.
 *
 * Componente propio y no un párrafo en negrita: en un instructivo largo la
 * negrita se lee como énfasis y esto es una alarma. Lleva marco y un signo,
 * así que se distingue del cuerpo aunque no se distinga el color —que es la
 * condición para que sirva en escala de grises y para quien no ve el rojo.
 *
 * Las de peso alto van sin rótulo. Decían «OJO» arriba del texto y era una
 * palabra de más: el marco rojo y el signo ya avisan, y el texto empieza con
 * su propio titular. Las de peso medio conservan «Tené en cuenta», que sí
 * agrega algo —marcan que es un dato a considerar, no un error que deja
 * afuera—.
 *
 * El color es semántico y no de marca: el mismo en las cuatro pieles.
 */
export function Advertencia({ peso, texto }: Tipo) {
  return (
    <p className="adv" data-peso={peso}>
      <span className="adv-signo" aria-hidden="true">
        !
      </span>
      {peso === "media" ? <span className="adv-rotulo mono">{t.tenerEnCuenta}</span> : null}
      <span className="adv-texto">{texto}</span>
    </p>
  );
}
