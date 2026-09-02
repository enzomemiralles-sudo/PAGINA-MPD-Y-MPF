import { MPF } from "@/content/guia-mpf";
import { MPDGuia } from "@/content/guia-mpd";
import type { Guia } from "@/lib/guia/tipos";
import type { Organismo } from "@/lib/tipos";

/**
 * Las guías cargadas.
 *
 * Un organismo sin guía simplemente no está acá, y entonces no tiene tarjeta
 * en la pantalla 0 ni ruta propia. Hoy están las dos.
 */
export const GUIAS: Record<Organismo, Guia> = { mpf: MPF, mpd: MPDGuia };

export function esOrganismo(v: string): v is Organismo {
  return v === "mpf" || v === "mpd";
}

export function guiaDe(v: string): Guia | null {
  const clave = v.toLowerCase();
  return esOrganismo(clave) ? GUIAS[clave] : null;
}
