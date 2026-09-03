import { ejes, grupos, GRUPOS_SON_DE, type Eje, type OrganismoInsumo } from "@/content/insumos";
import type { Marca } from "@/lib/marca/tokens";

/**
 * Los ejes de un organismo, en el orden en que están declarados.
 *
 * No hay consulta a la base ni a Storage: el material vive en las carpetas de
 * Drive de cada agrupación y la pestaña enlaza a la carpeta. Un eje sin
 * carpeta se muestra igual —el programa del examen sigue siendo cierto— pero
 * sin botón.
 */
export function ejesDe(organismo: OrganismoInsumo): Eje[] {
  return ejes.filter((e) => e.organismo === organismo);
}

/** Cuántos materiales tiene un organismo, sumando todos sus ejes. */
export function cuantosTiene(organismo: OrganismoInsumo): number {
  return ejesDe(organismo).reduce((n, e) => n + e.materiales.length, 0);
}

/**
 * El grupo de WhatsApp del examen, si le corresponde a esta piel.
 *
 * Los dos grupos son de Nexo, así que sólo se ofrecen en la puerta de Nexo. A
 * alguien que entró por Nueva Abogacía no se le ofrece el grupo de la otra
 * agrupación: es mandarlo a un lugar que no es el suyo.
 */
export function grupoDe(organismo: OrganismoInsumo, marca: Marca | null): string | null {
  if (marca !== GRUPOS_SON_DE) return null;
  return grupos[organismo];
}

export function esOrganismo(v: string): v is OrganismoInsumo {
  return v === "MPF" || v === "MPD";
}

export type { Eje, OrganismoInsumo };
