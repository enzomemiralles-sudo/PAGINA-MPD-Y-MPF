/** Textos de la página de control de pieles. */
export const pieles = {
  titulo: "Las dos pieles",
  bajada:
    "La misma pantalla con las cuatro pieles, para poder compararlas de un vistazo. Si algo se ve mal acá, se ve mal en todo el sitio.",
  nota: "Ningún componente de esta página sabe qué marca está mostrando: todo sale de variables CSS.",
  muestras: {
    boton: {
      titulo: "Botones",
      principal: "Empezar gratis",
      // El de marca es donde se ve la diferenciación: Nexo va en color plano
      // y Nueva Abogacía siempre con el degradé azul → turquesa.
      marca: "Practicar",
      secundario: "Ver más",
    },
    enlace: {
      titulo: "Enlaces",
      texto: "El texto de un párrafo con",
      enlace: "un enlace adentro",
      cola: "que tiene que leerse sin esfuerzo.",
    },
    tarjeta: {
      titulo: "Tarjeta",
      rotulo: "Simulador",
      cabeza: "Examen teórico",
      cuerpo:
        "Veinte preguntas en treinta minutos. Cada acierto suma cinco y cada error resta cinco.",
    },
    respuestas: {
      titulo: "Corrección",
      // Es la zona donde el acento de marca está prohibido: el verde de Nexo
      // no puede ser el verde de «correcta».
      nota: "Acá no entra el color de marca. Sólo neutros y los dos semánticos.",
      correcta: "Tribunal Oral en lo Criminal Federal.",
      incorrecta: "Cámara Nacional de Apelaciones del Trabajo.",
      sinResponder: "Cámara Nacional de Casación.",
      rotuloCorrecta: "Correcta",
      rotuloIncorrecta: "Incorrecta",
    },
    divisor: { titulo: "Divisor" },
    tipografia: {
      titulo: "Títulos",
      texto: "La itálica condensada es sólo de Nexo",
    },
  },
} as const;
