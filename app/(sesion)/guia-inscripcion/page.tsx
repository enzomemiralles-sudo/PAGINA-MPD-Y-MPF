import type { Metadata } from "next";
import Link from "next/link";
import { traerConcursos } from "@/lib/datos";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { Estado } from "@/components/inscripcion/Estado";
import { GUIAS } from "@/lib/guia/registro";
import { guia as t } from "@/content/guia";

export const metadata: Metadata = { title: "Guía de inscripción" };
export const dynamic = "force-dynamic";

/**
 * Pantalla 0: elegí el organismo.
 *
 * Las dos tarjetas tienen la misma jerarquía a propósito. Cada una muestra el
 * estado real de su concurso, y ese estado sale del mismo componente que lo
 * resuelve en el resto del sitio: la lógica de qué significa
 * «sin_convocatoria» vive en un solo lugar, no en dos.
 */
export default async function ElegirGuia() {
  const concursos = await traerConcursos();

  return (
    <main className="env app-cuerpo">
      <VolverAlPerfil />
      <h1>{t.titulo}</h1>
      <p className="guia-bajada">{t.bajada}</p>

      <h2 className="guia-elegi mono">{t.elegi}</h2>
      <div className="guia-puertas">
        {Object.values(GUIAS).map((g) => (
          <article key={g.organismo} className="guia-puerta">
            <span className="guia-puerta-sigla mono">{g.sigla}</span>
            <h3 className="guia-puerta-nombre">{g.nombre}</h3>

            <Estado concurso={concursos.find((c) => c.organismo === g.organismo) ?? null} />

            <Link className="btn btn-a guia-puerta-cta" href={`/guia-inscripcion/${g.organismo}`}>
              {t.entrar}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
