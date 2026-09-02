import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { textos as t } from "@/content/insumos";
import { ejesDe, esOrganismo, urlDe } from "@/lib/insumos/datos";

type Props = { params: Promise<{ organismo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { organismo } = await params;
  const o = organismo.toUpperCase();
  if (!esOrganismo(o)) return { title: t.titulo };
  return { title: `${t.titulo} — ${t.organismos[o].corto}` };
}

/**
 * El material de un organismo, agrupado por eje.
 *
 * Los ejes salen de los materiales, no de una lista aparte, así que un eje sin
 * material no puede aparecer. Y un material cuyo archivo todavía no está en
 * Storage se muestra sin botón en vez de con un botón que lleva a un 404: se
 * ve qué material entra en el examen aunque el PDF no esté subido.
 */
export default async function InsumosDeOrganismo({ params }: Props) {
  const { organismo } = await params;
  const o = organismo.toUpperCase();
  if (!esOrganismo(o)) notFound();

  const ejes = ejesDe(o);
  if (ejes.length === 0) notFound();

  return (
    <main className="env app-cuerpo">
      <VolverAlPerfil />
      <Link className="insumo-cambiar mono" href="/insumos">
        ← {t.volverAOrganismos}
      </Link>

      <h1>{t.organismos[o].nombre}</h1>
      <p className="ins-bajada">{t.bajada}</p>

      <div className="insumo-ejes">
        {ejes.map((e) => (
          <section key={e.eje} className="insumo-eje">
            <h2 className="insumo-eje-titulo">{e.eje}</h2>
            <ul className="insumo-lista">
              {e.materiales.map((m) => {
                const url = urlDe(m);
                return (
                  <li key={m.id}>
                    <span className="insumo-tipo mono">{t.tipo[m.tipo]}</span>
                    <span className="insumo-titulo">{m.titulo}</span>
                    {url ? (
                      <a
                        className="insumo-bajar"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.descargar}
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
