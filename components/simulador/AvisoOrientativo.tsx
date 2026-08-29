import { aviso as t } from "@/content/simulador";

/**
 * S-08. Va en el hub y no al final de todo: si el aviso importa, se lee antes
 * de rendir, no después.
 */
export function AvisoOrientativo() {
  return (
    <section className="sim-aviso tarjeta-app">
      <h2 className="sim-aviso-titulo">{t.titulo}</h2>
      {t.parrafos.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
    </section>
  );
}
