import type { Advertencia as Tipo } from "@/lib/guia/tipos";

/**
 * Una advertencia.
 *
 * Componente propio y no un párrafo en negrita: en un instructivo largo la
 * negrita se lee como énfasis y esto es una alarma. Lleva marco y un signo,
 * así que se distingue del cuerpo aunque no se distinga el color —que es la
 * condición para que sirva en escala de grises y para quien no ve el rojo.
 *
 * Sin rótulo. Decían «OJO» las graves y «Tené en cuenta» las medias, arriba
 * del texto, y era una línea de más en las dos: el marco y el signo ya avisan
 * que es una advertencia, el color y el grosor del marco ya distinguen la
 * grave de la media, y el texto empieza con su propio titular.
 *
 * El color es semántico y no de marca: el mismo en las cuatro pieles.
 */
export function Advertencia({ peso, texto }: Tipo) {
  return (
    <p className="adv" data-peso={peso}>
      <span className="adv-signo" aria-hidden="true">
        !
      </span>
      <span className="adv-texto">{texto}</span>
    </p>
  );
}
