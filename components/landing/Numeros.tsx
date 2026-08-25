"use client";

import { useEffect, useRef, useState } from "react";
import { numeros as t } from "@/content/landing";
import type { Metricas } from "@/lib/tipos";

/**
 * Ninguno de estos números está escrito a mano: salen de lib/datos.ts.
 * El de comunidad se etiqueta como comunidad de Nueva Abogacía, no como
 * usuarios de la plataforma.
 */
export function Numeros({ metricas }: { metricas: Metricas }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progreso, setProgreso] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setProgreso(0);
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          let paso = 0;
          const iv = setInterval(() => {
            paso += 1;
            setProgreso(1 - (1 - paso / 32) ** 3);
            if (paso >= 32) {
              setProgreso(1);
              clearInterval(iv);
            }
          }, 26);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const contar = (n: number) => Math.round(n * progreso).toLocaleString("es-AR");

  const filas = [
    { valor: contar(metricas.preguntasMpd), rotulo: t.preguntasMpd },
    { valor: contar(metricas.dudasMpf), rotulo: t.dudasMpf },
    { valor: contar(metricas.comunidadNuevaAbogacia), rotulo: t.comunidad },
    { valor: "100%", rotulo: t.gratis },
  ];

  return (
    <section className="env" style={{ padding: "2.5rem 0" }}>
      <div className="numeros" ref={ref}>
        {filas.map((f) => (
          <span key={f.rotulo}>
            <b>{f.valor}</b> {f.rotulo}
          </span>
        ))}
      </div>
    </section>
  );
}
