import type { PasoGuia } from "@/lib/guia/tipos";

/**
 * LAS ETAPAS 2 Y 3 DEL MPD: ingresar a la plataforma y rendir.
 *
 * Fuente única: «Guía para el examen del MPD — Parte 2», de Nexo, Facultad de
 * Derecho (UBA). No sale del material viejo de inscripción como el resto de
 * `guia-mpd.ts`, y por eso vive en su propio archivo: es contenido propio,
 * verificado por quien lo escribió, y mezclarlo con el adaptador del material
 * viejo escondería de dónde viene cada cosa.
 *
 * Las capturas están recortadas de ese mismo PDF y viven en /public/capturas
 * con el prefijo `mpd-examen-`.
 *
 * La numeración arranca de 1 en cada etapa: son dos acordeones distintos y
 * «Paso 1 de 3» se lee dentro de su etapa, no sobre el total de la guía.
 */

/** ⑤ Etapa 2. Del mail con la clave temporal hasta poder entrar cuando quieras. */
export const PASOS_INGRESO: PasoGuia[] = [
  {
    n: 1,
    titulo: "Recibir usuario y contraseña",
    resumen: "Llega un mail entre 72 y 48 horas antes de tu turno.",
    cuerpo: [
      "Entre 72 y 48 horas antes del turno asignado, según el cronograma publicado, llega por única vez un correo desde concursos@mpd.gov.ar a la casilla que declaraste en tu inscripción.",
      "Ese correo trae tu usuario —tu DNI sin puntos— y una contraseña temporal.",
    ],
    capturas: [
      {
        id: "mpd-examen-login",
        descripcion:
          "La pantalla de acceso de examen.mpd.gov.ar, con los campos de nombre de usuario y contraseña y el botón Acceder",
        src: "/capturas/mpd-examen-login.png",
        url: "https://examen.mpd.gov.ar/login/index.php",
      },
    ],
    videos: [],
    advertencias: [
      {
        peso: "alta",
        texto:
          "Revisá spam o correo no deseado: el propio mail lo aclara. Si no te llegó en tiempo y forma, no crees una cuenta nueva: usá la opción de recuperación de usuario o contraseña.",
      },
    ],
    enlace: { texto: "examen.mpd.gov.ar", url: "https://examen.mpd.gov.ar/login/index.php" },
  },
  {
    n: 2,
    titulo: "Establecer tu contraseña",
    resumen: "El sistema te obliga a cambiar la clave temporal.",
    cuerpo: [
      "Entrá desde un navegador a examen.mpd.gov.ar con el usuario —DNI sin puntos, o el correo registrado— y la clave temporal que recibiste. El sistema te va a obligar a cambiarla.",
      "La nueva tiene que ser distinta de la actual, de ocho caracteres como mínimo, y llevar al menos un número, una minúscula, una mayúscula y un carácter no alfanumérico (por ejemplo * - #).",
      "Al confirmar, el sistema muestra el mensaje «La contraseña ha cambiado».",
      "Hacé este paso apenas te llegue el mail, no el día del turno. Si más adelante la olvidás, el enlace de recuperación vence a las 4 horas de solicitado, y el examen dura 30 minutos: cualquier problema de contraseña conviene resolverlo con margen.",
    ],
    capturas: [
      {
        id: "mpd-examen-cambiar-clave",
        descripcion:
          "El formulario «Cambiar contraseña», con los campos de contraseña actual, nueva y su repetición, y el detalle de los requisitos",
        src: "/capturas/mpd-examen-cambiar-clave.png",
      },
    ],
    videos: [],
    advertencias: [],
    enlace: null,
  },
  {
    n: 3,
    titulo: "Revisar el menú",
    resumen: "Con la clave nueva podés entrar cuando quieras, sin esperar al examen.",
    cuerpo: [
      "Con usuario y contraseña definitivos podés ingresar cuando quieras a revisar tu situación: no hace falta esperar al día del examen.",
      "La vista principal muestra el examen en el día y horario que te corresponde rendir, según el cronograma publicado en el portal del MPD. Desde esa pantalla se llega al portal por los vínculos del centro o por el logo al pie.",
      "La pantalla también muestra un reloj de sistema («Reloj / Sistema: hh:mm»). Conviene mirarlo: el sistema se guía por su hora, no por la tuya. Para salir, «Cerrar sesión» en el menú desplegable de la esquina superior derecha.",
    ],
    capturas: [
      {
        id: "mpd-examen-menu",
        descripcion:
          "La página principal de la Secretaría de Concursos dentro del sistema de examen, con el reloj del sistema a la derecha y el menú desplegable abierto en «Cerrar sesión»",
        src: "/capturas/mpd-examen-menu.png",
      },
    ],
    videos: [],
    advertencias: [
      {
        peso: "alta",
        texto:
          "Si no lográs ingresar en tiempo y forma, el propio sistema remite al punto de recuperación de usuario o contraseña: no hay otro canal de acceso alternativo documentado.",
      },
    ],
    enlace: null,
  },
];

/** ⑥ Etapa 3. Del día del examen hasta la publicación de los resultados. */
export const PASOS_EXAMEN: PasoGuia[] = [
  {
    n: 1,
    titulo: "El día del examen",
    resumen: "Entrá unos diez minutos antes del horario asignado.",
    cuerpo: [
      "Aproximadamente diez minutos antes del horario asignado según el cronograma del portal, ingresá con tu usuario y contraseña.",
      "Van a aparecer los agrupamientos para los que estás inscripto y habilitado. Podés estar anotado en más de uno —por ejemplo «Agrupamiento Técnico Administrativo N.º 1 - CABA» y «Agrupamiento Servicios Auxiliares N.º 1 - Provincia de Mendoza»— y hay que entrar en cada uno por separado para rendir el examen de cada inscripción vigente.",
    ],
    capturas: [
      {
        id: "mpd-examen-mis-examenes",
        descripcion:
          "La sección «Mis exámenes», con un renglón por cada agrupamiento en el que la persona está inscripta",
        src: "/capturas/mpd-examen-mis-examenes.png",
      },
    ],
    videos: [],
    advertencias: [
      {
        peso: "media",
        texto:
          "Si el examen aparece «restringido» o «no disponible», actualizá la página con F5, o volvé a la página principal y entrá de nuevo. Puede haber unos minutos de diferencia entre tu reloj y el del sistema.",
      },
    ],
    enlace: null,
  },
  {
    n: 2,
    titulo: "Resolver el examen",
    resumen: "Un solo intento, 30 minutos, y una declaración jurada al empezar.",
    cuerpo: [
      "Al iniciar el intento vas a tener que aceptar una declaración jurada en pantalla: declarás conocer el Reglamento de Ingreso y aceptar sus términos, y que cualquier problema de conexión corre bajo tu exclusiva responsabilidad.",
      "Se puede hacer una sola vez: «Intentos permitidos: 1». No hay reintentos ni segunda oportunidad dentro del mismo turno.",
      "El tiempo límite es de 30 minutos, y el reloj empieza a correr desde el horario de inicio de tu turno, no desde que vos te conectás. Entrar tarde no extiende el tiempo.",
      "Si se acaba el tiempo antes de que termines, el sistema te desconecta y envía automáticamente lo que hayas completado hasta ese momento. No hay forma de perder el examen por no llegar a enviarlo a mano.",
    ],
    capturas: [
      {
        id: "mpd-examen-declaracion",
        descripcion:
          "La pantalla del agrupamiento con la declaración jurada, el botón «Intento de cuestionario» y el detalle de intentos permitidos, límite de tiempo y calificación para aprobar",
        src: "/capturas/mpd-examen-declaracion.png",
      },
    ],
    videos: [],
    advertencias: [
      {
        peso: "media",
        texto:
          "Para Técnico Administrativo el examen tiene dos partes con contador propio cada una: la evaluación de conocimientos teóricos y la de informática. Confirmá este punto con la Secretaría de Concursos o con el cronograma exacto de tu convocatoria antes del día del examen, porque no está redactado como regla general en el instructivo.",
      },
    ],
    enlace: null,
  },
  {
    n: 3,
    titulo: "Cómo se puntúa",
    resumen: "Teoría y tipeo: cada una sobre 100, y se aprueba con 60.",
    cuerpo: [
      "Teoría. Opción múltiple, con una sola respuesta correcta posible por pregunta. Podés usar «Quitar mi elección» para dejar una pregunta sin responder. Cada respuesta correcta suma 10 puntos, cada incorrecta resta 10, y una pregunta sin responder no suma ni resta. El puntaje máximo es de 100 y el mínimo para aprobar, 60.",
      "Tipeo. Después de las preguntas teóricas aparece un texto para copiar en un recuadro, respetando exactamente la acentuación, la puntuación, los subrayados, las mayúsculas y minúsculas, las tabulaciones y los espacios. No se evalúa la sangría. El puntaje máximo es de 100, cada error de tipeo u ortografía o palabra no escrita resta 5 puntos, y el mínimo para aprobar es 60.",
    ],
    capturas: [],
    videos: [],
    advertencias: [
      {
        peso: "alta",
        texto:
          "No uses atajos de teclado para dar formato —negrita, subrayado, cursiva—: pueden desconfigurar el examen. Usá los botones de formato visibles en la parte superior del recuadro de texto.",
      },
    ],
    enlace: null,
  },
  {
    n: 4,
    titulo: "Finalizar y enviar",
    resumen: "«Terminar examen…», revisar, y «Enviar todo y terminar».",
    cuerpo: [
      "Cuando termines, hacé clic en «Terminar examen…». El sistema te muestra un resumen con las preguntas respondidas y las que quedaron sin responder.",
      "Esa es tu última oportunidad para cambiar respuestas, siempre dentro del tiempo restante de tu turno. Si estás de acuerdo, «Enviar todo y terminar» dispara un cuadro de confirmación.",
      "Los resultados se publican una vez finalizada la etapa de corrección, en el portal web del MPD.",
      "No hay ninguna constancia ni comprobante de envío más allá de ese cuadro en pantalla: no se manda un mail de acuse de recibo. Si querés dejar registro, sacale una captura al cuadro de confirmación antes de cerrar.",
    ],
    capturas: [],
    videos: [],
    advertencias: [
      {
        peso: "alta",
        texto:
          "Una vez que hagas el envío no vas a poder cambiar las respuestas de ese intento. Sí se pueden cambiar antes de enviar, mientras dure el tiempo del turno, pero no después de confirmar.",
      },
    ],
    enlace: { texto: "Portal del MPD · mpd.gov.ar", url: "https://www.mpd.gov.ar" },
  },
];

/**
 * La bajada de la etapa 2. Son las dos ideas de la página de preparación del
 * PDF: que el sistema del examen es otro, y que al MPD hay que ir a mirarlo.
 */
export const INTRO_INGRESO: string[] = [
  "El sistema del examen es distinto del de la inscripción, con otro usuario: hay que haber completado la etapa 1 para poder entrar.",
  "El MPD no manda mails avisando el día y la hora del examen: se publica en el portal y la carga de ir a mirar es tuya. Guardá en favoritos la ficha de tu examen en mpd.gov.ar y poné un recordatorio semanal para revisarla, desde que cierra la inscripción hasta que rendís.",
];
