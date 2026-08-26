import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * La superficie de la app. El vidrio con blur es un recurso de la landing
 * oscura; acá, sobre papel, una tarjeta con borde y sombra suave.
 */
export function Tarjeta({
  children,
  className,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag className={clsx("tarjeta-app", className)} style={style}>
      {children}
    </Tag>
  );
}
