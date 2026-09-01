import type { Guia } from "@/lib/inscripcion/tipos";

/**
 * La guía de inscripción al MPD.
 *
 * Sale del manual de Nexo (`material/mpd-inscripcion.md`), traducido a pasos
 * navegables. Traducido, no transcripto: se cortaron las frases largas, se
 * separó el instructivo del consejo, y las trampas —lo que hace perder el
 * turno y no está escrito en ningún lado oficial— se sacaron del cuerpo del
 * texto para que se vean solas.
 *
 * Lo que NO se hizo: agregar nada que el manual no diga. Si acá aparece un
 * dato es porque está en el manual. Los pasos son cuatro porque el trámite
 * tiene cuatro; no hay paso de adjuntar documentación porque en el MPD no se
 * adjunta nada, y esa sorpresa está contada donde corresponde.
 */
export const MPD: Guia = {
  organismo: "mpd",
  sigla: "MPD",
  nombre: "Ministerio Público de la Defensa",
  cargo: "Técnico Administrativo",
  fuente:
    "Guía de Nexo, Facultad de Derecho (UBA). Cotejada con el portal del MPD, el Reglamento de ingreso (T.O. Res. DGN N° 1292/21) y los instructivos de la Secretaría de Concursos.",

  checklist: {
    titulo: "Antes de empezar necesitás tener",
    bajada:
      "Conseguí esto ahora, no cuando abra la inscripción. Son cinco días hábiles y no dan para resolver una computadora prestada.",
    items: [
      {
        titulo: "Una PC con Windows",
        texto:
          "No es una recomendación: hay que instalar un programa. No funciona en Mac, Linux, celular ni tablet. Si no tenés, conseguí una prestada antes.",
      },
      {
        titulo: "Tu CUIL, sin guiones ni puntos",
        texto:
          "Para inscribirte se usa el CUIL. Para rendir, después, se usa el DNI. Son dos sistemas distintos y es donde más gente se confunde.",
      },
      {
        titulo: "Un mail que revises de verdad",
        texto: "Incluida la carpeta de spam: ahí caen el enlace de validación y el usuario para rendir.",
      },
      {
        titulo: "Secundario completo",
        texto: "Es el único requisito de estudios del agrupamiento Técnico Administrativo.",
      },
    ],
  },

  destacado: {
    titulo: "Si cursás Derecho, esto vale 41 puntos",
    cuerpo: [
      "Si cursás Derecho de forma regular, la suma de tus dos notas se incrementa un 25 % para armar el orden de mérito (art. 30 del Reglamento de ingreso).",
      "Hay que declararlo en el campo «Título Principal» del CV, dentro del sistema de inscripción. Si no lo cargás ahí no se aplica, y después no se puede reclamar.",
      "Un ejemplo: si sacás 80 en el múltiple choice y 85 en el tipeo, sumás 165. Declarando la condición de estudiante regular, tu puntaje de orden de mérito pasa a 206,25. Son 41,25 puntos de diferencia por un campo de un formulario.",
    ],
  },

  pasos: [
    {
      n: 1,
      titulo: "Instalar la aplicación CONCURSOS",
      resumen: "Se baja un programa y se instala. Desde ahí entrás siempre.",
      donde: "concursos.mpd.gov.ar",
      cuerpo: [
        "Entrá desde una PC con Windows a concursos.mpd.gov.ar y elegí la opción para descargar la webapp de Concursos. Vas a bajar un archivo concursos-prod.msi. Instalalo.",
        "Te queda un acceso directo azul llamado CONCURSOS en el escritorio. De ahí en adelante entrás siempre por ahí, no por el navegador.",
      ],
      puntos: null,
      avisos: [
        {
          tono: "trampa",
          titulo: "Necesitás una PC con Windows, sí o sí",
          texto:
            "El trámite no se hace desde el navegador: hay que instalar un .msi que pide permisos de administrador. No corre en Mac, Linux, celular ni tablet. Resolvé la máquina ahora y no cuando abra la inscripción.",
        },
      ],
      consejo: null,
      esquema: { clave: "instalar", pie: "El camino desde el navegador hasta el acceso directo en el escritorio." },
      capturas: [],
    },
    {
      n: 2,
      titulo: "Registrarte",
      resumen: "Creás tu usuario con el CUIL y validás el correo.",
      donde: "La aplicación CONCURSOS",
      cuerpo: [
        "Abrí la aplicación y elegí la opción de registrarte por primera vez. Te pide el CUIL sin guiones ni puntos, tu correo electrónico y una contraseña.",
        "La contraseña necesita ocho caracteres como mínimo, con al menos un número, una minúscula, una mayúscula y un carácter no alfanumérico (por ejemplo $).",
        "Te llega un mail con un enlace. Abrilo desde la misma PC donde instalaste la aplicación. Ahí completás apellidos, nombres, fecha de nacimiento, género y nacionalidad.",
      ],
      puntos: null,
      avisos: [
        {
          tono: "trampa",
          titulo: "CUIL para inscribirte, DNI para rendir",
          texto:
            "Son dos sistemas distintos, con dos usuarios distintos. Acá va el CUIL. El día que rendís, en la otra plataforma, el usuario es tu número de DNI. Es el punto donde más gente se confunde.",
        },
        {
          tono: "ojo",
          titulo: "Si te dice que el correo ya está registrado",
          texto:
            "No crees otra cuenta. Significa que ya te habías anotado antes a algún examen. Andá directo a recuperar la contraseña.",
        },
      ],
      consejo: null,
      esquema: { clave: "registro", pie: "Lo que pide el registro y qué llega después." },
      capturas: [],
    },
    {
      n: 3,
      titulo: "Cargar el Curriculum Vitae",
      resumen: "Nueve páginas de formulario. Es lo que más tiempo lleva.",
      donde: "La aplicación CONCURSOS",
      cuerpo: [
        "Este paso es previo e independiente de la inscripción, y es el que más tiempo lleva: son nueve páginas de formulario. Se avanza con «Siguiente», que va guardando lo hecho, y se cierra con «Guardar».",
        "Todo lo que cargás tiene carácter de declaración jurada. Falsear u omitir datos implica quedar excluido.",
        "Al terminar, «Guardar». Tiene que aparecerte el mensaje de que el curriculum se guardó correctamente.",
      ],
      puntos: {
        titulo: "Cuatro cosas al llenar el formulario",
        items: [
          {
            titulo: "Los campos de fojas («fs.») van vacíos",
            texto:
              "El sistema es común a todos los trámites de la Secretaría de Concursos, incluidos los que arman legajo físico. Para el Técnico Administrativo no se arma legajo, así que todo campo que diga «a fs.» o pida número de foja se deja en blanco. Seguís con «Siguiente».",
          },
          {
            titulo: "No se sube ningún documento",
            texto:
              "En la tercera página no se adjunta nada, en ningún formato digital. Sólo «Siguiente». Si estabas buscando dónde subir el título o el DNI, no está: no va.",
          },
          {
            titulo: "«Estudiante regular de la carrera»",
            texto:
              "En la segunda página, en Domicilio y Estudios, está el campo «Título Principal». Si ya sos abogado/a, seleccionás el título y ponés la fecha de expedición. Si sos estudiante regular, elegís la opción «Estudiante regular de la carrera» de Derecho y no completás «Fecha de culminación de estudios» ni «Fecha de expedición».",
          },
          {
            titulo: "Los antecedentes se evalúan aparte",
            texto:
              "Las páginas siguientes son para experiencia laboral, académica, docencia y publicaciones. Cargalas si las tenés. Se evalúan según la reglamentación vigente.",
          },
        ],
      },
      avisos: [
        {
          tono: "dato",
          titulo: "El CV te queda cargado para la próxima",
          texto:
            "El sistema guarda a medida que avanzás, así que podés entrar, cargar tres páginas y volver otro día.",
        },
      ],
      consejo:
        "Tomate tu tiempo con el CV. Lo que no conviene es dejarlo para cuando se abra la inscripción, porque los cinco días hábiles se te van entre juntar los datos, acordarte de fechas y descubrir un campo que no entendés. Sobre los antecedentes: cargá todo lo que tengas, aunque te parezca poco. Siendo estudiante eso suele ser ayudantías de cátedra o de investigación, voluntariados, pasantías y prácticas profesionales, cursos y seminarios con certificado, congresos o jornadas, publicaciones si las hay, y cualquier experiencia laboral previa aunque no sea del palo jurídico. Nadie se anota en un examen de ingreso al Estado con la carrera terminada y quince años de experiencia: no tener antecedentes no te descalifica. Cargalos igual, con los datos precisos —institución, período, rol—, porque es información que declarás bajo juramento y porque te queda cargada para la próxima vez.",
      esquema: { clave: "cv", pie: "Las nueve páginas del formulario, y en cuál está cada cosa." },
      capturas: [],
    },
    {
      n: 4,
      titulo: "Inscribirte al examen",
      resumen: "Sólo durante los cinco días hábiles. Acá están casi todas las trampas.",
      donde: "La aplicación CONCURSOS · Menú Principal",
      cuerpo: [
        "Sólo se puede durante los cinco días hábiles que dura la inscripción.",
        "En el Menú Principal ves la cantidad de inscripciones vigentes por agrupamiento. Entrás en Técnico Administrativo, elegís el examen de tu jurisdicción, avanzás con «Siguiente» revisando los datos que trae del CV, y cerrás con «Guardar». Tiene que aparecerte el mensaje de confirmación de que te inscribiste correctamente.",
        "Conviene anotarse en varias jurisdicciones. Pero ojo: el orden de mérito te habilita a ser propuesto únicamente en la jurisdicción en la que te inscribiste, y si más adelante te llaman y rechazás la propuesta, quedás excluido de la lista.",
      ],
      puntos: null,
      avisos: [
        {
          tono: "trampa",
          titulo: "El CV se congela cuando te inscribís",
          texto:
            "El sistema saca una foto de tu CV tal como está en ese instante. Si después modificás cualquier dato, ese cambio no cuenta para el examen. La única forma de que valga es volver a inscribirte, dentro del período abierto. Es, en la práctica, la única manera de corregir un error: por eso conviene anotarse los primeros días y no el último.",
        },
        {
          tono: "trampa",
          titulo: "No te llega ningún comprobante",
          texto:
            "No se emite número de inscripción ni se manda un mail. La única forma de verificar que quedaste inscripto es entrar a «Mis Inscripciones» dentro de la aplicación.",
        },
        {
          tono: "trampa",
          titulo: "El MPD no manda mails de notificación",
          texto:
            "Ni listado de inscriptos, ni fecha y hora de examen, ni resultados. Todo se publica en la ficha del examen en el portal, y la carga de ir a mirar es tuya.",
        },
        {
          tono: "ojo",
          titulo: "El botón «confirmar asistencia» no se toca",
          texto:
            "Aparece porque el sistema es común a otros trámites. Los exámenes del Técnico Administrativo no requieren confirmación de asistencia.",
        },
      ],
      consejo:
        "Anotate el primer o el segundo día, no el último. Es el único margen de error que da el sistema: si te equivocaste en algo del CV, la única forma de arreglarlo es corregirlo y volver a inscribirte, y eso sólo se puede mientras la inscripción siga abierta. El que se anota el viernes a última hora no tiene esa segunda chance. Y una vez inscripto, tené presente que no te va a llegar ningún mail: lo más simple es guardarte la ficha del examen en favoritos y ponerte un recordatorio semanal en el celular desde que cierra la inscripción hasta que rendís.",
      esquema: { clave: "inscribirse", pie: "El camino de menús y la única forma de confirmar que quedaste." },
      capturas: [],
    },
  ],

  secciones: [
    {
      ancla: "usuario-para-rendir",
      titulo: "Tu usuario para rendir",
      bajada: "El examen es en otro sistema, con otro usuario. Entrá antes del día.",
      cuerpo: [
        "El examen se rinde en examen.mpd.gov.ar. Es una plataforma distinta de la de inscripción, con otro usuario.",
        "Entre 72 y 48 horas antes de tu turno te llega un mail desde concursos@mpd.gov.ar con tu usuario —que es tu número de DNI sin puntos— y una contraseña temporal. Revisá spam.",
        "Entrá antes del día del examen y cambiá la contraseña: mismos requisitos que antes, ocho caracteres, número, minúscula, mayúscula y símbolo. Si el mail no llega o no podés entrar, usá «¿Olvidó su nombre de usuario o contraseña?». El enlace de recuperación vale 240 minutos.",
      ],
      puntos: null,
      avisos: [
        {
          tono: "trampa",
          titulo: "Si el problema aparece el día del examen, ya es tarde",
          texto:
            "La Secretaría atiende de lunes a viernes de 9 a 15 h. La ventana de 72 a 48 horas existe justamente para que tengas tiempo de resolver un problema. Entrá, cambiá la clave, verificá que ves el menú principal y cerrá sesión.",
        },
      ],
      consejo: null,
    },
    {
      ancla: "el-dia-del-examen",
      titulo: "El día del examen",
      bajada: "Dos pruebas, treinta minutos en total para las dos.",
      cuerpo: [
        "Entrá unos diez minutos antes de tu horario. Si el examen figura restringido o no disponible, actualizá con F5: puede haber unos minutos de diferencia entre tu reloj y el del sistema.",
      ],
      puntos: null,
      avisos: [
        {
          tono: "trampa",
          titulo: "Los 30 minutos corren desde tu turno, no desde que te conectás",
          texto:
            "Si te conectás diez minutos tarde, tenés veinte minutos. Cuando el turno termina, el sistema te desconecta y envía automáticamente lo que hayas completado.",
        },
      ],
      consejo: null,
    },
    {
      ancla: "que-se-estudia",
      titulo: "Qué se estudia",
      bajada: "Son tres textos y son los únicos. Material gratuito, publicado por el propio MPD.",
      cuerpo: [
        "No entra historia, ni educación cívica, ni derecho procesal penal: eso es del MPF, no del MPD.",
      ],
      puntos: {
        titulo: "Los tres textos",
        items: [
          {
            titulo: "Constitución Nacional",
            texto: "Con foco en el art. 120 y la parte dogmática.",
          },
          { titulo: "Ley 27.149", texto: "Ley Orgánica del MPD. Atención a la estructura del organismo y las funciones." },
          {
            titulo: "Régimen Jurídico del MPD (T.O. 2020)",
            texto:
              "El estatuto del personal: categorías, ingreso, ascensos, derechos y deberes. Es donde más gente se pierde.",
          },
        ],
      },
      avisos: [
        {
          tono: "ojo",
          titulo: "El PDF del Régimen Jurídico trae los textos viejos entre paréntesis",
          texto: "Leé el vigente, no los anteriores.",
        },
      ],
      consejo:
        "Empezá por el Régimen Jurídico, seguí con la Ley 27.149 y cerrá con la Constitución. Leelos enteros al menos una vez antes de empezar a resumir.",
    },
    {
      ancla: "resultados",
      titulo: "Resultados y orden de mérito",
      bajada: "Aprobar no te da el cargo: te da lugar en una lista que dura dos años.",
      cuerpo: [
        "Los resultados se publican en el portal cuando termina la corrección. El dictamen con calificaciones y orden de mérito provisorio sale dentro de los quince días de terminadas las evaluaciones.",
        "Si querés impugnar tenés tres días hábiles desde la notificación, y sólo por arbitrariedad manifiesta, error material o vicio grave de procedimiento. Antes de impugnar podés pedir tu propio examen por correo para verlo corregido.",
        "Se ingresa por el cargo más bajo del agrupamiento, Auxiliar. A los seis meses de servicio efectivo, la confirmación implica el pase automático a Escribiente Auxiliar y se adquiere la estabilidad. En los ascensos, entre dos candidatos con el mismo cargo, hay preferencia obligatoria para quien tenga título de abogado/a.",
      ],
      puntos: null,
      avisos: [
        {
          tono: "trampa",
          titulo: "Aprobar no te da el cargo",
          texto:
            "Te da el derecho a integrar un orden de mérito que dura dos años. Cuando aparece una vacante, el titular de la dependencia elige entre los diez primeros de esa jurisdicción. Por eso la posición importa más que el solo hecho de aprobar.",
        },
      ],
      consejo: null,
    },
  ],

  errores: [
    {
      titulo: "No me llega el mail de confirmación",
      cuerpo: [
        "Depende de qué mail estés esperando. El del registro sí llega: es el que valida tu cuenta, y hay que abrirlo desde la misma PC donde instalaste la aplicación. Si no aparece, revisá spam.",
        "El de la inscripción no llega, porque no existe. El MPD no emite comprobante ni número de inscripción. La única forma de verificar que quedaste anotado es entrar a «Mis Inscripciones» dentro de la aplicación.",
      ],
      paso: 4,
    },
    {
      titulo: "No encuentro dónde subir los documentos",
      cuerpo: [
        "Porque no se suben. En el CV del MPD no se adjunta ningún archivo, en ningún formato: en la tercera página del formulario no hay nada que cargar, se pasa con «Siguiente».",
        "Tampoco se arma legajo físico para el Técnico Administrativo, así que los campos que piden número de foja («a fs.») se dejan en blanco.",
      ],
      paso: 3,
    },
    {
      titulo: "Completé todo, ¿cómo sé si terminé?",
      cuerpo: [
        "Al guardar el CV tiene que aparecer el mensaje de que el curriculum se guardó correctamente. Al inscribirte, el de que te inscribiste correctamente.",
        "Y después, la comprobación que vale: entrá a «Mis Inscripciones». Si tu examen figura ahí, quedaste inscripto. Si no figura, no.",
      ],
      paso: 4,
    },
  ],

  repaso: {
    titulo: "Para repasar",
    grupos: [
      {
        titulo: "Ahora, sin convocatoria abierta",
        items: [
          "Conseguir acceso a una PC con Windows",
          "Instalar la aplicación CONCURSOS",
          "Registrarte con tu CUIL",
          "Cargar las nueve páginas del CV",
          "Verificar que cargaste «Estudiante regular de la carrera» en Título Principal",
          "Empezar a estudiar los tres textos",
        ],
      },
      {
        titulo: "Cuando abra la inscripción (cinco días hábiles)",
        items: [
          "Inscribirte los primeros días, no el último",
          "Confirmar en «Mis Inscripciones» que quedaste anotado",
          "No tocar «confirmar asistencia»",
          "Si tocás algo del CV después, volver a inscribirte",
        ],
      },
      {
        titulo: "Antes del examen",
        items: [
          "Revisar el portal periódicamente: no llegan mails",
          "Entrar a examen.mpd.gov.ar y cambiar la contraseña apenas llegue el usuario",
          "Anotar tu horario exacto de turno",
        ],
      },
    ],
  },

  enlaces: [
    { que: "Portal del MPD", donde: "mpd.gov.ar", url: "https://www.mpd.gov.ar" },
    {
      que: "Inscripciones vigentes",
      donde: "Secretaría de Concursos",
      url: "https://www.mpd.gov.ar/index.php/secretaria-de-concursos-n/inscripciones-vigentes",
    },
    { que: "Sistema de inscripción", donde: "concursos.mpd.gov.ar", url: "https://concursos.mpd.gov.ar" },
    { que: "Plataforma de examen", donde: "examen.mpd.gov.ar", url: "https://examen.mpd.gov.ar" },
    {
      que: "Régimen Jurídico del MPD",
      donde: "PDF oficial",
      url: "https://www.mpd.gov.ar/pdf/REGIMENJURIDICO24.pdf",
    },
    {
      que: "Material de estudio de Nexo",
      donde: "Carpeta compartida",
      url: "https://drive.google.com/drive/folders/1Cetf622l_4iwmPdSGYq56LtfNGVsFNpk",
    },
    {
      que: "Consultas",
      donde: "concursos@mpd.gov.ar · (+5411) 3220-5250 · lunes a viernes de 9 a 15 h",
      url: null,
    },
  ],
};
