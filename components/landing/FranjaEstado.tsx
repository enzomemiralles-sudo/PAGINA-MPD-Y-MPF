import { franjaEstado as t } from "@/content/landing";
import type { Concurso } from "@/lib/tipos";

/**
 * El estado de cada concurso sale de la tabla, no del texto. Cuando el MPD
 * pase a fecha_confirmada, esta franja se acomoda sola.
 */
export function FranjaEstado({ concursos }: { concursos: Concurso[] }) {
  if (concursos.length === 0) return null;

  return (
    <section className="estado" style={{ marginTop: "3.5rem" }}>
      <div className="env">
        {concursos.map((c) => {
          const esperando = c.estado === "sin_convocatoria";
          return (
            <div className="fila" key={c.id}>
              <span className="org">
                <span className={`punto ${esperando ? "espera" : "listo"}`} aria-hidden="true" />
                {t.organismos[c.organismo]} · {c.cargo}
              </span>
              <span className="st">{t.etiquetas[c.estado]}</span>
              <a className="acc" href={esperando ? "#avisame" : "#simulador"}>
                {t.acciones[c.estado]}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
