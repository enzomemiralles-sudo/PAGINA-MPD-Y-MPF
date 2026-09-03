/**
 * INSUMOS DE ESTUDIO
 *
 * El material de lectura de cada organismo, agrupado por eje temático.
 *
 * Los archivos NO se sirven desde acá: viven en las carpetas de Drive de cada
 * agrupación, y esta pestaña enlaza a la carpeta del eje. Es a propósito, y no
 * por comodidad: subir cada PDF a Storage obligaba a mantener el mismo archivo
 * en dos lados y a acordarse de sincronizarlos. Enlazando la carpeta, un
 * material nuevo aparece en cuanto se lo sube al Drive, sin tocar código.
 *
 * `materiales` es el programa del examen, no un índice del Drive. Dice qué hay
 * que leer aunque el archivo todavía no esté subido, que es la mitad útil de la
 * pestaña: se puede conseguir por otro lado.
 *
 * `carpeta` en null significa que la carpeta está vacía o no existe todavía. Un
 * eje así se muestra —el programa sigue siendo cierto— pero sin botón: mandar a
 * alguien a una carpeta vacía es peor que no mandarlo.
 */

export type OrganismoInsumo = "MPF" | "MPD";

export type Eje = {
  id: string;
  organismo: OrganismoInsumo;
  nombre: string;
  /** La carpeta de Drive del eje. */
  carpeta: string | null;
  /** Qué entra en el examen por este eje. */
  materiales: string[];
};

const DRIVE = "https://drive.google.com/drive/folders/";

export const ejes: readonly Eje[] = [
  // ---------------- MPF ----------------
  // Verificados contra el Drive: la carpeta de cada eje existe y su contenido
  // es el que está acá.
  {
    id: "mpf-constitucional",
    organismo: "MPF",
    nombre: "Sistema constitucional",
    carpeta: `${DRIVE}1CdVJVt8t2iiBWZMPpXsg2EMhnmxvWyfd`,
    materiales: [
      "Constitución de la Nación Argentina",
      "Convención Americana sobre Derechos Humanos (Pacto de San José de Costa Rica)",
    ],
  },
  {
    id: "mpf-cppf",
    organismo: "MPF",
    nombre: "Nuevo Código Procesal Penal Federal",
    carpeta: `${DRIVE}1vNECkT93wzIaqoWNBsplnTnh4XEJKsu_`,
    materiales: [
      "Código Procesal Penal Federal (Ley 27.150 y modificatoria 27.482)",
      "Código Procesal Penal Federal — MPF, sistema acusatorio",
      "Ley 26.791 — tipificación del homicidio agravado de mujeres",
    ],
  },
  {
    id: "mpf-organico",
    organismo: "MPF",
    nombre: "Ministerio Público Fiscal",
    carpeta: `${DRIVE}1PyTUPg10wT2FsHnTRNFRx9LDDoLkpIU6`,
    materiales: [
      "Ley Orgánica del Ministerio Público Fiscal",
      "Resolución PGN 507/2014",
      "Resolución PGN 128/2010 — Reglamento de funcionarios y empleados del MPF",
      "Ley 22.431 — Sistema de Protección Integral de los Discapacitados",
      "Ley 26.681",
    ],
  },
  {
    id: "mpf-historia",
    organismo: "MPF",
    nombre: "Historia argentina y latinoamericana",
    carpeta: `${DRIVE}18fCoxTIEp_cW7Q9VBf_Gy8caHvdwfCB2`,
    materiales: [
      "Breve Historia Argentina — José Luis Romero",
      "Zanatta — Historia de América Latina desde la Colonia hasta el siglo XXI",
      "Historia política: el largo camino de la democracia",
      "Gallego, Eggers-Brass, Lozano — Historia Latinoamericana",
      "Historia de América Latina: recorridos temáticos e historiográficos",
      "Democracia, 40 años",
      "América Latina: episodios",
      "Videos de historia argentina",
    ],
  },
  {
    id: "mpf-genero",
    organismo: "MPF",
    nombre: "Género",
    carpeta: `${DRIVE}1uI9buhOlagCrj8vhyT0by6FKlkJmFJpA`,
    materiales: ["Género y diversidades (planilla)"],
  },
  {
    id: "mpf-etica",
    organismo: "MPF",
    nombre: "Formación ética y ciudadana",
    carpeta: `${DRIVE}1Rl0DIC_Uhi0RG6Ek0VzaKTJehKIbWU_q`,
    materiales: ["Primer cuatrimestre — Cívica", "Formación ética y ciudadana, parte 01"],
  },

  // ---------------- MPD ----------------
  // La carpeta existe y es pública, pero está VACÍA. Va en null hasta que
  // tenga algo: el eje se ve, el botón no.
  {
    id: "mpd-regimen",
    organismo: "MPD",
    nombre: "Régimen jurídico del MPD",
    carpeta: null,
    materiales: [
      "Ley Orgánica del Ministerio Público de la Defensa de la Nación",
      "Constitución de la Nación Argentina",
    ],
  },
];

/**
 * Los grupos de WhatsApp, que son DE NEXO.
 *
 * Los dos, uno por examen. Por eso están acá y no en `marcas.ts`: no es que
 * cada agrupación tenga el suyo, es que Nexo tiene uno para cada concurso.
 *
 * Y por eso sólo se muestran en la piel de Nexo. A alguien que entró por
 * Nueva Abogacía ofrecerle el grupo de otra agrupación es mandarlo a un lugar
 * que no es el suyo; cuando Nueva Abogacía tenga los propios, se agregan acá
 * con su marca y la pantalla no cambia.
 */
export const grupos: Record<OrganismoInsumo, string | null> = {
  MPF: "https://chat.whatsapp.com/C6UNCx4qB3ZJhPMagV4HFa",
  MPD: "https://chat.whatsapp.com/BAuLDIJyix4Jr2miKR4EPi",
};

/** De quién son los grupos de arriba. */
export const GRUPOS_SON_DE = "nexo" as const;

export const textos = {
  titulo: "Insumos de estudio",
  bajada: "El material de lectura de cada organismo, ordenado por eje temático.",
  elegi: "Elegí el organismo",
  volverAOrganismos: "Cambiar de organismo",
  abrirCarpeta: "Abrir la carpeta",
  incluye: "Lo que incluye",
  sinCarpeta: "Todavía no está subido a la carpeta compartida.",
  grupo: {
    rotulo: "Grupo de estudio",
    titulo: (org: string) => `Grupo de WhatsApp del ${org}`,
    dice: "Lo organiza Nexo Derecho.",
    texto: "Para preguntar dudas y enterarte de las novedades del concurso.",
    cta: "Unirme al grupo",
  },
  dondeEsta:
    "Los archivos están en el Drive de la agrupación. Se abren en una pestaña nueva y no hace falta cuenta de Google para verlos.",
  organismos: {
    MPF: { nombre: "Ministerio Público Fiscal", corto: "MPF", cta: "Ver el material del MPF" },
    MPD: { nombre: "Ministerio Público de la Defensa", corto: "MPD", cta: "Ver el material del MPD" },
  },
  cuantosEjes: (n: number) => (n === 1 ? "1 eje" : `${n} ejes`),
  cuantos: (n: number) => (n === 1 ? "1 material" : `${n} materiales`),
} as const;
