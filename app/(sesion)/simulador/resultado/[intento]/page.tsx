import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { resultado as t } from "@/content/simulador";
import { traerIntento } from "@/lib/simulador/datos";
import { corregir, corregirTipeo, porTema } from "@/lib/simulador/puntaje";
import { compararTipeo } from "@/lib/simulador/tipeo";

export const metadata: Metadata = { title: "Resultados — Simulador de Exámenes" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ intento: string }> };

/**
 * Cómo te fue (S-12).
 *
 * El puntaje ya está calculado y guardado por la acción que entregó; acá se
 * vuelve a armar el desglose a partir de las respuestas corregidas, que es
 * información que la persona ya puede ver: son sus propias respuestas.
 *
 * El desempeño por tema aparece sólo si hay temas cargados. Hoy no los hay, y
 * una sección con una sola fila que diga «sin tema» sería peor que no
 * mostrarla.
 */
export default async function Resultado({ params }: Props) {
  const { intento: id } = await params;
  const intento = await traerIntento(id);
  if (!intento) notFound();
  if (intento.estado === "en_curso") redirect(`/simulador/rendir/${id}`);

  const esTipeo = intento.examen.modalidad === "tipeo";
  const temas = new Map(intento.preguntas.map((p) => [p.id, p.tema]));

  const errores = esTipeo ? erroresDelTipeo(intento) : 0;

  const r = esTipeo
    ? corregirTipeo(errores, intento.examen.reglas)
    : corregir(
        intento.respuestas.map((a) => ({ correcta: a.correcta, tema: temas.get(a.questionId) ?? null })),
        intento.examen.reglas,
      );

  const desglose = porTema(
    intento.respuestas.map((a) => ({ correcta: a.correcta, tema: temas.get(a.questionId) ?? null })),
  );

  const segundos = intento.finalizadoEn
    ? Math.max(
        0,
        Math.round(
          (new Date(intento.finalizadoEn).getTime() - new Date(intento.iniciadoEn).getTime()) / 1000,
        ),
      )
    : 0;

  return (
    <main className="env app-cuerpo res">
      <header className="res-cabeza">
        <h1>{t.titulo}</h1>
        <p className="res-examen">{intento.examen.titulo}</p>
      </header>

      <section className={`res-puntaje tarjeta-app${r.aprobado ? " ok" : " mal"}`}>
        <p className="res-veredicto">{r.aprobado ? t.aprobado : t.desaprobado}</p>
        <p className="res-numero">
          {r.puntaje}
          <span className="res-sobre">/ {r.puntajeMaximo}</span>
        </p>
        <p className="res-minimo">
          {t.minimoRotulo}: {r.puntajeMinimo}
        </p>
      </section>

      <dl className="res-cifras">
        {(esTipeo
          ? [
              { rotulo: t.erroresRotulo, valor: String(errores), tono: "mal" },
              { rotulo: t.tiempoRotulo, valor: t.tiempo(Math.floor(segundos / 60), segundos % 60), tono: "" },
            ]
          : [
              { rotulo: t.correctasRotulo, valor: String(r.correctas), tono: "ok" },
              { rotulo: t.incorrectasRotulo, valor: String(r.incorrectas), tono: "mal" },
              { rotulo: t.blancoRotulo, valor: String(r.enBlanco), tono: "" },
              { rotulo: t.aciertosRotulo, valor: `${r.porcentajeAciertos}%`, tono: "" },
              { rotulo: t.tiempoRotulo, valor: t.tiempo(Math.floor(segundos / 60), segundos % 60), tono: "" },
            ]
        ).map((c) => (
          <div key={c.rotulo} className="res-cifra tarjeta-app">
            <dt className="mono">{c.rotulo}</dt>
            <dd className={c.tono}>{c.valor}</dd>
          </div>
        ))}
      </dl>

      {desglose.length > 0 ? (
        <section className="res-temas">
          <h2 className="sim-titulo">{t.temasTitulo}</h2>
          <ul>
            {desglose.map((d) => (
              <li key={d.tema}>
                <span className="res-tema-nombre">{d.tema}</span>
                <span className="res-tema-barra" aria-hidden="true">
                  <i style={{ width: `${d.porcentaje}%` }} />
                </span>
                <span className="res-tema-pct">
                  {d.correctas}/{d.total}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="res-acciones">
        <Link className="btn btn-p" href={`/simulador/${intento.examen.organismo}`}>
          {t.deNuevo}
        </Link>
        <Link className="btn btn-s" href="/simulador">
          {t.volver}
        </Link>
      </div>
    </main>
  );
}

/**
 * Cuántos errores tuvo el tipeo.
 *
 * Se vuelve a contar en vez de despejarlo del puntaje guardado, porque el
 * puntaje tiene piso en cero: quien entregó a mitad de camino tiene cero
 * puntos con ochocientos errores y con veinte, y despejar diría veinte.
 *
 * Contar acá no filtra nada: en el tipeo el texto que había que copiar es el
 * que estuvo en pantalla todo el examen.
 */
function erroresDelTipeo(intento: NonNullable<Awaited<ReturnType<typeof traerIntento>>>): number {
  return intento.respuestas.reduce((total, a) => {
    const original = intento.preguntas.find((p) => p.id === a.questionId)?.enunciado;
    if (!original) return total;
    return total + compararTipeo(original, a.respuesta ?? "").errores;
  }, 0);
}
