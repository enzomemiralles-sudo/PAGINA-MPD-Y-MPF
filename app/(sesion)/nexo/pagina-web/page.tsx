import type { Metadata } from "next";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { Captura } from "@/components/guia/Huecos";
import { paginaNexo as t } from "@/content/organizaciones";

export const metadata: Metadata = { title: "La página de Nexo Derecho" };

/**
 * La pestaña que presenta el sitio de Nexo Derecho.
 *
 * Cinco herramientas, cada una con su captura a ancho completo. Las capturas
 * todavía no existen: los huecos están declarados con su id, así que en
 * preview se ve qué falta y en producción no se renderiza nada.
 */
export default function PaginaNexo() {
  return (
    <main className="env app-cuerpo org">
      <VolverAlPerfil />
      <h1>{t.titulo}</h1>
      <p className="org-bajada">{t.bajada}</p>
      <a className="org-url" href={t.url} target="_blank" rel="noopener noreferrer">
        {t.url} ↗
      </a>

      <div className="org-herramientas">
        {t.herramientas.map((h) => (
          <section key={h.titulo} className="org-herramienta">
            <h2 className="org-herramienta-titulo">{h.titulo}</h2>
            <p className="org-herramienta-bajada">{h.bajada}</p>
            <Captura {...h.captura} />
          </section>
        ))}
      </div>

      <section className="org-cierre">
        <h2 className="org-cierre-titulo">{t.cierreTitulo}</h2>
        <p>{t.cierreTexto}</p>
        <a className="btn btn-a" href={t.url} target="_blank" rel="noopener noreferrer">
          {t.cta}
        </a>
      </section>
    </main>
  );
}
