import { comoFunciona as t } from "@/content/simulador";

/** S-07. Los cuatro pasos, numerados porque son una secuencia real. */
export function ComoFunciona() {
  return (
    <section className="sim-pasos">
      <h2 className="sim-titulo">{t.titulo}</h2>
      <ol className="sim-pasos-grilla">
        {t.pasos.map((p) => (
          <li key={p.n}>
            <span className="sim-paso-n mono">{p.n}</span>
            <h3 className="sim-paso-titulo">{p.titulo}</h3>
            <p className="sim-paso-texto">{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
