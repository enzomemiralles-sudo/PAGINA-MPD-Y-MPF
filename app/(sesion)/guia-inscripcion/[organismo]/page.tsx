import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { traerConcursos } from "@/lib/datos";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { Estado } from "@/components/inscripcion/Estado";
import { Advertencia } from "@/components/guia/Advertencia";
import { SeccionGuia } from "@/components/guia/Seccion";
import { Pasos } from "@/components/guia/Pasos";
import { Preguntas } from "@/components/guia/Preguntas";
import { guiaDe } from "@/lib/guia/registro";
import { guia as t } from "@/content/guia";

type Props = { params: Promise<{ organismo: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { organismo } = await params;
  const g = guiaDe(organismo);
  return { title: g ? `${t.titulo} — ${g.sigla}` : t.titulo };
}

/**
 * La guía de un organismo.
 *
 * Una sola plantilla para los dos: la estructura ① a ⑨ está acá y el contenido
 * entra por `content/guia-mpf.ts` o `content/guia-mpd.ts`. Duplicar el
 * componente garantizaba que tarde o temprano las dos guías se vieran
 * distintas sin que nadie lo hubiera decidido.
 *
 * Las secciones que el material de un organismo no cubre devuelven null y no
 * se renderizan.
 */
export default async function GuiaDeOrganismo({ params }: Props) {
  const { organismo } = await params;
  const g = guiaDe(organismo);
  if (!g) notFound();

  const concursos = await traerConcursos();
  const concurso = concursos.find((c) => c.organismo === g.organismo) ?? null;

  return (
    <main className="env app-cuerpo">
      <VolverAlPerfil />
      <Link className="guia-cambiar mono" href="/guia-inscripcion">
        ← {t.elegi}
      </Link>

      <h1>
        {t.titulo} · {g.sigla}
      </h1>
      <p className="guia-bajada">
        {g.nombre} · {g.cargo}
      </p>

      {/* ① Estado de inscripción */}
      <section className="guia-seccion" id="estado">
        <h2 className="guia-seccion-titulo">{t.secciones.estado}</h2>
        <Estado concurso={concurso} />
        {g.estado.cuerpo.map((c) => (
          <p key={c}>{c}</p>
        ))}
        <div className="guia-enlaces">
          {g.estado.enlaces.map((e) => (
            <a key={e.url} className="guia-enlace" href={e.url} target="_blank" rel="noopener noreferrer">
              {e.texto} ↗
            </a>
          ))}
        </div>
      </section>

      {/* ② Antes de empezar */}
      <SeccionGuia seccion={g.antes} id="antes" />

      {/* ③ Lo que tenés que saber antes */}
      {g.saber.length > 0 ? (
        <section className="guia-seccion" id="saber">
          <h2 className="guia-seccion-titulo">{t.secciones.saber}</h2>
          {g.saber.map((a) => (
            <Advertencia key={a.texto} {...a} />
          ))}
        </section>
      ) : null}

      {/* ④ Guía paso a paso + ⑨ Checklist final */}
      {g.pasos.length > 0 ? (
        <section className="guia-seccion" id="pasos">
          <h2 className="guia-seccion-titulo">{t.secciones.pasos}</h2>
          <Pasos guia={g} clave={g.organismo} />
        </section>
      ) : null}

      {/* ⑤ ⑥ ⑦ */}
      <SeccionGuia seccion={g.despues} id="despues" />
      <SeccionGuia seccion={g.examen} id="examen" />
      <SeccionGuia seccion={g.resultados} id="resultados" />

      {/* ⑧ Preguntas frecuentes */}
      {g.preguntas.length > 0 ? (
        <section className="guia-seccion" id="preguntas">
          <h2 className="guia-seccion-titulo">{t.secciones.preguntas}</h2>
          <Preguntas preguntas={g.preguntas} />
        </section>
      ) : null}

      <footer className="guia-fuentes">
        <h2 className="guia-fuentes-titulo mono">{t.fuentes}</h2>
        <ul>
          {g.fuentes.map((f) => (
            <li key={f.url}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {f.texto}
              </a>
            </li>
          ))}
        </ul>
        <p className="guia-verificar">{t.verificar}</p>
      </footer>
    </main>
  );
}
