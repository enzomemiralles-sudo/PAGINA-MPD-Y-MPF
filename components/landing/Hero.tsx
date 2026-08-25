import { hero } from "@/content/landing";

/** El hero no entra con animación: es el elemento LCP. */
export function Hero() {
  return (
    <section className="env hero">
      <h1>
        {hero.titulo}
        <br />
        <span className="brillo">{hero.tituloBrillo}</span>
      </h1>

      <p className="bajada">
        {hero.bajadaAntes}
        <b style={{ color: "var(--papel)", fontVariationSettings: "'wght' 600" }}>
          {hero.bajadaDestacado}
        </b>
        {hero.bajadaDespues}
      </p>

      <div className="hero-btns">
        <a className="btn btn-p" href={hero.ctaPrimarioHref}>
          {hero.ctaPrimario}
        </a>
        <a className="btn btn-s" href="#simulador">
          {hero.ctaSecundario}
        </a>
      </div>

      <p className="micro mono">{hero.micro}</p>
    </section>
  );
}
