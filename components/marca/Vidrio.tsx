"use client";

import { useCallback, type ReactNode } from "react";
import { clsx } from "clsx";

/**
 * La superficie de vidrio del preview: blur, borde enmascarado y la luz que
 * sigue al puntero. Nunca se le aplica .rev encima — el que entra al
 * scrollear es el envoltorio de Revelar, para no recomponer el blur en cada
 * cuadro. Ver PLAN.md §4d.
 */
export function Vidrio({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "aside";
}) {
  const seguirPuntero = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    c.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return (
    <Tag className={clsx("vidrio", className)} onPointerMove={seguirPuntero}>
      {children}
    </Tag>
  );
}
