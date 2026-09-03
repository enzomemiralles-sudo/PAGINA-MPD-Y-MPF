import type { Captura } from "@/lib/guia/tipos";

/**
 * LAS PÁGINAS DE CADA AGRUPACIÓN
 *
 * «¿Quiénes somos?» de Nueva Abogacía y las dos pestañas que presentan los
 * sitios propios. Los textos vienen dados y van tal cual: son la voz de cada
 * agrupación, no copy de producto, y resumirlos sería reescribir lo que
 * escribieron ellos.
 */

export const quienesSomos = {
  titulo: "¿Quiénes somos?",
  parrafos: [
    "Somos una comunidad de abogados y abogadas que ejercemos las diferentes ramas de la profesión, conocemos las necesidades y dificultades con las que nos enfrentamos día a día y viendo que no existe un ámbito que nos represente como merecemos, decidimos crearlo.",
    "Así surge NUEVA ABOGACÍA, como un ámbito de encuentro y representación de los y las que día a día caminamos por los tribunales. Un espacio cuyo objetivo es reunir a los abogados y abogadas de a pie, a los que le dedicamos todo a nuestra profesión y queremos desarrollarnos académica, profesional y económicamente.",
    "Si recién te graduaste, es fundamental que cuentes con acompañamiento profesional de quienes ya vienen ejerciendo, para aportarte todo lo que necesitás.",
    "Si te recibiste hace rato, ya sabés que para el ejercicio profesional necesitás estar actualizado tanto en las leyes como en la doctrina y jurisprudencia, por eso te ofrecemos cursos para que tengas todos los temas actualizados, brindados por docentes especialistas en las diferentes temáticas.",
    "Porque sentimos que no había un espacio que nos represente como realmente merecemos.",
    "Así nace Nueva Abogacía: un lugar de encuentro, acompañamiento y desarrollo para quienes ejercemos con compromiso, día a día.",
  ],
  cierre: "Somos Nueva Abogacía.",
} as const;

export type BloqueHerramienta = {
  titulo: string;
  bajada: string;
  captura: Captura;
};

export const paginaNexo = {
  titulo: "Conocé la página de Nexo Derecho",
  bajada:
    "Una plataforma creada por estudiantes y para estudiantes, pensada para acompañarte durante tu recorrido por la Facultad.",
  url: "https://nexoderecho.com.ar",
  herramientas: [
    {
      titulo: "🗓️ Tu calendario académico",
      bajada: "Para organizar tu cursada y no perderte ninguna fecha importante.",
      captura: {
        id: "nexo-web-calendario",
        descripcion: "El calendario académico de la página de Nexo Derecho",
        src: "/capturas/nexo-web-calendario.png",
      },
    },
    {
      titulo: "📚 Cuadros de orientación",
      bajada: "Para organizar tu recorrido y orientarte durante tu paso por el CPO.",
      captura: {
        id: "nexo-web-cuadros",
        descripcion: "Los cuadros de orientación del CPO",
        src: "/capturas/nexo-web-cuadros.png",
      },
    },
    {
      titulo: "🔗 Chequear correlativas",
      bajada: "Para inscribirte correctamente y saber qué materias te convienen.",
      captura: {
        id: "nexo-web-correlativas",
        descripcion: "El chequeador de correlativas",
        src: "/capturas/nexo-web-correlativas.png",
      },
    },
    {
      titulo: "📊 Promedio y progreso",
      bajada: "Marcá las materias que ya realizaste, seguí tu progreso y consultá tu promedio.",
      captura: {
        id: "nexo-web-promedio",
        descripcion: "El seguimiento de promedio y progreso de la carrera",
        src: "/capturas/nexo-web-promedio.png",
      },
    },
    {
      titulo: "🗺️ Mapa interactivo de la Facultad",
      bajada: "Encontrá aulas, oficinas y departamentos de manera rápida e interactiva.",
      captura: {
        id: "nexo-web-mapa",
        descripcion: "El mapa interactivo de la Facultad de Derecho",
        src: "/capturas/nexo-web-mapa.png",
      },
    },
  ] as const satisfies readonly BloqueHerramienta[],
  cierreTitulo: "La página de los estudiantes",
  cierreTexto:
    "Nexo Derecho fue creada por estudiantes para estudiantes. Un espacio pensado para ayudarte a organizar tu carrera y aprovechar mejor las herramientas disponibles.",
  cta: "VISITAR NEXO DERECHO",
} as const;

export const paginaNa = {
  titulo: "Conocé la página de Nueva Abogacía",
  bajada:
    "Un espacio de encuentro, acompañamiento y representación para quienes ejercen la profesión con compromiso.",
  captura: {
    id: "na-web-principal",
    descripcion: "La página principal del sitio de Nueva Abogacía",
    src: "/capturas/na-web-principal.png",
  } satisfies Captura,
  bloques: [
    {
      titulo: "Nuestra misión",
      texto:
        "Construir un espacio de encuentro, acompañamiento y representación para abogadas y abogados que ejercen la profesión con compromiso. Brindamos herramientas concretas de formación, actualización y apoyo profesional, impulsando una abogacía más justa, colectiva y cercana a la realidad cotidiana del ejercicio profesional.",
    },
    {
      titulo: "Nuestra visión",
      texto:
        "Ser una comunidad de referencia para quienes ejercen la abogacía con vocación y responsabilidad. Promovemos un modelo profesional solidario, colectivo, actualizado y con voz propia dentro del ámbito jurídico e institucional. Queremos transformar la forma de ejercer el derecho, haciéndola más accesible, horizontal y comprometida con quienes la sostienen día a día.",
    },
    {
      titulo: "Nuestro objetivo",
      texto:
        "Reunir, formar y representar a abogadas y abogados que caminan los tribunales a diario. Ofrecer espacios de capacitación, redes de apoyo y oportunidades de desarrollo profesional, académico y económico, construidos desde la experiencia real del ejercicio profesional.",
    },
  ],
  cta: "VISITAR LA PÁGINA DE NUEVA ABOGACÍA",
} as const;
