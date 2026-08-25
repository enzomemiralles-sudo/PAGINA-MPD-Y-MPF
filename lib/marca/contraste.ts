/** Contraste WCAG 2.1. Se calcula, no se compara contra una tabla escrita a mano. */

export type RGB = readonly [number, number, number];

export function hexARgb(hex: string): RGB {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Aplana un color con alfa sobre un fondo opaco. */
export function componer(fg: RGB, alfa: number, fondo: RGB): RGB {
  return [0, 1, 2].map((i) => Math.round(alfa * fg[i]! + (1 - alfa) * fondo[i]!)) as unknown as RGB;
}

export function luminancia(rgb: RGB): number {
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(rgb[0]) + 0.7152 * canal(rgb[1]) + 0.0722 * canal(rgb[2]);
}

export function contraste(a: RGB, b: RGB): number {
  const [la, lb] = [luminancia(a), luminancia(b)];
  const [alto, bajo] = la > lb ? [la, lb] : [lb, la];
  return (alto + 0.05) / (bajo + 0.05);
}

/** Parsea "#RRGGBB" o "rgba(r,g,b,a)" y lo compone sobre el fondo. */
export function resolver(color: string, fondo: RGB): RGB {
  const c = color.trim();
  if (c.startsWith("#")) return hexARgb(c);
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error(`No sé leer el color: ${color}`);
  const partes = m[1]!.split(",").map((x) => Number.parseFloat(x.trim()));
  const rgb = [partes[0]!, partes[1]!, partes[2]!] as unknown as RGB;
  const alfa = partes.length > 3 ? partes[3]! : 1;
  return alfa === 1 ? rgb : componer(rgb, alfa, fondo);
}

export const AA_TEXTO = 4.5;

export function ratio(color: string, fondo: string): number {
  const bg = resolver(fondo, [0, 0, 0]);
  return contraste(resolver(color, bg), bg);
}
