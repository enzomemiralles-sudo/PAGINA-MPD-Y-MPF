import { crearClienteServidor } from "@/lib/supabase/server";
import type { Organismo } from "@/lib/inscripcion/tipos";

export type Video = {
  id: string;
  titulo: string;
  youtube_id: string;
  organismo: Organismo | null;
  orden: number;
};

/**
 * Los videos publicados (I-06).
 *
 * La tabla `videos` ya existía desde la migración 0001. Devuelve sólo los
 * publicados: un video a medio cargar no se muestra, igual que una pregunta
 * sin revisar no se sirve.
 *
 * Hoy no hay ninguno cargado, así que devuelve vacío y la sección no se
 * dibuja. La biblioteca queda armada: cuando se inserte la primera fila,
 * aparece sola y sin tocar código.
 */
export async function traerVideos(): Promise<Video[]> {
  const sb = await crearClienteServidor();
  if (!sb) return [];

  const { data, error } = await sb
    .from("videos")
    .select("id, titulo, youtube_id, organismo, orden")
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error || !data) return [];
  return data as Video[];
}
