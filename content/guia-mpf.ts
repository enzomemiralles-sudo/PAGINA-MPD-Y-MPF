import type { Guia } from "@/lib/guia/tipos";

/**
 * LA GUÍA DE INSCRIPCIÓN DEL MPF
 *
 * Todo lo que está acá sale de las cuatro páginas oficiales de Ingreso
 * Democrático que se citan al pie. Nada de esto es interpretación nuestra: lo
 * que el sitio oficial no dice, acá no está.
 *
 * Los videos son los oficiales del MPF y ya existen, así que van con su id de
 * YouTube desde el arranque. Las capturas todavía no: van declaradas con su id
 * y su descripción para que se vea qué falta y dónde va, y no se renderizan en
 * producción.
 */
export const MPF: Guia = {
  organismo: "mpf",
  sigla: "MPF",
  nombre: "Ministerio Público Fiscal",
  cargo: "Técnico Administrativo",

  // ---------------- ① estado de inscripción ----------------
  estado: {
    cuerpo: [
      "La inscripción es por concurso, y cada concurso tiene su propia ventana de fechas: no hay una sola fecha para todo el país.",
      "El calendario vigente se publica en la sección de novedades del sitio de Ingreso Democrático. Esta guía no reemplaza esa consulta: antes de inscribirte, verificá las fechas en el sitio oficial.",
    ],
    enlaces: [
      {
        texto: "Novedades de Ingreso Democrático",
        url: "https://www.mpf.gob.ar/ingreso-democratico/novedad/?cant=10&orderby=date",
      },
    ],
  },

  // ---------------- ② antes de empezar ----------------
  antes: {
    titulo: "Antes de empezar",
    cuerpo: [
      "Para el agrupamiento Técnico Administrativo hacen falta tres cosas: ser mayor de edad, ser argentino o argentina —o residente permanente en el país— y tener el secundario completo.",
      "Las tres se acreditan cargando documentación en el sistema. Para las dos primeras, DNI y partida de nacimiento o acta de ciudadanía. Para la tercera, certificado o título de estudios secundarios, terciarios o universitarios completos. Excepcionalmente se admite una constancia del establecimiento educativo que certifique que terminaste y que el título está en trámite.",
      "El sistema tiene límites técnicos que conviene conocer antes de escanear nada: acepta JPG, GIF, PNG, TIFF, PDF o DOC, con un máximo de 2048 Kb por archivo, y admite un solo archivo por antecedente. La documentación de varias páginas hay que unificarla en un único PDF, sin perder firmas ni sellos.",
    ],
    items: null,
    advertencias: [],
    enlaces: [
      {
        texto: "Requisitos de inscripción y modo de acreditación",
        url: "https://www.mpf.gob.ar/ingreso-democratico/preguntas/requisitos-de-inscripcion-y-modo-de-acreditacion/",
      },
    ],
    // Alimenta el checklist final junto con los pasos marcados.
    documentacion: [
      "DNI escaneado",
      "Partida de nacimiento o acta de ciudadanía",
      "Certificado o título de secundario completo",
      "CV en un solo archivo",
      "Respaldo de cada antecedente laboral o educativo que vayas a cargar",
    ],
  },

  // ---------------- ③ lo que tenés que saber antes ----------------
  saber: [
    {
      peso: "alta",
      texto:
        "El correo que declarás es el canal oficial de notificación de todo el concurso. Si perdés el acceso a esa casilla, perdés las notificaciones.",
    },
    {
      peso: "alta",
      texto:
        "Registrarte en el sistema y anotarte a un concurso son dos trámites distintos. Tener el perfil cargado no te anota a nada.",
    },
    {
      peso: "alta",
      texto:
        "Solo cuenta la documentación efectivamente cargada en el perfil. Un antecedente declarado sin respaldo adjunto no se computa.",
    },
    {
      peso: "alta",
      texto:
        "Una vez hecha la inscripción a un concurso, los antecedentes de esa inscripción no se pueden modificar. Para cambiar algo hay que cancelar la inscripción y volver a inscribirse, y eso solo se puede dentro del plazo de inscripción.",
    },
    {
      peso: "media",
      texto:
        "Al inscribirte tenés que elegir las ciudades del concurso. Esa elección define a qué vacantes podés acceder, así que conviene pensarla antes de hacer clic.",
    },
    {
      peso: "media",
      texto:
        "El domicilio no impide inscribirse. El requisito de residir a menos de 70 km de la sede se exige recién cuando la persona es propuesta para el cargo.",
    },
    {
      peso: "media",
      texto:
        "No hay límite de concursos en los que podés participar, siempre que cumplas los requisitos.",
    },
    {
      peso: "media",
      texto:
        "Para recuperar la contraseña, hacelo desde una computadora y no desde el celular, y revisá la carpeta de correo no deseado.",
    },
  ],

  // ---------------- ④ guía paso a paso ----------------
  pasos: [
    {
      n: 1,
      titulo: "Preparación",
      resumen: "Reunir y digitalizar la documentación.",
      cuerpo: [
        "Reuní y digitalizá todo lo que enumera «Antes de empezar». Unificá en un PDF por antecedente: el sistema admite un solo archivo por cada uno.",
        "Verificá dos cosas en cada archivo antes de seguir: que pese menos de 2048 Kb y que el formato sea uno de los admitidos. Un archivo que no entra te frena en el momento de cargarlo, que suele ser el peor momento.",
      ],
      capturas: [],
      videos: [],
      advertencias: [],
      enlace: null,
    },
    {
      n: 2,
      titulo: "Registro",
      resumen: "Crear la cuenta en la plataforma.",
      cuerpo: [
        "En la pantalla de inicio de la plataforma, apretá «Ingresar» en el margen izquierdo y después «Registrarse».",
        "Completá los datos y aceptá. A la casilla que declaraste llega un correo de confirmación con un enlace para acceder: el usuario es tu mail y la contraseña la que elegiste.",
        "La contraseña necesita al menos 8 caracteres y cumplir tres de estas cuatro condiciones: mayúsculas, minúsculas, números y caracteres especiales.",
      ],
      capturas: [
        {
          id: "mpf-paso2-registro-01",
          descripcion: "Pantalla de inicio con el botón Ingresar en el margen izquierdo",
          src: null,
        },
        {
          id: "mpf-paso2-registro-02",
          descripcion:
            "Formulario de registro: apellido, nombre, correo repetido dos veces, número de DNI, contraseña repetida, y un código de verificación que hay que copiar de la imagen",
          src: "/capturas/mpf-registro-formulario.png",
        },
      ],
      videos: [
        { id: "mpf-paso2-video", titulo: "Cómo registrarse en el sistema", youtubeId: "1MQ325nqOtE" },
      ],
      advertencias: [],
      enlace: {
        texto: "Ir al sistema de inscripción",
        url: "https://www.mpf.gob.ar/Ingresodemocratico/Account/Login",
      },
    },
    {
      n: 3,
      titulo: "Datos y CV",
      resumen: "Completar el perfil y cargar los antecedentes.",
      cuerpo: [
        "En la pantalla principal andá a la solapa «Antecedentes» → «Datos personales» y completá los campos que falten.",
        "Adjuntá el CV y el DNI. Sin esos dos no te podés inscribir a ningún concurso.",
        "Para cargar cada antecedente: solapa «Antecedentes», elegí la categoría, apretá «Agregar», completá los campos, «Adjuntar documento», «Guardar documento» y por último «Guardar».",
        "Si tenés certificado de discapacidad, se adjunta respondiendo afirmativamente a la pregunta correspondiente dentro de «Antecedentes → Datos personales».",
      ],
      capturas: [
        {
          id: "mpf-paso3-antecedentes-01",
          descripcion:
            "La solapa Antecedentes desplegada, con sus nueve categorías: Datos Personales, Informe de antecedentes penales, Capacitación en Género (Ley Micaela), Experiencia Laboral, Formación Académica, Docencia e Investigación, Becas y Premios, Publicaciones y Visualización",
          src: "/capturas/mpf-antecedentes-menu.png",
        },
        {
          id: "mpf-paso3-antecedentes-02",
          descripcion:
            "El bloque de adjuntos: foto, DNI de los dos lados y título de los dos lados, cada uno aclarando que el antecedente se invalida sin ese respaldo",
          src: "/capturas/mpf-antecedentes-adjuntos.png",
        },
      ],
      videos: [
        { id: "mpf-paso3-datos", titulo: "Datos personales", youtubeId: "llgBCWpZt5Q" },
        { id: "mpf-paso3-adjuntar", titulo: "Adjuntar archivo", youtubeId: "XcKh5C7Qc0g" },
        { id: "mpf-paso3-educativos", titulo: "Antecedentes educativos", youtubeId: "iWil0UiPOjo" },
        { id: "mpf-paso3-laborales", titulo: "Antecedentes laborales", youtubeId: "1cyNFyogg3A" },
        { id: "mpf-paso3-capacitaciones", titulo: "Capacitaciones", youtubeId: "aPYMCTAxKwk" },
        { id: "mpf-paso3-docencia", titulo: "Docencia e investigación", youtubeId: "XhhFml2YM70" },
        { id: "mpf-paso3-publicaciones", titulo: "Publicaciones", youtubeId: "cQSh8EnO7PU" },
      ],
      advertencias: [
        {
          peso: "alta",
          texto:
            "Sin CV y sin DNI adjuntos no podés inscribirte a ningún concurso, por más completo que esté el resto del perfil.",
        },
      ],
      enlace: null,
    },
    {
      n: 4,
      titulo: "Inscripción al concurso",
      resumen: "Anotarte al concurso y elegir las ciudades.",
      cuerpo: [
        "Andá a la solapa «Concursos» → «Concursos con Inscripción Abierta», apretá «Inscribirse», seleccioná las ciudades y confirmá con «Inscribirse».",
        "El sistema te manda por mail un comprobante con el listado de ciudades elegidas y los documentos adjuntados. Guardalo.",
        "Una aclaración que confunde a mucha gente: la sede concursal y las ciudades no son lo mismo. Un mismo concurso puede abarcar varias ciudades de una provincia o región, y vos elegís a cuáles aplicás.",
      ],
      capturas: [
        {
          id: "mpf-paso4-menu-01",
          descripcion:
            "La pantalla principal con la solapa Concursos desplegada y sus tres opciones: Con Inscripción abierta, En trámite y Finalizados",
          src: "/capturas/mpf-menu-concursos.png",
        },
        {
          id: "mpf-paso4-concursos-01",
          descripcion:
            "La lista de concursos con inscripción abierta: número de concurso, resolución, máximo de vacantes y fecha de cierre",
          src: "/capturas/mpf-concursos-abiertos.png",
        },
        {
          id: "mpf-paso4-ciudades-01",
          descripcion:
            "La ficha de un concurso con sus fechas arriba y, debajo, las vacantes agrupadas por ciudad",
          src: "/capturas/mpf-concurso-ciudades.png",
        },
      ],
      videos: [
        { id: "mpf-paso4-video", titulo: "Cómo inscribirse a un concurso", youtubeId: "pt-QqF7gagA" },
      ],
      advertencias: [
        {
          peso: "alta",
          texto:
            "Después de inscribirte no vas a poder modificar los antecedentes de esa inscripción. Revisá todo antes de confirmar.",
        },
      ],
      enlace: null,
    },
  ],

  // ---------------- ⑤ después de inscribirte ----------------
  despues: {
    titulo: "Después de inscribirte",
    cuerpo: ["El proceso sigue así:"],
    items: [
      "Cierra la inscripción.",
      "Se publica la Lista Provisoria de Personas Inscriptas. Incluye a todos los anotados y no significa estar habilitado a rendir.",
      "Se analiza la documentación presentada.",
      "Se publica la Lista Definitiva, solo con quienes cumplieron los requisitos, dentro de los 15 días posteriores al cierre de la inscripción.",
      "Cerca de la fecha de evaluación llegan las notificaciones con lugar, fecha y horario, dirigidas a quienes integren la lista definitiva.",
    ],
    advertencias: [
      {
        peso: "media",
        texto:
          "Estar en la Lista Provisoria no quiere decir que estés habilitado a rendir. Eso lo define la Lista Definitiva.",
      },
    ],
    enlaces: [],
  },

  // ---------------- ⑥ el día del examen ----------------
  examen: {
    titulo: "El día del examen",
    cuerpo: [
      "Para Técnico Administrativo la evaluación es a distancia, por plataforma Moodle, y tiene dos partes.",
      "La parte teórica son 20 preguntas de opción múltiple en 30 minutos. Los contenidos son historia argentina y latinoamericana, sistema constitucional, problemática de género, ordenamiento institucional y jurídico del MPF, y nuevo Código Procesal Penal Federal.",
      "La parte práctica de informática son búsquedas web en el sitio del MPF y en otros portales para localizar fallos, resoluciones y demás documentos, y responder preguntas de opción múltiple sobre lo encontrado. 15 minutos.",
    ],
    items: null,
    advertencias: [],
    enlaces: [
      { texto: "Practicar el simulacro del MPF", url: "/simulador/mpf" },
      { texto: "Insumos de estudio del MPF", url: "/insumos/MPF" },
      {
        texto: "Contenido de la evaluación (sitio oficial)",
        url: "https://www.mpf.gob.ar/ingreso-democratico/contenido-evaluacion-examen-tecnico-administrativo/",
      },
    ],
  },

  // ---------------- ⑦ resultados y orden de mérito ----------------
  // El sitio oficial no publica el detalle de cómo se conforma el orden de
  // mérito para este agrupamiento. Antes que completar con supuestos, la
  // sección dice lo poco que consta y enlaza. Es la instrucción de D4: «Si la
  // información disponible no alcanza para ser precisos, escribir menos».
  resultados: {
    titulo: "Resultados y orden de mérito",
    cuerpo: [
      "Los resultados y el orden de mérito se publican en el sitio oficial de Ingreso Democrático, en la sección de novedades del concurso correspondiente.",
      "El detalle de cómo se pondera cada instancia para conformar el listado no está publicado en las fuentes que consultamos, así que no lo reproducimos acá. Consultá la resolución del concurso al que te inscribiste.",
    ],
    items: null,
    advertencias: [],
    enlaces: [
      {
        texto: "Novedades de Ingreso Democrático",
        url: "https://www.mpf.gob.ar/ingreso-democratico/novedad/?cant=10&orderby=date",
      },
    ],
  },

  // ---------------- ⑧ preguntas frecuentes ----------------
  preguntas: [
    {
      pregunta: "¿Registrarme en el sistema es lo mismo que inscribirme a un concurso?",
      respuesta:
        "No. Son dos trámites distintos. Registrarte crea tu cuenta y te deja cargar el perfil; inscribirte es anotarte a un concurso concreto, desde la solapa «Concursos». Tener el perfil completo no te anota a nada.",
    },
    {
      pregunta: "¿Puedo modificar mis antecedentes después de inscribirme?",
      respuesta:
        "No, los de esa inscripción quedan fijos. Para cambiar algo hay que cancelar la inscripción y volver a inscribirse, y eso solo se puede dentro del plazo de inscripción.",
    },
    {
      pregunta: "¿Puedo anotarme a varios concursos?",
      respuesta:
        "Sí. No hay límite de concursos en los que podés participar, siempre que cumplas los requisitos de cada uno.",
    },
    {
      pregunta: "¿Qué pasa si vivo lejos de la sede?",
      respuesta:
        "El domicilio no impide inscribirte. El requisito de residir a menos de 70 km de la sede se exige recién cuando sos propuesto o propuesta para el cargo.",
    },
    {
      pregunta: "¿Qué formatos y qué peso acepta el sistema?",
      respuesta:
        "JPG, GIF, PNG, TIFF, PDF o DOC, con un máximo de 2048 Kb por archivo. Admite un solo archivo por antecedente, así que la documentación de varias páginas hay que unificarla en un único PDF.",
    },
    {
      pregunta: "No me llegó el mail de confirmación. ¿Qué hago?",
      respuesta:
        "Revisá la carpeta de correo no deseado. Si vas a recuperar la contraseña, hacelo desde una computadora y no desde el celular.",
    },
    {
      pregunta: "¿Cuándo sé si quedé habilitado a rendir?",
      respuesta:
        "Cuando se publica la Lista Definitiva, dentro de los 15 días posteriores al cierre de la inscripción. La Lista Provisoria incluye a todos los anotados y no habilita a nadie.",
    },
    {
      pregunta: "¿Qué diferencia hay entre la sede concursal y las ciudades?",
      respuesta:
        "Un mismo concurso puede abarcar varias ciudades de una provincia o región. Al inscribirte elegís a cuáles aplicás, y esa elección define a qué vacantes podés acceder.",
    },
    {
      pregunta: "Declaré un antecedente pero no adjunté el respaldo. ¿Cuenta?",
      respuesta:
        "No. Solo cuenta la documentación efectivamente cargada en el perfil. Un antecedente sin respaldo adjunto no se computa.",
    },
    {
      pregunta: "¿Cómo es el examen de Técnico Administrativo?",
      respuesta:
        "Es a distancia, por plataforma Moodle, en dos partes: una teórica de 20 preguntas de opción múltiple en 30 minutos, y una práctica de informática de 15 minutos con búsquedas web sobre el sitio del MPF y otros portales.",
    },
    {
      pregunta: "¿Tengo que presentar el título si todavía está en trámite?",
      respuesta:
        "Excepcionalmente se admite una constancia del establecimiento educativo que certifique que terminaste los estudios y que el título está en trámite.",
    },
    {
      pregunta: "¿Dónde veo las fechas del concurso que me interesa?",
      respuesta:
        "En la sección de novedades del sitio de Ingreso Democrático. Cada concurso tiene su propia ventana de fechas: no hay una sola fecha para todo el país.",
    },
  ],

  fuentes: [
    {
      texto: "Preguntas frecuentes — Ingreso Democrático",
      url: "https://www.mpf.gob.ar/ingreso-democratico/preguntas/preguntas-frecuentes/",
    },
    {
      texto: "Requisitos de inscripción y modo de acreditación",
      url: "https://www.mpf.gob.ar/ingreso-democratico/preguntas/requisitos-de-inscripcion-y-modo-de-acreditacion/",
    },
    {
      texto: "Contenido de la evaluación — Técnico Administrativo",
      url: "https://www.mpf.gob.ar/ingreso-democratico/contenido-evaluacion-examen-tecnico-administrativo/",
    },
    {
      texto: "Novedades de Ingreso Democrático",
      url: "https://www.mpf.gob.ar/ingreso-democratico/novedad/",
    },
  ],
};
