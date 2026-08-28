import { hero } from "@/content/landing";

/**
 * El hero no entra con animación: es el elemento LCP.
 *
 * El titular se corta a mano. Cada renglón es un span: hasta que la pantalla
 * da el ancho quedan en línea y el texto fluye solo, y de ahí para arriba
 * pasan a bloque y el corte queda donde lo decidimos. `text-wrap: balance` no
 * servía: partía «para preparar tu ingreso al» en dos renglones cortos.
 *
 * El «al» viaja con la última línea y no con la anterior. Es lo que empareja
 * los tres renglones —21, 24 y 21 caracteres— y deja el degradado justo sobre
 * «Ministerio Público», que es donde tiene que estar.
 */
export function Hero() {
  return (
    <section className="env hero">
      <h1 className="hero-titulo">
        {hero.titulo.map((linea) => (
          <span key={linea} className="hero-linea">
            {linea}{" "}
          </span>
        ))}
        <span className="hero-linea">
          {hero.tituloAntesBrillo}
          <span className="brillo">{hero.tituloBrillo}</span>
        </span>
      </h1>

      <p className="bajada">{hero.bajada}</p>

      <div className="hero-btns">
        <a className="btn btn-p" href={hero.ctaPrimarioHref}>
          {hero.ctaPrimario}
        </a>
      </div>
    </section>
  );
}
