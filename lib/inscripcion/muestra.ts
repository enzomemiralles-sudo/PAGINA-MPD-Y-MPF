import { guiasCargadas } from "@/lib/inscripcion/guias";
import type { Video } from "@/lib/inscripcion/datos";

/**
 * Qué de lo que promete la portada existe de verdad hoy (I-09).
 *
 * Los cuatro destacados de la muestra —guías, capturas, videos, errores— sólo
 * se anuncian si hay algo detrás. Es la misma regla que rige todo el sitio: no
 * se promete una sección que está vacía. Y como sale de contar los datos y no
 * de una constante, el día que se carguen las capturas el destacado aparece
 * solo.
 */
export function loQueHay(videos: Video[]): Record<string, boolean> {
  const guias = guiasCargadas();
  return {
    guias: guias.length > 0,
    capturas: guias.some((g) => g.pasos.some((p) => p.capturas.length > 0)),
    videos: videos.length > 0,
    errores: guias.some((g) => g.errores.length > 0),
  };
}

/** Una tarjeta por concurso con guía cargada. Hoy, una. */
export function concursosConGuia(): { sigla: string; nombre: string; cargo: string }[] {
  return guiasCargadas().map((g) => ({ sigla: g.sigla, nombre: g.nombre, cargo: g.cargo }));
}
