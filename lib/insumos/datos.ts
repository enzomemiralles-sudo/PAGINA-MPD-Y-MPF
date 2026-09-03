import { insumos, type Insumo, type OrganismoInsumo } from "@/content/insumos";
import { crearClienteServidor } from "@/lib/supabase/server";

/**
 * El bucket público donde viven los PDF. De sólo lectura: la política de la
 * migración 0010 deja bajar a cualquiera y subir a nadie.
 */
const BUCKET = "insumos";

/** Las carpetas del bucket, una por organismo. */
const CARPETAS = ["mpf", "mpd"] as const;

/**
 * Qué archivos están subidos de verdad.
 *
 * Hace falta preguntarlo, no alcanza con que el proyecto esté configurado. El
 * registro de `content/insumos.ts` dice qué material entra en el examen —eso
 * se sabe desde que salió el programa— pero los archivos se suben cuando se
 * suben. Sin esta consulta la pestaña muestra veintidós botones de descarga y
 * los veintidós llevan a un 404, que es peor que no tener botón: parece que
 * algo se rompió.
 *
 * Si la consulta falla, devuelve el conjunto vacío y no se muestra ningún
 * botón. Es el lado seguro: se sigue viendo qué material entra en el examen,
 * que es la mitad útil de la pestaña, y no se promete una descarga que no se
 * puede cumplir.
 */
export async function archivosSubidos(): Promise<Set<string>> {
  const sb = await crearClienteServidor();
  if (!sb) return new Set();

  const listas = await Promise.all(
    CARPETAS.map(async (carpeta) => {
      const { data, error } = await sb.storage.from(BUCKET).list(carpeta, { limit: 200 });
      if (error || !data) return [];
      return data.map((o) => `${carpeta}/${o.name}`);
    }),
  );
  return new Set(listas.flat());
}

/**
 * La URL pública de un insumo, o null si el archivo todavía no está subido.
 *
 * `subidos` sale de `archivosSubidos()`. Se pasa en vez de consultarse acá
 * para no disparar una consulta por material: son veintidós.
 */
export function urlDe(insumo: Insumo, subidos: Set<string>): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !subidos.has(insumo.archivo)) return null;
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
