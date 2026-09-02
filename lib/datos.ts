import { crearClienteServidor } from "@/lib/supabase/server";
import type { Concurso } from "@/lib/tipos";

/**
 * Datos de prueba para ver el sitio andando sin base cargada.
 * Reflejan el estado real de los concursos a agosto de 2026.
 */
const CONCURSOS_DEMO: Concurso[] = [
  {
    id: "demo-mpd",
    organismo: "mpd",
    cargo: "Técnico administrativo",
    anio: 2026,
    estado: "sin_convocatoria",
    fecha_examen: null,
    fecha_cierre_inscripcion: null,
    url_oficial: "https://www.mpd.gov.ar/index.php/secretaria-de-concursos-n/inscripciones-vigentes",
  },
  {
    id: "demo-mpf",
    organismo: "mpf",
    cargo: "Técnico administrativo",
    anio: 2026,
    estado: "finalizado",
    fecha_examen: null,
    fecha_cierre_inscripcion: null,
    url_oficial: "https://www.mpf.gob.ar/Ingresodemocratico/",
  },
];

/**
 * Las métricas de plataforma salen de la base. El número de comunidad es de
 * Nueva Abogacía y se etiqueta como tal: son colegas en su comunidad, no
 * usuarios de este sitio.
 */

export async function traerConcursos(): Promise<Concurso[]> {
  const sb = await crearClienteServidor();
  if (!sb) return CONCURSOS_DEMO;

  const { data, error } = await sb
    .from("concursos")
    .select("id, organismo, cargo, anio, estado, fecha_examen, fecha_cierre_inscripcion, url_oficial")
    .order("organismo", { ascending: true });

  if (error || !data?.length) return CONCURSOS_DEMO;
  return data as Concurso[];
}
