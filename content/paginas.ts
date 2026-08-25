export const privacidad = {
  titulo: "Privacidad",
  actualizado: "Última actualización: agosto de 2026.",
  bloques: [
    {
      h: "Qué guardamos",
      p: [
        "Si dejás tu mail para que te avisemos de una convocatoria, guardamos ese mail, el organismo que te interesa y si aceptaste o no recibir avisos por WhatsApp. Nada más.",
        "No pedimos DNI, CUIL, domicilio ni datos sensibles. Tampoco los necesitamos: para inscribirte al concurso esos datos se los das al organismo, en su sistema, no a nosotros.",
      ],
    },
    {
      h: "Para qué lo usamos",
      p: [
        "Para avisarte cuando se publica una convocatoria y para contarte novedades de la plataforma. No vendemos ni cedemos los datos de nadie, y no hay publicidad en el sitio.",
        "Los dos consentimientos son independientes y ninguno viene tildado: podés aceptar que te avisemos por mail sin aceptar WhatsApp.",
      ],
    },
    {
      h: "Cómo lo borrás",
      p: [
        "Escribinos y lo damos de baja. No hace falta que expliques por qué.",
      ],
    },
    {
      h: "Quiénes somos",
      p: [
        "Nexo Derecho, agrupación de estudiantes de la Facultad de Derecho de la UBA, y Nueva Abogacía. Esta es una iniciativa independiente: no representamos al Ministerio Público de la Defensa ni al Ministerio Público Fiscal.",
      ],
    },
  ],
} as const;

export const terminos = {
  titulo: "Términos",
  actualizado: "Última actualización: agosto de 2026.",
  bloques: [
    {
      h: "Qué es esto",
      p: [
        "Una plataforma gratuita de preparación para el ingreso democrático al cargo de técnico administrativo en el MPD y el MPF. No cobramos, no hay planes pagos y no hay publicidad.",
      ],
    },
    {
      h: "Qué no es",
      p: [
        "No es un canal oficial. La información de este sitio se arma a partir de material público de cada organismo y de las consultas reales de quienes ya rindieron, pero la fuente que vale es siempre la convocatoria vigente y el portal del organismo.",
        "Las fechas, los plazos y los requisitos cambian entre convocatorias. Verificá siempre contra la resolución vigente antes de tomar una decisión.",
      ],
    },
    {
      h: "Sobre el contenido",
      p: [
        "Las preguntas de los simulacros se revisan a mano antes de publicarse. Cuando una respuesta sale de una fuente que no podemos confirmar, lo decimos en la propia respuesta en vez de presentarla como segura.",
        "Si encontrás un error, avisanos: corregirlo es más importante que sostener lo que ya publicamos.",
      ],
    },
    {
      h: "Responsabilidad",
      p: [
        "Prepararte con este material no garantiza aprobar ni obtener un cargo. Aprobar el examen tampoco: da derecho a integrar un orden de mérito, y la designación depende de que haya vacantes.",
      ],
    },
  ],
} as const;

export const contacto = {
  titulo: "Contacto",
  bajada: "Somos dos organizaciones de estudiantes y abogados. Si encontraste un error en una pregunta, querés que agreguemos algo o necesitás que borremos tu mail, escribinos.",
  vias: [
    { que: "Nexo Derecho", como: "Facultad de Derecho, UBA", href: "https://instagram.com", texto: "Instagram" },
    { que: "Nueva Abogacía", como: "Comunidad de abogadas y abogados", href: "https://instagram.com", texto: "Instagram" },
    { que: "Grupo de WhatsApp", como: "Avisamos ahí cada publicación oficial apenas sale", href: "https://wa.me", texto: "Entrar al grupo" },
  ],
  errata:
    "Si el error es en una pregunta de un simulacro, contanos cuál y por qué. Las corregimos y volvemos a revisar la fuente: una respuesta mal cargada le enseña algo falso a alguien que se juega un puesto de trabajo.",
} as const;
