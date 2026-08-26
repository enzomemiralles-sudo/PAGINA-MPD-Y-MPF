/**
 * El logotipo va a color: el archivo es una silueta blanca con alfa, así que
 * se usa como máscara y se pinta con --logo-nexo. Sobre oscuro queda la
 * versión en blanco; sobre claro, el verde de marca.
 */
export function LogoNexo({ alto = 19 }: { alto?: number }) {
  return (
    <span
      className="logo-nexo"
      role="img"
      aria-label="Nexo Derecho"
      style={{ "--logo-alto": `${alto}px` } as React.CSSProperties}
    />
  );
}
