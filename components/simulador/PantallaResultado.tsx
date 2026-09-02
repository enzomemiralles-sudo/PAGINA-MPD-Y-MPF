import Link from "next/link";
import { resultado as t } from "@/content/simulador";
import type { Intento } from "@/lib/simulador/datos";
import { corregir, corregirTipeo, porTema } from "@/lib/simulador/puntaje";
import { compararTipeo } from "@/lib/simulador/tipeo";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";

/**
 * Cómo te fue (S-12).
 *
 * Está separado de la página porque la página es sólo el cargador: busca el
 * intento y decide si corresponde mostrarlo. Todo lo que se ve está acá, y así
 * se puede dibujar pasándole un intento, sin pasar por la base.
 *
 * El puntaje ya está calculado y guardado por la acción que entregó; acá se
 * vuelve a armar el desglose a partir de las respuestas corregidas, que es
 * información que la persona ya puede ver: son sus propias respuestas.
 *
 * El desempeño por tema aparece sólo si hay temas cargados. Una sección con
 * una sola fila que diga «sin tema» sería peor que no mostrarla.
 */
export function PantallaResultado({ intento }: { intento: Intento }) {
  const esTipeo = intento.examen.modalidad === "tipeo";
  const temas = new Map(intento.preguntas.map((p) => [p.id, p.tema]));

  const errores = esTipeo ? erroresDelTipeo(intento) : 0;

  const r = esTipeo
    ? corregirTipeo(errores, intento.examen.reglas)
    : corregir(
        intento.respuestas.map((a) => ({ correcta: a.correcta, tema: temas.get(a.questionId) ?? null })),
        intento.examen.reglas,
      );

  // El tipeo no tiene desglose: es un solo ejercicio y su «tema» es el tipeo.
  // Una barra que dice «Tipeo 0/1» no informa nada.
  const desglose = esTipeo
    ? []
    : porTema(
        intento.respuestas.map((a) => ({
          correcta: a.correcta,
          tema: temas.get(a.questionId) ?? null,
        })),
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
      <VolverAlPerfil />
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
              { rotulo: t.erroresRotulo, valor: String(errores), tono: "mal", icono: "✕" },
              { rotulo: t.tiempoRotulo, valor: t.tiempo(Math.floor(segundos / 60), segundos % 60), tono: "", icono: "" },
            ]
          : [
              { rotulo: t.correctasRotulo, valor: String(r.correctas), tono: "ok", icono: "✓" },
              { rotulo: t.incorrectasRotulo, valor: String(r.incorrectas), tono: "mal", icono: "✕" },
              { rotulo: t.blancoRotulo, valor: String(r.enBlanco), tono: "", icono: "" },
              { rotulo: t.aciertosRotulo, valor: `${r.porcentajeAciertos}%`, tono: "", icono: "" },
              { rotulo: t.tiempoRotulo, valor: t.tiempo(Math.floor(segundos / 60), segundos % 60), tono: "", icono: "" },
            ]
        ).map((c) => (
          <div
            key={c.rotulo}
            className="res-cifra tarjeta-app"
            data-estado={c.tono === "ok" ? "correcta" : c.tono === "mal" ? "incorrecta" : undefined}
          >
            <dt className="mono">{c.rotulo}</dt>
            <dd className={c.tono}>
              {/* El ícono no es decoración: sin él la cifra se distingue sólo
                  por el color, y ahí se cae para quien no lo ve. */}
              {c.icono ? <span aria-hidden="true">{c.icono}</span> : null}
              {c.valor}
            </dd>
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
  );}

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
function erroresDelTipeo(intento: Intento): number {
  return intento.respuestas.reduce((total, a) => {
    const original = intento.preguntas.find((p) => p.id === a.questionId)?.enunciado;
    if (!original) return total;
    return total + compararTipeo(original, a.respuesta ?? "").errores;
  }, 0);
}
