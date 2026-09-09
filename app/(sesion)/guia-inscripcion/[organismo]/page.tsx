import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { traerConcursos } from "@/lib/datos";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { CheckCircle2 } from "lucide-react";
import { Estado } from "@/components/inscripcion/Estado";
import { SeccionGuia } from "@/components/guia/Seccion";
import { Pasos, PasosEtapa } from "@/components/guia/Pasos";
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
 * La estética (fondo verde institucional, tarjeta blanca, cabecera propia) es
 * la misma para los dos organismos — antes era sólo del MPD, ahora es de
 * cualquier instructivo, así que ninguno de los dos queda con un tratamiento
 * "de segunda".
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

  const contenido = (
    <>
      {/* El encabezado va sin tarjeta, directo sobre el verde: no es una
          sección más, es el nombre de todo lo que viene abajo, y con caja
          propia se leía como la primera de la pila.
          El blanco de la letra sale de no llevar la clase de la tarjeta, no
          de un color escrito a mano: `.instructivo-mpd-claro` ya declara
          `--texto: #ffffff`, y era la tarjeta la que lo pisaba con el negro
          que necesita sobre fondo blanco. */}
      <header className="guia-encabezado">
        <h1>
          {t.titulo} · {g.sigla}
        </h1>
        <p className="guia-bajada">
          {g.nombre} · {g.cargo}
        </p>
      </header>

      {/* ① Estado de inscripción. Sin tarjeta blanca y sin título propio: es
          una franja de aviso, no una sección de contenido, y la franja ya
          lleva su rótulo «Estado del trámite» adentro. Un <h2> arriba decía
          lo mismo dos veces y una tarjeta alrededor la convertía en la
          primera de nueve, cuando en realidad es el encabezado vivo de todo
          lo que sigue.
          El cuerpo y los enlaces se siguen renderizando porque el MPF los usa
          para explicar que cada concurso tiene su propia ventana de fechas;
          el MPD los dejó vacíos, que es lo que hace que acá quede sólo la
          franja. */}
      <section className="guia-seccion guia-estado" id="estado">
        <Estado concurso={concurso} />
        {g.estado.cuerpo.map((c) => (
          <p key={c}>{c}</p>
        ))}
        {g.estado.enlaces.length > 0 ? (
          <div className="guia-enlaces">
            {g.estado.enlaces.map((e) => (
              <a key={e.url} className="guia-enlace" href={e.url} target="_blank" rel="noopener noreferrer">
                {e.texto} ↗
              </a>
            ))}
          </div>
        ) : null}
      </section>

      {/* ② Antes de empezar */}
      <SeccionGuia seccion={g.antes} id="antes" />

      {/* ③ Lo que conviene saber.
          En los instructivos no son advertencias —nada de tono de alarma—,
          son información importante: mismos datos, presentados como una
          lista de puntos a favor de llegar preparado.
          El título sale de `content/guia.ts` como los otros ocho: estaba
          escrito a mano acá y era el único que no se podía cambiar sin tocar
          el JSX.
          Es un <details> y no una <section>: la sección entera se pliega,
          con el título haciendo de solapa. Arranca cerrada. Es contenido para
          leer una vez, antes de empezar, y desplegada empujaba el paso a paso
          —que es a donde la gente va— media pantalla para abajo. */}
      {g.saber.length > 0 ? (
        <details className="guia-seccion instructivo-mpd-tarjeta guia-seccion-plegable" id="saber">
          <summary className="guia-seccion-resumen">
            <h2 className="guia-seccion-titulo">{t.secciones.saber}</h2>
            <span className="guia-seccion-flecha" aria-hidden="true" />
          </summary>
          <ul className="info-importante">
            {g.saber.map((a) => (
              <li key={a.texto} className="info-importante-item">
                <CheckCircle2 className="info-importante-icono" aria-hidden="true" />
                <span>{a.texto}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {/* ④ Paso a paso + ⑨ Checklist final.
          Salen los dos de `Pasos`, como hermanos y no anidados: comparten el
          estado de lo marcado, pero ahora cada uno es una tarjeta y una
          adentro de la otra no sería una división, sería un marco doble. Por
          eso el título del ④ se mudó al componente. */}
      {g.pasos.length > 0 ? <Pasos guia={g} clave={g.organismo} /> : null}

      {/* ⑤ y ⑥. Cada organismo cubre estas dos etapas de una de dos formas y
          la página muestra la que tenga: el acordeón cuando trae pasos —el
          MPD, con la parte 2 de la guía de Nexo— y la sección de texto cuando
          no —el MPF, que todavía la tiene como texto corrido—. Los dos
          componentes devuelven null si les toca la lista vacía o el null, así
          que no hace falta preguntar acá cuál corresponde. */}
      <PasosEtapa
        titulo={t.secciones.despues}
        id="despues"
        clave={g.organismo}
        pasos={g.pasosIngreso}
        intro={g.introIngreso}
      />
      <SeccionGuia seccion={g.despues} id="despues" />

      <PasosEtapa
        titulo={t.secciones.examen}
        id="examen"
        clave={g.organismo}
        pasos={g.pasosExamen}
        accion={{ texto: t.practicar, url: `/simulador/${g.organismo}` }}
      />
      {/* El simulador se ofrece acá y no en otra sección: es donde se termina
          de leer cómo se rinde, y practicar es lo único que se puede hacer al
          respecto.
          Va directo al simulador del organismo de esta guía y no al hub, que
          volvería a preguntar MPD o MPF cuando la respuesta ya está en la
          pantalla donde se hizo clic. `g.organismo` es la misma clave que usa
          la ruta del simulador. */}
      <SeccionGuia
        seccion={g.examen}
        id="examen"
        accion={{ texto: t.practicar, url: `/simulador/${g.organismo}` }}
      />

      {/* ⑦ va plegada: es lo que pasa después de rendir, o sea lo único de la
          guía que no se lee mientras se hace el trámite. Cerrada deja de
          empujar el pie y sigue estando a un clic. */}
      <SeccionGuia seccion={g.resultados} id="resultados" plegable />

      {/* ⑧ Preguntas frecuentes */}
      {g.preguntas.length > 0 ? (
        <section className="guia-seccion instructivo-mpd-tarjeta" id="preguntas">
          <h2 className="guia-seccion-titulo">{t.secciones.preguntas}</h2>
          <Preguntas preguntas={g.preguntas} />
        </section>
      ) : null}

      {/* Sin la tarjeta blanca: el pie va en una caja apenas más clara que
          el fondo. No es una sección más de la guía, es de dónde salió.
          Las letras salen blancas por no llevar esa clase —la de la tarjeta
          es la que pisa el `--texto` con el negro que necesita sobre
          blanco—, igual que el encabezado de arriba. */}
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
    </>
  );

  return (
    <main className="env app-cuerpo instructivo-mpd-claro">
      <VolverAlPerfil />
      <Link className="guia-cambiar mono" href="/guia-inscripcion">
        ← {t.elegi}
      </Link>

      {/* Sin envoltorio: la tarjeta la lleva cada sección, así se ve dónde
          termina una y empieza la otra. Es la misma estructura que el
          asistente. */}
      {contenido}
    </main>
  );
}