"use client";

import { useEffect, useRef, useState } from "react";
import { maqueta as t } from "@/content/landing";

/** Ilustración de producto: los números son fijos y no salen de la base. */
export function MaquetaSimulador() {
  const ref = useRef<HTMLDivElement>(null);
  const [vivo, setVivo] = useState(false);
  const [segundos, setSegundos] = useState(41 * 60 + 12);
  const [reveladas, setReveladas] = useState(0);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            setVivo(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!vivo) return;
    const reloj = setInterval(() => setSegundos((s) => (s > 0 ? s - 1 : 0)), 1000);
    const celdas = setInterval(
      () => setReveladas((n) => (n >= t.respondidas.length ? n : n + 1)),
      38,
    );
    const marcador = setInterval(() => setPuntos((p) => (p >= 180 ? 180 : p + 10)), 42);
    return () => {
      clearInterval(reloj);
      clearInterval(celdas);
      clearInterval(marcador);
    };
  }, [vivo]);

  const cronometro = vivo
    ? `00:${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`
    : t.cronometroInicial;

  const hechas = new Set<number>(vivo ? t.respondidas.slice(0, reveladas) : t.respondidas);
  const marcadas = new Set<number>(t.marcadas);

  return (
    <section className="env sec" id="simulador">
      <div className="maqueta" ref={ref}>
        <div className="maq-barra">
          <span className="luces" aria-hidden="true">
            <i style={{ background: "#ff5f57" }} />
            <i style={{ background: "#febc2e" }} />
            <i style={{ background: "#28c840" }} />
          </span>
          <span className="maq-tit mono">{t.titulo}</span>
          <span className="maq-cron">{cronometro}</span>
        </div>

        <div className="maq-cuerpo">
          <div className="maq-col">
            <button className="btn btn-a" style={{ width: "100%", fontSize: ".8rem", padding: ".6rem" }} type="button">
              {t.retomar}
            </button>
            <div style={{ marginTop: "1.1rem" }}>
              {t.temas.map((tema) => (
                <div className="tema" key={tema.nombre}>
                  <div className="fila">
                    <span>{tema.nombre}</span>
                    <span>{tema.pct}%</span>
                  </div>
                  <div className="barra">
                    <i style={{ width: vivo ? `${tema.pct}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="maq-col">
            <div className="mono" style={{ color: "var(--papel-débil)" }}>
              {t.resumen}
            </div>
            <div className="grilla" aria-hidden="true">
              {Array.from({ length: t.total }, (_, i) => i + 1).map((n) => {
                const clases = ["gq"];
                if (n === t.activa) clases.push("act");
                else if (marcadas.has(n)) clases.push("marc");
                else if (hechas.has(n)) clases.push("hecha");
                return (
                  <span className={clases.join(" ")} key={n}>
                    {n}
                  </span>
                );
              })}
            </div>
            <div className="puntaje">
              {t.puntaje.map((p) => (
                <div key={p.rotulo}>
                  {p.rotulo}
                  <b
                    style={
                      p.tono === "ok"
                        ? { color: "var(--ok)" }
                        : p.tono === "error"
                          ? { color: "var(--error)" }
                          : undefined
                    }
                  >
                    {p.tono === "ok" && vivo ? `+${puntos}` : p.valor}
                  </b>
                </div>
              ))}
            </div>
          </div>

          <div className="maq-col">
            <span className="mono" style={{ color: "var(--papel-débil)" }}>
              {t.preguntaRotulo}
            </span>
            <p className="maq-preg">{t.pregunta}</p>
            {t.opciones.map((o) => (
              <div className={`maq-op${o.ok ? " ok" : ""}`} key={o.texto}>
                {o.texto}
              </div>
            ))}
            <div className="cita mono" style={{ marginTop: ".9rem" }}>
              {t.cita}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
