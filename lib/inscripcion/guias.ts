import { MPD } from "@/content/inscripcion/mpd";
import type { Guia, Organismo } from "@/lib/inscripcion/tipos";

/**
 * Las guías, por organismo.
 *
 * I-08: los dos existen desde el principio y comparten la estructura, para que
 * el día que llegue el material del MPF entre acá y salga con la misma
 * pantalla, no con una parecida.
 *
 * El MPF es `null` porque todavía no tenemos el manual. No es un pendiente
 * escondido: mientras sea null, su pestaña no se dibuja. Ninguna sección sin
 * datos se renderiza, y un «próximamente» es exactamente lo que las reglas del
 * proyecto prohíben.
 */
export const GUIAS: Record<Organismo, Guia | null> = {
  mpd: MPD,
  mpf: null,
};

/** Los organismos que hoy tienen guía cargada, en orden. */
export function guiasCargadas(): Guia[] {
  return (["mpd", "mpf"] as const).map((o) => GUIAS[o]).filter((g): g is Guia => g !== null);
}

export function guiaDe(organismo: Organismo): Guia | null {
  return GUIAS[organismo];
}
