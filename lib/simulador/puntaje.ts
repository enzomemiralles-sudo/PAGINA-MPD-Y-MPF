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

/**
 * El puntaje no baja de cero.
 *
 * DECISIÓN, no dato: el instructivo no dice qué pasa por debajo de cero, y no
 * lo dice porque no le hace falta —el examen ya está perdido mucho antes—.
 * Sin piso, alguien que se queda a mitad del tipeo ve «−4225 / 100», que no
 * es un puntaje: es ruido. La escala es de 0 a 100 y abajo de 0 el número
 * deja de querer decir algo.
 *
 * No cambia ningún aprobado ni ningún desaprobado: el mínimo es 60 y todo
 * esto pasa muy por debajo. Si algún día se confirma que el examen real
 * informa negativos, se saca de acá y de ningún otro lado.
 */
const conPiso = (puntaje: number) => Math.max(0, puntaje);

export function corregir(
  respuestas: readonly RespuestaCorregida[],
  reglas: ReglasPuntaje,
): Resultado {
  const total = respuestas.length;
  const correctas = respuestas.filter((r) => r.correcta === true).length;
  const incorrectas = respuestas.filter((r) => r.correcta === false).length;
  const enBlanco = total - correctas - incorrectas;

  const puntaje = conPiso(
    reglas.puntajeInicial +
      correctas * reglas.puntosCorrecta +
      incorrectas * reglas.puntosIncorrecta +
      enBlanco * reglas.puntosBlanco,
  );

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
  const puntaje = conPiso(reglas.puntajeInicial + errores * reglas.puntosIncorrecta);
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
