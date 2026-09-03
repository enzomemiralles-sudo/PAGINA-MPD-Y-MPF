import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { textos as t } from "@/content/insumos";
import { ejesDe, esOrganismo, grupoDe } from "@/lib/insumos/datos";

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
 * Cada eje enlaza a su carpeta de Drive, y debajo dice qué hay adentro. El
 * listado es el programa del examen, no un índice del Drive: sigue siendo
 * cierto aunque un archivo todavía no esté subido, y así se puede conseguir
 * por otro lado.
 *
 * Un eje sin carpeta se muestra sin botón. Mandar a alguien a una carpeta
 * vacía es peor que no mandarlo.
 */
export default async function InsumosDeOrganismo({ params }: Props) {
  const { organismo } = await params;
  const o = organismo.toUpperCase();
  if (!esOrganismo(o)) notFound();

  const lista = ejesDe(o);
  if (lista.length === 0) notFound();

  const grupo = grupoDe(o);
  const hayCarpetas = lista.some((e) => e.carpeta !== null);

  return (
    <main className="env app-cuerpo">
      <VolverAlPerfil />
      <Link className="insumo-cambiar mono" href="/insumos">
        ← {t.volverAOrganismos}
      </Link>

      <h1>{t.organismos[o].nombre}</h1>
      <p className="ins-bajada">{t.bajada}</p>
      {hayCarpetas ? <p className="insumo-donde">{t.dondeEsta}</p> : null}

      {grupo ? (
        <aside className="insumo-grupo">
          <span className="insumo-grupo-rotulo mono">{t.grupo.rotulo}</span>
          <p className="insumo-grupo-titulo">{t.grupo.titulo(t.organismos[o].corto)}</p>
          <p className="insumo-grupo-texto">{t.grupo.texto}</p>
          <a className="btn btn-a" href={grupo} target="_blank" rel="noopener noreferrer">
            {t.grupo.cta}
          </a>
        </aside>
      ) : null}

      <div className="insumo-ejes">
        {lista.map((e) => (
          <section key={e.id} className="insumo-eje">
            <div className="insumo-eje-cabeza">
              <h2 className="insumo-eje-titulo">{e.nombre}</h2>
              {e.carpeta ? (
                <a
                  className="btn btn-s insumo-abrir"
                  href={e.carpeta}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.abrirCarpeta} ↗
                </a>
              ) : (
                <span className="insumo-sin-carpeta">{t.sinCarpeta}</span>
              )}
            </div>

            <h3 className="insumo-incluye mono">{t.incluye}</h3>
            <ul className="insumo-lista">
              {e.materiales.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
