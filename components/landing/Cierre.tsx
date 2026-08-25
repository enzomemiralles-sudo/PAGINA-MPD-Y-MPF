import { cierre as t } from "@/content/landing";
import { CapturaEmail } from "./CapturaEmail";
import { Revelar } from "@/components/marca/Revelar";

export function Cierre() {
  return (
    <section className="env sec" style={{ textAlign: "center" }}>
      <Revelar indice={0}>
        <h2>
          {t.titulo[0]}
          <br />
          {t.titulo[1]}
        </h2>
        <p style={{ margin: "1.4rem auto 0", maxWidth: "34rem" }}>{t.texto}</p>
        <CapturaEmail organismo="mpd" />
        <div className="hero-btns">
          <a className="btn btn-s" href="#simulador">
            {t.ctaSecundario}
          </a>
        </div>
      </Revelar>
    </section>
  );
}
