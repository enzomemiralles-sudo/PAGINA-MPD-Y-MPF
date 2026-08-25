"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Entrada escalonada del preview: opacidad y desplazamiento, una sola vez,
 * disparada al 15% de visibilidad. Nada de escala, giro ni desenfoque.
 *
 * Envuelve al contenido en vez de aplicarse sobre él: si el hijo es un
 * .vidrio, animar el propio vidrio obliga al navegador a recomponer el
 * backdrop-filter en cada cuadro.
 */
export function Revelar({
  children,
  indice = 0,
  className,
}: {
  children: ReactNode;
  indice?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rev${visible ? " on" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--d": `${indice * 70}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
