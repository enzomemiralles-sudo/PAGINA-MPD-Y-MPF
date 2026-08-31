import { crearClienteServidor } from "@/lib/supabase/server";
import type { Concurso, Metricas } from "@/lib/tipos";

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
const METRICAS_DEMO: Metricas = {
  preguntasMpd: 59,
  dudasMpf: 87,
  comunidadNuevaAbogacia: 20000,
};

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

export async function traerMetricas(): Promise<Metricas> {
  const sb = await crearClienteServidor();
  if (!sb) return METRICAS_DEMO;

  // Solo cuenta lo publicado y revisado: es lo que una persona puede practicar.
  //
  // Y sólo las de opción múltiple: los textos del práctico de tipeo también
  // viven en `questions`, pero un texto para copiar no es una pregunta. Sin
  // este filtro la portada decía 72 donde hay 69.
  const { count: preguntasMpd } = await sb
    .from("questions_public")
    .select("id", { count: "exact", head: true })
    .eq("organismo", "mpd")
    .eq("tipo", "multiple_choice");

  const { count: dudasMpf } = await sb
    .from("resources")
    .select("id", { count: "exact", head: true })
    .eq("tipo", "faq_mpf");

  return {
    preguntasMpd: preguntasMpd ?? METRICAS_DEMO.preguntasMpd,
    dudasMpf: dudasMpf ?? METRICAS_DEMO.dudasMpf,
    comunidadNuevaAbogacia: METRICAS_DEMO.comunidadNuevaAbogacia,
  };
}
