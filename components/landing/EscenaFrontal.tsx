import Image from "next/image";
import { MARCAS_CONFIG } from "@/lib/marca/marcas";

/**
 * La escena del hero de la pestaña pública: la facultad de frente.
 *
 * Es la foto FRONTAL, no la de perspectiva. La arquitectura de imagen del
 * proyecto no se toca: de frente y simétrica en la pestaña pública, en fuga en
 * la home de cada puerta. Una es el lugar compartido de antes de elegir; la
 * otra, el mundo de adentro.
 *
 * El preview cruza las dos capas por `data-marca` y muestra una sola. Acá hay
 * un tercer estado que el preview no tiene y que en producción es el único que
 * se ve: la pestaña pública es `dual` —nadie eligió puerta todavía— y ahí el
 * preview no mostraría ninguna. Así que en dual se muestran las dos, partidas
 * al medio: verde a la izquierda, azul a la derecha. El corte cae sobre el eje
 * de simetría de la fachada, que es justo para lo que sirve esta foto y no la
 * otra, así que se lee como un edificio iluminado desde dos lados y no como
 * dos fotos pegadas. Es, literalmente, las dos marcas conviviendo.
 *
 * Ninguna capa lleva `priority`: el elemento LCP es el titular.
 */
export function EscenaFrontal() {
  return (
    <div className="escena" aria-hidden="true">
      {Object.values(MARCAS_CONFIG).map((cfg) => (
        <div className="escena-capa" data-de={cfg.id} key={cfg.id}>
          <Image
            src={`/marca/facultad-frontal-${cfg.id}.jpg`}
            alt=""
            fill
            sizes="100vw"
            quality={72}
          />
        </div>
      ))}
      <div className="escena-velo" />
    </div>
  );
}
