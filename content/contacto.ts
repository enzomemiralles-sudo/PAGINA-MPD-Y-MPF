/** Los textos de la página de contacto. Castellano rioplatense, con voseo. */

export const contacto = {
  titulo: "Contacto",
  encabezado: "¿Tenés alguna consulta?",
  destacado: "Estamos para ayudarte.",
  bajada:
    "Si necesitás información sobre Ingreso Democrático, tenés dudas sobre la plataforma, los simuladores, los materiales de preparación o necesitás asistencia, podés comunicarte con nuestro equipo.",

  escribinos: "Escribinos",
  correos: [
    { organizacion: "Nexo Derecho", mail: "nexoderecho@gmail.com" },
    { organizacion: "Nueva Abogacía", mail: "abogacianueva@gmail.com" },
  ],

  redes: "Seguinos en Instagram",
  redesTexto:
    "Encontranos en nuestras redes oficiales para acceder a novedades, información y contenido relacionado con la preparación para el Ingreso Democrático.",
  // El arroba y nada más: una URL larga en un botón no la lee nadie.
  instagram: [
    { arroba: "@nexoderecho", href: "https://instagram.com/nexoderecho" },
    { arroba: "@nueva.abogacia", href: "https://instagram.com/nueva.abogacia" },
  ],

  formulario: {
    titulo: "Formulario de contacto",
    nombre: "Nombre y apellido",
    nombrePlaceholder: "Ingresá tu nombre",
    email: "Correo electrónico",
    emailPlaceholder: "Ingresá tu correo",
    motivo: "Motivo de la consulta",
    motivoPlaceholder: "Elegí un motivo",
    mensaje: "Mensaje",
    mensajePlaceholder: "Escribí tu consulta",
    enviar: "ENVIAR CONSULTA",
    enviando: "Enviando…",
    pie: "Tu consulta será recibida por el equipo de Nexo Derecho y Nueva Abogacía.",
    exitoTitulo: "Recibimos tu consulta.",
    exitoTexto: "Te vamos a responder al correo que dejaste. Gracias por escribirnos.",
    otra: "Hacer otra consulta",
  },

  /** El valor viaja a la base; la etiqueta es lo único que se ve. */
  motivos: [
    { valor: "informacion_general", etiqueta: "Información general" },
    { valor: "ingreso_democratico", etiqueta: "Ingreso Democrático" },
    { valor: "simulador", etiqueta: "Simulador de examen" },
    { valor: "material", etiqueta: "Material de estudio" },
    { valor: "tecnico", etiqueta: "Problemas técnicos" },
    { valor: "otra", etiqueta: "Otra consulta" },
  ],

  errores: {
    nombre: "Escribí tu nombre y apellido.",
    email: "Ese correo no parece válido. Revisá que esté bien escrito.",
    motivo: "Elegí un motivo.",
    mensaje: "Escribí tu consulta.",
    generico: "No pudimos enviarla. Probá de nuevo en un momento.",
  },
} as const;

export type MotivoConsulta = (typeof contacto.motivos)[number]["valor"];
