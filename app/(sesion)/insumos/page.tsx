import type { Metadata } from "next";
import Link from "next/link";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { textos as t } from "@/content/insumos";
import { cuantosTiene, ejesDe } from "@/lib/insumos/datos";

export const metadata: Metadata = { title: "Insumos de estudio" };

/**
 * La puerta de los insumos: primero se elige organismo.
 *
 * El material del MPF y el del MPD no se mezclan porque los programas son
 * distintos, y una lista sola con etiquetas obligaría a filtrar mentalmente
 * treinta títulos para encontrar los seis que sirven.
 *
 * Un organismo sin material no muestra tarjeta. Hoy los dos tienen.
 */
export default function Insumos() {
  const organismos = (["MPF", "MPD"] as const).filter((o) => cuantosTiene(o) > 0);

  return (
    <main className="env app-cuerpo">
      <VolverAlPerfil />
      <h1>{t.titulo}</h1>
      <p className="ins-bajada">{t.bajada}</p>

      <h2 className="insumo-elegi mono">{t.elegi}</h2>
      <div className="insumo-puertas">
        {organismos.map((o) => {
          const ejes = ejesDe(o);
          const cuantos = cuantosTiene(o);
          return (
            <Link key={o} className="insumo-puerta" href={`/insumos/${o}`}>
              <span className="insumo-sigla mono">{t.organismos[o].corto}</span>
              <span className="insumo-nombre">{t.organismos[o].nombre}</span>
              <span className="insumo-cuenta">
                {t.cuantos(cuantos)} · {t.cuantosEjes(ejes.length)}
              </span>
              <span className="insumo-cta">{t.organismos[o].cta} →</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
