/**
 * INSUMOS DE ESTUDIO
 *
 * El material de lectura de cada organismo, agrupado por eje temático. Los
 * archivos viven en Supabase Storage, en el bucket público `insumos`; acá va
 * el registro de qué hay y dónde.
 *
 * Va como archivo y no como tabla a propósito: es una lista que cambia cuando
 * cambia el programa del examen —o sea, casi nunca— y ponerla en la base
 * obligaría a una migración por cada PDF nuevo. El día que haya que cargarlos
 * desde el panel, la forma del tipo ya es la de una fila.
 *
 * `archivo` es la ruta DENTRO del bucket, no una URL: la URL la arma
 * `lib/insumos/datos.ts` con la del proyecto, así que mudar de proveedor toca
 * un archivo y no ciento.
 */

export type OrganismoInsumo = "MPF" | "MPD";

export type Insumo = {
  id: string;
  organismo: OrganismoInsumo;
  /** El eje temático del examen. Agrupa la lista. */
  eje: string;
  /** Nombre legible del material. */
  titulo: string;
  /** Ruta dentro del bucket de Storage. */
  archivo: string;
  tipo: "pdf" | "xlsx";
  orden: number;
};

export const insumos: readonly Insumo[] = [
  // ---------------- MPF ----------------
  // Sistema constitucional
  { id: "mpf-const-01", organismo: "MPF", eje: "Sistema constitucional", titulo: "Constitución de la Nación Argentina", archivo: "mpf/constitucion-nacional.pdf", tipo: "pdf", orden: 1 },
  { id: "mpf-const-02", organismo: "MPF", eje: "Sistema constitucional", titulo: "Convención Americana sobre Derechos Humanos (Pacto de San José de Costa Rica)", archivo: "mpf/pacto-san-jose.pdf", tipo: "pdf", orden: 2 },

  // Nuevo Código Procesal Penal Federal
  { id: "mpf-cppf-01", organismo: "MPF", eje: "Nuevo Código Procesal Penal Federal", titulo: "Código Procesal Penal Federal (Ley 27.150 y modificatoria 27.482)", archivo: "mpf/cppf-ley-27150.pdf", tipo: "pdf", orden: 1 },
  { id: "mpf-cppf-02", organismo: "MPF", eje: "Nuevo Código Procesal Penal Federal", titulo: "Código Procesal Penal Federal — MPF, sistema acusatorio", archivo: "mpf/cppf-sistema-acusatorio.pdf", tipo: "pdf", orden: 2 },
  { id: "mpf-cppf-03", organismo: "MPF", eje: "Nuevo Código Procesal Penal Federal", titulo: "Ley 26.791 — tipificación del homicidio agravado de mujeres", archivo: "mpf/ley-26791.pdf", tipo: "pdf", orden: 3 },

  // Ministerio Público Fiscal
  // La lista de origen repetía tres veces el Reglamento PGN 128/2010 y dos la
  // Resolución PGN 507/14. Va un registro por norma.
  { id: "mpf-org-01", organismo: "MPF", eje: "Ministerio Público Fiscal", titulo: "Ley Orgánica del Ministerio Público Fiscal", archivo: "mpf/ley-organica-mpf.pdf", tipo: "pdf", orden: 1 },
  { id: "mpf-org-02", organismo: "MPF", eje: "Ministerio Público Fiscal", titulo: "Resolución PGN 507/2014", archivo: "mpf/pgn-507-2014.pdf", tipo: "pdf", orden: 2 },
  { id: "mpf-org-03", organismo: "MPF", eje: "Ministerio Público Fiscal", titulo: "Resolución PGN 128/2010 — Reglamento de funcionarios y empleados del MPF", archivo: "mpf/pgn-128-2010.pdf", tipo: "pdf", orden: 3 },
  { id: "mpf-org-04", organismo: "MPF", eje: "Ministerio Público Fiscal", titulo: "Ley 22.431 — Sistema de Protección Integral de los Discapacitados", archivo: "mpf/ley-22431.pdf", tipo: "pdf", orden: 4 },
  { id: "mpf-org-05", organismo: "MPF", eje: "Ministerio Público Fiscal", titulo: "Ley 26.681", archivo: "mpf/ley-26681.pdf", tipo: "pdf", orden: 5 },

  // Historia argentina
  { id: "mpf-hist-01", organismo: "MPF", eje: "Historia argentina", titulo: "Breve Historia Argentina — José Luis Romero", archivo: "mpf/romero-breve-historia-argentina.pdf", tipo: "pdf", orden: 1 },

  // Historia argentina y latinoamericana
  { id: "mpf-hlat-01", organismo: "MPF", eje: "Historia argentina y latinoamericana", titulo: "Zanatta — Historia de América Latina desde la Colonia hasta el siglo XXI", archivo: "mpf/zanatta-america-latina.pdf", tipo: "pdf", orden: 1 },
  { id: "mpf-hlat-02", organismo: "MPF", eje: "Historia argentina y latinoamericana", titulo: "Historia política: el largo camino de la democracia", archivo: "mpf/largo-camino-democracia.pdf", tipo: "pdf", orden: 2 },
  { id: "mpf-hlat-03", organismo: "MPF", eje: "Historia argentina y latinoamericana", titulo: "Gallego, Eggers-Brass, Lozano — Historia Latinoamericana", archivo: "mpf/gallego-historia-latinoamericana.pdf", tipo: "pdf", orden: 3 },
  { id: "mpf-hlat-04", organismo: "MPF", eje: "Historia argentina y latinoamericana", titulo: "Historia de América Latina: recorridos temáticos e historiográficos", archivo: "mpf/recorridos-tematicos.pdf", tipo: "pdf", orden: 4 },
  { id: "mpf-hlat-05", organismo: "MPF", eje: "Historia argentina y latinoamericana", titulo: "Democracia, 40 años", archivo: "mpf/democracia-40-anios.pdf", tipo: "pdf", orden: 5 },
  { id: "mpf-hlat-06", organismo: "MPF", eje: "Historia argentina y latinoamericana", titulo: "América Latina: episodios", archivo: "mpf/america-latina-episodios.pdf", tipo: "pdf", orden: 6 },

  // Género
  { id: "mpf-gen-01", organismo: "MPF", eje: "Género", titulo: "Género y diversidades", archivo: "mpf/genero-y-diversidades.xlsx", tipo: "xlsx", orden: 1 },

  // Formación ética y ciudadana
  { id: "mpf-etica-01", organismo: "MPF", eje: "Formación ética y ciudadana", titulo: "Primer cuatrimestre — Cívica", archivo: "mpf/civica-primer-cuatrimestre.pdf", tipo: "pdf", orden: 1 },
  { id: "mpf-etica-02", organismo: "MPF", eje: "Formación ética y ciudadana", titulo: "Formación ética y ciudadana, parte 01", archivo: "mpf/formacion-etica-01.pdf", tipo: "pdf", orden: 2 },

  // ---------------- MPD ----------------
  // Arranca con menos material porque todavía no hay convocatoria. La vista no
  // rellena con nada: se ve corta porque es corta.
  { id: "mpd-reg-01", organismo: "MPD", eje: "Régimen jurídico del MPD", titulo: "Ley Orgánica del Ministerio Público de la Defensa de la Nación", archivo: "mpd/ley-organica-mpd.pdf", tipo: "pdf", orden: 1 },
  { id: "mpd-reg-02", organismo: "MPD", eje: "Régimen jurídico del MPD", titulo: "Constitución de la Nación Argentina", archivo: "mpd/constitucion-nacional.pdf", tipo: "pdf", orden: 2 },
];

export const textos = {
  titulo: "Insumos de estudio",
  bajada: "El material de lectura de cada organismo, ordenado por eje temático.",
  elegi: "Elegí el organismo",
  volverAOrganismos: "Cambiar de organismo",
  descargar: "Descargar",
  ver: "Ver",
  organismos: {
    MPF: { nombre: "Ministerio Público Fiscal", corto: "MPF", cta: "Ver el material del MPF" },
    MPD: { nombre: "Ministerio Público de la Defensa", corto: "MPD", cta: "Ver el material del MPD" },
  },
  cuantos: (n: number) => (n === 1 ? "1 material" : `${n} materiales`),
  cuantosEjes: (n: number) => (n === 1 ? "1 eje" : `${n} ejes`),
  tipo: { pdf: "PDF", xlsx: "Planilla" },
} as const;
