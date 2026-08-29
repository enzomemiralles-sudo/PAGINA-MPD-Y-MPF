import { reglas as t } from "@/content/simulador";
import type { Examen } from "@/lib/simulador/datos";

/**
 * S-14: cómo se corrige, dentro del flujo del examen y no como sección de
 * venta en la portada.
 *
 * Todos los números salen de la fila de `exams` (S-13). Ninguno está escrito
 * acá: el MPD y el MPF puntúan distinto y eso va a seguir cambiando.
 *
 * El único número de preguntas que aparece es el del intento, que es la
 * longitud de este examen y no el tamaño del banco (S-09).
 */
export function ReglasDePuntaje({ examen }: { examen: Examen }) {
  const esTipeo = examen.modalidad === "tipeo";

  const filas = [
    { rotulo: t.duracionRotulo, valor: t.duracion(examen.duracionMinutos) },
    { rotulo: t.cantidadRotulo, valor: t.cantidad(examen.cantidadPreguntas, examen.modalidad) },
    ...(esTipeo
      ? []
      : [{ rotulo: t.correctaRotulo, valor: t.puntos(examen.reglas.puntosCorrecta) }]),
    { rotulo: t.incorrectaRotulo, valor: t.puntos(examen.reglas.puntosIncorrecta) },
    ...(esTipeo ? [] : [{ rotulo: t.blancoRotulo, valor: t.puntos(examen.reglas.puntosBlanco) }]),
    { rotulo: t.minimoRotulo, valor: `${examen.reglas.puntajeMinimo} puntos` },
  ];

  return (
    <div className="sim-reglas">
      <h4 className="sim-reglas-titulo mono">{t.titulo}</h4>
      {examen.reglas.puntajeInicial !== 0 ? (
        <p className="sim-reglas-desde">{t.desde(examen.reglas.puntajeInicial)}</p>
      ) : null}
      <dl className="sim-reglas-lista">
        {filas.map((f) => (
          <div key={f.rotulo}>
            <dt>{f.rotulo}</dt>
            <dd>{f.valor}</dd>
          </div>
        ))}
      </dl>
      {examen.reglas.puntosIncorrecta < 0 && !esTipeo ? (
        <p className="sim-reglas-nota">{t.aclaracionDescuento}</p>
      ) : null}
      {examen.organismo === "mpf" ? (
        <p className="sim-reglas-nota sim-reglas-orientativo">{t.orientativoMpf}</p>
      ) : null}
    </div>
  );
}
