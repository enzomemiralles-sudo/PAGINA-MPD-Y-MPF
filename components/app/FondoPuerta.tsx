import Image from "next/image";
import { configDe } from "@/lib/marca/marcas";
import type { Marca } from "@/lib/marca/tokens";

/**
 * El fondo de la home de puerta: la facultad en perspectiva, virada al color
 * de la agrupación.
 *
 * La arquitectura de la imagen no se toca: la perspectiva es de la home de
 * cada puerta y la frontal de la pestaña pública. Una es tu mundo una vez que
 * elegiste; la otra es el lugar compartido de antes de elegir.
 *
 * Encima van tres capas del preview. El tinte son dos halos radiales en
 * `screen` que encienden el color de la puerta; el velo oscurece de izquierda
 * a derecha, que es lo que deja leer el texto sobre la zona oscura mientras la
 * columnata se abre hacia el otro lado; y el grano rompe el bandeado del
 * degradé. Ninguna se anima al scrollear.
 *
 * La foto nunca es el elemento LCP: eso lo es el saludo. Por eso no lleva
 * `priority` y sí `sizes`, para que en el teléfono no baje la versión de
 * escritorio.
 */
export function FondoPuerta({ marca }: { marca: Marca }) {
  const cfg = configDe(marca);
  if (!cfg) return null;

  return (
    <div className="portal-fondo" aria-hidden="true">
      <Image
        className="portal-foto"
        src={`/marca/facultad-perspectiva-${cfg.id}.jpg`}
        alt=""
        fill
        sizes="100vw"
        quality={72}
      />
      <div className="portal-tinte" />
      <div className="portal-velo" />
    </div>
  );
}
