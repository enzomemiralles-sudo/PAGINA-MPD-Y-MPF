import Link from "next/link";
import { columnas as t } from "@/content/app";
import { configDe } from "@/lib/marca/marcas";
import type { Marca } from "@/lib/marca/tokens";

/**
 * Las tres columnas del pie de la home: menú, recursos y sociales.
 *
 * Lo que cambia entre puertas —el nombre de la agrupación, su Instagram, su
 * canal, su sitio— sale de `marcas.ts`, que es la única fuente de lo que
 * depende de la marca.
 *
 * Ya no hay pendientes a la vista: lo que falta simplemente no se renderiza,
 * como manda la regla del proyecto. Hoy eso es el sitio de Nueva Abogacía, que
 * todavía no tenemos.
 */
export function ColumnasHome({ marca }: { marca: Marca }) {
  const cfg = configDe(marca);

  return (
    <div className="portal-cols">
      <section>
        <h2 className="portal-col-titulo mono">{t.menu.titulo}</h2>
        {t.menu.items.map((i) => (
          <Link key={i.destino} href={i.destino} className={i.propio ? "portal-marca" : undefined}>
            {i.texto}
          </Link>
        ))}
        {/* Llevaba a «¿Tenés alguna duda?», que es el contacto. Ahora lleva a
            quiénes son. */}
        {cfg ? <Link href={cfg.quienesSomos}>{t.menu.conocer(cfg.nombre)}</Link> : null}
      </section>

      <section>
        <h2 className="portal-col-titulo mono">{t.recursos.titulo}</h2>
        {t.recursos.items.map((i) => (
          <Link key={i.texto} href={i.destino}>
            {i.texto}
            {i.nota ? <small>{i.nota}</small> : null}
          </Link>
        ))}
        {cfg ? <Link href={cfg.sitio.pagina}>{t.recursos.paginaWeb}</Link> : null}
      </section>

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
          </>
        ) : null}
        <Link className="btn btn-s portal-escribinos" href="/contacto">
          {t.sociales.escribinos}
        </Link>
      </section>
    </div>
  );
}
