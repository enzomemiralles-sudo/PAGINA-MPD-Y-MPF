/**
 * De dónde sale una respuesta verde.
 *
 * El corpus de dudas es bueno pero es memoria de gente, no documentación: su
 * `confianza alta` significa «lo preguntaron mucho y las respuestas
 * coincidieron», no «hay una fuente oficial». Y a veces la memoria falla —la
 * entrada mpf-053 lista los temas del teórico del MPF y omite dos de los cinco
 * que el organismo publica—.
 *
 * Por eso el verde no se deduce del corpus. Se gana teniendo una fuente
 * oficial que diga eso, con su ubicación exacta, y que se pueda abrir desde la
 * pantalla. Todo lo que está acá abajo fue leído contra el documento; lo que
 * no se pudo verificar quedó afuera y se responde en amarillo.
 */

export type Fuente = {
  id: string;
  nombre: string;
  url: string;
  organismo: "mpd" | "mpf" | "ambos";
  /** Qué es, en una línea, para quien no conoce el documento. */
  que: string;
};

export const FUENTES: Fuente[] = [
  {
    id: "reglamento-mpd",
    nombre: "Reglamento para el Ingreso de Personal al MPD",
    url:
      "https://www.mpd.gov.ar/users/concursos/REGLAMENTO%20PARA%20EL%20INGRESO%20DE%20PERSONAL%20AL%20MPD%20-texto%20ordenado%20conf%20Res%201124-15-.pdf",
    organismo: "mpd",
    que: "La norma que fija cómo se rinde y cómo se corrige. Texto ordenado conforme Res. DGN 1124/15.",
  },
  {
    id: "concursos-mpd",
    nombre: "Secretaría de Concursos del MPD — inscripciones vigentes",
    url: "https://www.mpd.gov.ar/index.php/secretaria-de-concursos-n/inscripciones-vigentes",
    organismo: "mpd",
    que: "Donde el MPD publica las convocatorias abiertas.",
  },
  {
    id: "contenidos-mpf",
    nombre: "Contenido de la evaluación — Técnico Administrativo (MPF)",
    url: "https://www.mpf.gob.ar/ingreso-democratico/contenido-evaluacion-examen-tecnico-administrativo/",
    organismo: "mpf",
    que: "Los contenidos evaluables que publica el propio Ministerio Público Fiscal.",
  },
  {
    id: "ingreso-mpf",
    nombre: "Ingreso Democrático — Ministerio Público Fiscal",
    url: "https://www.mpf.gob.ar/Ingresodemocratico/",
    organismo: "mpf",
    que: "El sitio donde se hace la inscripción y se publican las convocatorias.",
  },
];

export const fuentePorId = (id: string): Fuente | undefined =>
  FUENTES.find((f) => f.id === id);

/**
 * Entradas del corpus que una fuente oficial respalda tal como están.
 *
 * Son pocas a propósito: sólo las que dicen exactamente lo que dice el
 * documento. `donde` es la ubicación dentro de la fuente, para que quien
 * quiera comprobarlo no tenga que leer el PDF entero.
 */
export const RESPALDO: Record<string, { fuente: string; donde: string }> = {
  // Las tres explican cómo y dónde inscribirse, y enlazan el sitio oficial.
  "mpf-001": { fuente: "ingreso-mpf", donde: "Inscripción" },
  "mpf-002": { fuente: "ingreso-mpf", donde: "Registro de usuario" },
  "mpd-006": { fuente: "concursos-mpd", donde: "Inscripciones vigentes" },
};

/**
 * Donde el documento y la memoria del chat no dicen lo mismo.
 *
 * No se elige una: se muestran las dos y se dice que difieren. Quien estudia
 * necesita saber que hay una discrepancia, sobre todo cuando la versión que
 * circula en los grupos es la que se olvida de algo.
 */
export const CONTRADICCIONES: {
  oficial: string;
  corpus: string;
  que: string;
}[] = [
  {
    oficial: "of-mpf-temas",
    corpus: "mpf-053",
    que:
      "Lo que circuló en el chat no coincide del todo con lo que el MPF publica: la lista oficial incluye problemática de género y Código Procesal Penal Federal, que en el chat no aparecen, y no menciona «cultura general».",
  },
];
