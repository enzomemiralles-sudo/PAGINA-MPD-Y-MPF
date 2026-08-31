import type { Metadata } from "next";
import Link from "next/link";
import { cierre, encabezado } from "@/content/inscripcion/textos";
import { guiasCargadas } from "@/lib/inscripcion/guias";
import { traerVideos } from "@/lib/inscripcion/datos";
import { traerConcursos } from "@/lib/datos";
import { Marco } from "@/components/inscripcion/contexto";
import { Selector } from "@/components/inscripcion/Selector";
import { Guia } from "@/components/inscripcion/Guia";

export const metadata: Metadata = {
  title: "Inscribite sin perderte — Nexo Derecho × Nueva Abogacía",
};
export const dynamic = "force-dynamic";

/**
 * La pestaña de inscripción.
 *
 * Es el manual de Nexo traducido a pasos que se pueden ir siguiendo, no
 * transcripto: el instructivo va separado del consejo, y las trampas —lo que
 * hace perder el turno y no está escrito en ningún lado oficial— salen del
 * cuerpo del texto y tienen tratamiento propio, arriba y de nuevo en el paso
 * donde importan.
 *
 * I-08: la estructura es una sola, en <Guia>. El MPD y el MPF no son dos
 * páginas parecidas, son ese componente con distintos datos. Hoy sólo existe
 * el manual del MPD, así que la del MPF no se dibuja y el selector tampoco:
 * un selector de una opción no es un selector. Las dos aparecen solas el día
 * que se cargue el material, sin tocar maquetado.
 */
export default async function Inscripcion() {
  const guias = guiasCargadas();
  const [videos, concursos] = await Promise.all([traerVideos(), traerConcursos()]);

  // Ninguna guía cargada: la pestaña no tendría qué mostrar. No debería pasar
  // —el MPD está cargado— pero el 404 es mejor que una pantalla vacía.
  const primera = guias[0];
  if (!primera) return null;

  return (
    <main className="env app-cuerpo">
      <Marco inicial={primera.organismo}>
        <header className="ins-encabezado">
          <h1>{encabezado.titulo}</h1>
          <p className="ins-bajada-fuerte">{encabezado.bajada}</p>
          <p className="ins-parrafo">{encabezado.parrafo}</p>
        </header>

        <Selector
          opciones={guias.map((g) => ({ org: g.organismo, sigla: g.sigla, nombre: g.nombre }))}
        />

        {guias.map((g) => (
          <Guia
            key={g.organismo}
            guia={g}
            concurso={concursos.find((c) => c.organismo === g.organismo) ?? null}
            videos={videos}
          />
        ))}

        <section className="ins-cierre">
          <h2 className="ins-cierre-titulo">{cierre.titulo}</h2>
          <p className="ins-cierre-texto">{cierre.texto}</p>
          <Link className="btn btn-p" href={cierre.destino}>
            {cierre.cta}
          </Link>
        </section>
      </Marco>
    </main>
  );
}
