/**
 * El cálculo del puntaje. Puro: no toca la base, no importa nada de Next, y
 * por eso se puede probar sin levantar nada.
 *
 * S-13: ningún número está acá. Duración, cantidad de preguntas, cuánto suma
 * una correcta y cuánto resta una incorrecta salen todos de la fila de
 * `exams`, porque el MPD y el MPF puntúan distinto y eso va a seguir
 * cambiando.
 */

export type ReglasPuntaje = {
  puntosCorrecta: number;
  puntosIncorrecta: number;
  puntosBlanco: number;
  /** 0 en opción múltiple. 100 en el tipeo, que arranca arriba y resta. */
  puntajeInicial: number;
  puntajeMinimo: number;
};

/** Una respuesta ya corregida. `correcta: null` es «no la contestó». */
export type RespuestaCorregida = {
  correcta: boolean | null;
  tema?: string | null;
};

export type Resultado = {
  correctas: number;
  incorrectas: number;
  enBlanco: number;
  total: number;
  puntaje: number;
  puntajeMaximo: number;
  puntajeMinimo: number;
  aprobado: boolean;
  /** Sobre el total del intento, redondeado. */
  porcentajeAciertos: number;
};

export type DesempenoTema = {
  tema: string;
  correctas: number;
  total: number;
  porcentaje: number;
};

export function corregir(
  respuestas: readonly RespuestaCorregida[],
  reglas: ReglasPuntaje,
): Resultado {
  const total = respuestas.length;
  const correctas = respuestas.filter((r) => r.correcta === true).length;
  const incorrectas = respuestas.filter((r) => r.correcta === false).length;
  const enBlanco = total - correctas - incorrectas;

  // Sin piso. Con −10 por error, ocho de diez mal da un número negativo, y
  // ponerle un cero de oficio sería inventar una regla que el instructivo no
  // dice. Si algún día se confirma que el examen real no baja de cero, se
  // agrega acá y se documenta.
  const puntaje =
    reglas.puntajeInicial +
    correctas * reglas.puntosCorrecta +
    incorrectas * reglas.puntosIncorrecta +
    enBlanco * reglas.puntosBlanco;

  return {
    correctas,
    incorrectas,
    enBlanco,
    total,
    puntaje,
    puntajeMaximo: reglas.puntajeInicial + total * reglas.puntosCorrecta,
    puntajeMinimo: reglas.puntajeMinimo,
    aprobado: puntaje >= reglas.puntajeMinimo,
    porcentajeAciertos: total === 0 ? 0 : Math.round((correctas / total) * 100),
  };
}

/**
 * El tipeo no cuenta preguntas: cuenta errores. Se parte de `puntajeInicial`
 * y cada error descuenta `puntosIncorrecta`, que en el MPD son 100 y −5.
 */
export function corregirTipeo(errores: number, reglas: ReglasPuntaje): Resultado {
  const puntaje = reglas.puntajeInicial + errores * reglas.puntosIncorrecta;
  return {
    correctas: 0,
    incorrectas: errores,
    enBlanco: 0,
    total: errores,
    puntaje,
    puntajeMaximo: reglas.puntajeInicial,
    puntajeMinimo: reglas.puntajeMinimo,
    aprobado: puntaje >= reglas.puntajeMinimo,
    porcentajeAciertos: 0,
  };
}

/**
 * Desempeño por tema (S-12).
 *
 * Devuelve la lista vacía cuando ninguna pregunta tiene tema cargado, que hoy
 * es el caso de las 259. La pantalla no muestra la sección: una sección sin
 * datos no se renderiza, y un desglose con una sola fila llamada «sin tema»
 * es peor que no mostrarlo.
 */
export function porTema(respuestas: readonly RespuestaCorregida[]): DesempenoTema[] {
  const cuenta = new Map<string, { correctas: number; total: number }>();

  for (const r of respuestas) {
    const tema = r.tema?.trim();
    if (!tema) continue;
    const fila = cuenta.get(tema) ?? { correctas: 0, total: 0 };
    fila.total += 1;
    if (r.correcta === true) fila.correctas += 1;
    cuenta.set(tema, fila);
  }

  return [...cuenta.entries()]
    .map(([tema, { correctas, total }]) => ({
      tema,
      correctas,
      total,
      porcentaje: Math.round((correctas / total) * 100),
    }))
    .sort((a, b) => a.tema.localeCompare(b.tema, "es"));
}
