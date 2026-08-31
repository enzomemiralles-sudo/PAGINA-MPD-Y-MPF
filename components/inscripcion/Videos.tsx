import { videos as t } from "@/content/inscripcion/textos";
import type { Video } from "@/lib/inscripcion/datos";
import type { Organismo } from "@/lib/inscripcion/tipos";

/**
 * I-06. La biblioteca de videos.
 *
 * Queda armada aunque no haya ninguno cargado: la sección no se dibuja
 * mientras la lista esté vacía, y aparece sola cuando se inserte la primera
 * fila en `videos`. Nada de un cartel de «próximamente».
 *
 * Los videos se muestran como enlaces con su miniatura y no incrustados: un
 * iframe de YouTube por video carga rastreadores de Google en una pantalla
 * donde la persona no vino a eso, y en el teléfono pesa una barbaridad.
 */
export function Videos({ videos, organismo }: { videos: Video[]; organismo: Organismo }) {
  const suyos = videos.filter((v) => v.organismo === organismo || v.organismo === null);
  if (suyos.length === 0) return null;

  return (
    <section className="ins-videos" id={`${organismo}-${t.ancla}`}>
      <h2 className="ins-titulo">{t.titulo}</h2>
      <p className="ins-bajada">{t.bajada}</p>

      <ul className="ins-videos-lista">
        {suyos.map((v) => (
          <li key={v.id}>
            <a
              className="ins-video"
              href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="ins-video-miniatura"
                src={`https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`}
                alt=""
                loading="lazy"
              />
              <span className="ins-video-titulo">{v.titulo}</span>
              <span className="ins-video-ver">{t.ver}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
