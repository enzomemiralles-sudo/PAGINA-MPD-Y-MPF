import Link from "next/link";
import { columnas as t } from "@/content/app";
import { configDe } from "@/lib/marca/marcas";
import type { Marca } from "@/lib/marca/tokens";

/**
 * Lo que queda del pie de la home, después de que «Menú» y «Recursos» se
 * mudaran: las herramientas están arriba, en `HerramientasHome`, y acá abajo
 * queda una sola columna con contacto, redes y el sitio de la agrupación.
 *
 * Lo que cambia entre puertas —el nombre de la agrupación, su Instagram, su
 * canal, su sitio— sale de `marcas.ts`, que es la única fuente de lo que
 * depende de la marca.
 *
 * Ya no hay pendientes a la vista: lo que falta simplemente no se renderiza,
 * como manda la regla del proyecto. Hoy eso es el canal de YouTube de Nueva
 * Abogacía.
 */
export function ColumnasHome({ marca }: { marca: Marca }) {
  const cfg = configDe(marca);

  return (
    <div className="portal-cols">
      <section>
        <h2 className="portal-col-titulo mono">{t.sociales.titulo}</h2>
        {cfg ? (
          <>
            <a href={cfg.contacto.instagram.href} target="_blank" rel="noopener noreferrer">
              {cfg.contacto.instagram.arroba}
            </a>
            {cfg.contacto.youtube ? (
              <a href={cfg.contacto.youtube} target="_blank" rel="noopener noreferrer">
                {t.sociales.youtube}
              </a>
            ) : null}
            <a href={`mailto:${cfg.contacto.mail}`}>{cfg.contacto.mail}</a>
            <Link href={cfg.sitio.pagina}>{t.sociales.paginaWeb}</Link>
            {/* Llevaba a «¿Tenés alguna duda?», que es el contacto. Ahora
                lleva a quiénes son. */}
            <Link href={cfg.quienesSomos}>{t.sociales.conocer(cfg.nombre)}</Link>
          </>
        ) : null}
        <Link href="/contacto">{t.sociales.contacto}</Link>
        <Link className="btn btn-s portal-escribinos" href="/contacto">
          {t.sociales.escribinos}
        </Link>
      </section>
    </div>
  );
}
