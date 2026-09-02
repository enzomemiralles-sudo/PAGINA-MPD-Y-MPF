import { insumos, type Insumo, type OrganismoInsumo } from "@/content/insumos";

/**
 * El bucket público donde viven los PDF. De sólo lectura: la política de la
 * migración 0010 deja bajar a cualquiera y subir a nadie.
 */
const BUCKET = "insumos";

/**
 * La URL pública de un insumo.
 *
 * Devuelve null si el proyecto no está configurado, y con eso la lista no
 * renderiza el enlace: un botón de descarga que lleva a un 404 es peor que no
 * tener botón.
 */
export function urlDe(insumo: Insumo): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${BUCKET}/${insumo.archivo}`;
}

export type Eje = { eje: string; materiales: Insumo[] };

/**
 * El material de un organismo, agrupado por eje y en orden.
 *
 * Un eje sin materiales no existe acá: se arma desde los materiales, así que
 * no hay manera de que aparezca un encabezado con nada debajo.
 */
export function ejesDe(organismo: OrganismoInsumo): Eje[] {
  const porEje = new Map<string, Insumo[]>();
  for (const i of insumos) {
    if (i.organismo !== organismo) continue;
    const lista = porEje.get(i.eje) ?? [];
    lista.push(i);
    porEje.set(i.eje, lista);
  }
  return [...porEje.entries()].map(([eje, materiales]) => ({
    eje,
    materiales: [...materiales].sort((a, b) => a.orden - b.orden),
  }));
}

/** Cuántos materiales tiene un organismo. Cero significa que no hay pestaña. */
export function cuantosTiene(organismo: OrganismoInsumo): number {
  return insumos.filter((i) => i.organismo === organismo).length;
}

export function esOrganismo(v: string): v is OrganismoInsumo {
  return v === "MPF" || v === "MPD";
}
