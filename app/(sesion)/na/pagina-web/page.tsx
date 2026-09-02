import type { Metadata } from "next";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { Captura } from "@/components/guia/Huecos";
import { paginaNa as t } from "@/content/organizaciones";
import { MARCAS_CONFIG } from "@/lib/marca/marcas";

export const metadata: Metadata = { title: "La página de Nueva Abogacía" };

/**
 * La pestaña que presenta el sitio de Nueva Abogacía.
 *
 * El botón de visita sólo aparece si hay URL. Hoy no la tenemos: la constante
 * está declarada en `marcas.ts` como null y el botón no se renderiza, en vez
 * de llevar a una dirección inventada.
 *
 * Los títulos y los enlaces de esta página van en --acento-texto, que en la
 * piel de Nueva Abogacía es #2FD3C8. El azul de marca no pinta texto: sobre el
 * fondo da 2,8:1.
 */
export default function PaginaNa() {
  const url = MARCAS_CONFIG.na.sitio.url;

  return (
    <main className="env app-cuerpo org">
      <VolverAlPerfil />
      <h1>{t.titulo}</h1>
      <p className="org-bajada">{t.bajada}</p>

      <Captura {...t.captura} />

      <div className="org-bloques">
        {t.bloques.map((b) => (
          <section key={b.titulo} className="org-bloque">
            <h2 className="org-bloque-titulo">{b.titulo}</h2>
            <p>{b.texto}</p>
          </section>
        ))}
      </div>

      {url ? (
        <a className="btn btn-a org-visitar" href={url} target="_blank" rel="noopener noreferrer">
          {t.cta}
        </a>
      ) : null}
    </main>
  );
}
