export type Organismo = "mpd" | "mpf";
export type PerfilOrganizacion = "nexo" | "na";
export type OrganismoInteres = Organismo | "ambos";

export type EstadoConcurso =
  | "sin_convocatoria"
  | "convocatoria_abierta"
  | "inscripcion_abierta"
  | "fecha_confirmada"
  | "finalizado";

export type Concurso = {
  id: string;
  organismo: Organismo;
  cargo: string;
  anio: number;
  estado: EstadoConcurso;
  fecha_examen: string | null;
  fecha_cierre_inscripcion: string | null;
  url_oficial: string | null;
};

