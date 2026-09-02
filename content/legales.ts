export const pie = {
  /** El logotipo gigante del pie. En la pública dice qué es el sitio; en la
   *  home de cada puerta, el nombre de la agrupación. */
  gigantePublica: "INGRESO DEMOCRÁTICO",
  coorganizacion: "Con",
  aviso:
    "Iniciativa independiente de Nexo Derecho y Nueva Abogacía. Sin vínculo institucional con el Ministerio Público de la Defensa ni con el Ministerio Público Fiscal. Verificá siempre la información oficial en las fuentes de cada organismo.",
  links: [
    { href: "/terminos-y-condiciones", texto: "Términos y Condiciones" },
    { href: "/politica-de-privacidad", texto: "Política de Privacidad" },
    { href: "/contacto", texto: "Contacto" },
  ],
  // El logo de Nueva Abogacía ya es el definitivo, así que de la nota queda
  // sólo la parte que sigue siendo cierta: el criterio de revisión.
  notaProvisoriaTitulo: "Cómo se cargan las preguntas.",
  notaProvisoriaTexto:
    " Ninguna se publica sin revisar a mano: una respuesta mal cargada le enseña algo falso a alguien que se juega un puesto de trabajo.",
} as const;

export const meta = {
  titulo: "Nexo Derecho × Nueva Abogacía — Ingreso al Ministerio Público",
  descripcion:
    "Simuladores de exámenes reales, normativa ordenada y respuestas a tus dudas para el ingreso democrático al cargo de técnico administrativo en el MPD y el MPF. Gratis, siempre.",
} as const;
