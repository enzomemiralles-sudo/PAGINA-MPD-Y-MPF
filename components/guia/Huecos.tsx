import Image from "next/image";
import type { Captura as TipoCaptura, Video as TipoVideo } from "@/lib/guia/tipos";
import { guia as t } from "@/content/guia";

/**
 * Los dos componentes de hueco: la captura y el video.
 *
 * Tres comportamientos, y el tercero es el que importa:
 *
 *  · con contenido, renderizan normal;
 *  · sin contenido y en preview, renderizan un recuadro punteado con el id y
 *    la descripción, para ver exactamente qué falta y dónde va;
 *  · sin contenido y en producción, no renderizan nada. Ni recuadro, ni
 *    «próximamente», ni un hueco en blanco. Es la regla del proyecto: una
 *    sección sin datos no existe.
 *
 * Lo decide NEXT_PUBLIC_MOSTRAR_PLACEHOLDERS, que se inlinea en el build. En
 * producción no está y el `=== "true"` da false, así que el default seguro no
 * depende de acordarse de nada.
 */
const MOSTRAR = process.env.NEXT_PUBLIC_MOSTRAR_PLACEHOLDERS === "true";

export function Captura({ id, descripcion, src }: TipoCaptura) {
  if (!src) {
    if (!MOSTRAR) return null;
    return (
      <figure className="hueco" data-que="captura">
        <span className="hueco-rotulo mono">{t.huecoCaptura}</span>
        <code className="hueco-id mono">{id}</code>
        <p className="hueco-que">{descripcion}</p>
      </figure>
    );
  }

  return (
    <figure className="guia-captura">
      <Image src={src} alt={descripcion} width={1400} height={900} sizes="(min-width: 900px) 46rem, 100vw" />
      <figcaption>{descripcion}</figcaption>
    </figure>
  );
}

export function VideoSlot({ id, titulo, youtubeId }: TipoVideo) {
  if (!youtubeId) {
    if (!MOSTRAR) return null;
    return (
      <div className="hueco" data-que="video">
        <span className="hueco-rotulo mono">{t.huecoVideo}</span>
        <code className="hueco-id mono">{id}</code>
        <p className="hueco-que">{titulo}</p>
      </div>
    );
  }

  return (
    <div className="guia-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={titulo}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <p className="guia-video-titulo">{titulo}</p>
    </div>
  );
}
