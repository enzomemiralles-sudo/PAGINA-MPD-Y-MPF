import Link from "next/link";
import { columnas as t } from "@/content/app";
import { configDe } from "@/lib/marca/marcas";
import type { Marca } from "@/lib/marca/tokens";

/**
 * Las tres columnas del pie de la home: menú, recursos y sociales.
 *
 * Lo que cambia entre puertas —el nombre de la agrupación, su Instagram, su
 * mail— sale de `marcas.ts`. Lo que todavía no tenemos se muestra como
 * pendiente y no se inventa: hoy eso es el grupo de WhatsApp y el canal de
 * YouTube de las dos.
 */
function Pendiente({ que }: { que: string }) {
  return (
    <p className="portal-pend">
      {que} <span className="mono">{t.sociales.pendiente}</span>
    </p>
  );
}

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
        {cfg ? <Link href="/contacto">{t.menu.conocer(cfg.nombre)}</Link> : null}
      </section>

      <section>
        <h2 className="portal-col-titulo mono">{t.recursos.titulo}</h2>
        {t.recursos.items.map((i) => (
          <Link key={i.texto} href={i.destino}>
            {i.texto}
            {i.nota ? <small>{i.nota}</small> : null}
          </Link>
        ))}
        {cfg?.contacto.whatsapp ? (
          <a href={cfg.contacto.whatsapp} target="_blank" rel="noopener noreferrer">
            {t.recursos.whatsapp(cfg.nombre)}
          </a>
        ) : (
          <Pendiente que={t.sociales.faltaWhatsapp} />
        )}
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
            ) : (
              <Pendiente que={t.sociales.faltaYoutube} />
            )}
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
