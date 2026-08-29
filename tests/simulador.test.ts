import { describe, expect, it } from "vitest";
import { corregir, corregirTipeo, porTema, type ReglasPuntaje } from "@/lib/simulador/puntaje";
import { compararTipeo, distanciaDeEdicion } from "@/lib/simulador/tipeo";

/** Las reglas reales del MPD, confirmadas contra el instructivo de la DGN. */
const MPD: ReglasPuntaje = {
  puntosCorrecta: 10,
  puntosIncorrecta: -10,
  puntosBlanco: 0,
  puntajeInicial: 0,
  puntajeMinimo: 60,
};

const TIPEO: ReglasPuntaje = {
  puntosCorrecta: 0,
  puntosIncorrecta: -5,
  puntosBlanco: 0,
  puntajeInicial: 100,
  puntajeMinimo: 60,
};

const resp = (correctas: number, incorrectas: number, blancos: number) => [
  ...Array.from({ length: correctas }, () => ({ correcta: true as const })),
  ...Array.from({ length: incorrectas }, () => ({ correcta: false as const })),
  ...Array.from({ length: blancos }, () => ({ correcta: null })),
];

describe("puntaje de opción múltiple", () => {
  it("diez correctas es el máximo", () => {
    const r = corregir(resp(10, 0, 0), MPD);
    expect(r.puntaje).toBe(100);
    expect(r.puntajeMaximo).toBe(100);
    expect(r.aprobado).toBe(true);
    expect(r.porcentajeAciertos).toBe(100);
  });

  // Es el caso que define el examen del MPD: con −10 por error, el mínimo de
  // 60 se alcanza con ocho de diez. Siete no alcanza.
  it("ocho correctas y dos incorrectas aprueba justo", () => {
    expect(corregir(resp(8, 2, 0), MPD)).toMatchObject({ puntaje: 60, aprobado: true });
  });

  it("siete correctas y tres incorrectas no aprueba", () => {
    expect(corregir(resp(7, 3, 0), MPD)).toMatchObject({ puntaje: 40, aprobado: false });
  });

  // Dejar en blanco no suma pero tampoco resta: ocho bien y dos en blanco es
  // mejor que ocho bien y dos mal, y el simulador tiene que mostrarlo.
  it("dejar en blanco no descuenta", () => {
    expect(corregir(resp(8, 0, 2), MPD).puntaje).toBe(80);
  });

  it("no le pone un piso de cero al que contestó todo mal", () => {
    expect(corregir(resp(0, 10, 0), MPD).puntaje).toBe(-100);
  });

  it("un intento sin preguntas no divide por cero", () => {
    expect(corregir([], MPD)).toMatchObject({ porcentajeAciertos: 0, puntaje: 0 });
  });
});

describe("puntaje del tipeo", () => {
  it("sin errores queda en cien", () => {
    expect(corregirTipeo(0, TIPEO)).toMatchObject({ puntaje: 100, aprobado: true });
  });

  // El instructivo dice 100, −5 y mínimo 60: son exactamente ocho errores de
  // margen, y el noveno desaprueba.
  it("ocho errores aprueba y nueve no", () => {
    expect(corregirTipeo(8, TIPEO)).toMatchObject({ puntaje: 60, aprobado: true });
    expect(corregirTipeo(9, TIPEO)).toMatchObject({ puntaje: 55, aprobado: false });
  });
});

describe("desempeño por tema", () => {
  it("sin temas cargados devuelve nada, para que la sección no se muestre", () => {
    expect(porTema(resp(3, 1, 0))).toEqual([]);
    expect(porTema([{ correcta: true, tema: "   " }])).toEqual([]);
  });

  it("agrupa y ordena en castellano", () => {
    expect(
      porTema([
        { correcta: true, tema: "Constitucional" },
        { correcta: false, tema: "Constitucional" },
        { correcta: true, tema: "Ética" },
        { correcta: null, tema: "Ética" },
      ]),
    ).toEqual([
      { tema: "Constitucional", correctas: 1, total: 2, porcentaje: 50 },
      { tema: "Ética", correctas: 1, total: 2, porcentaje: 50 },
    ]);
  });
});

describe("comparación del tipeo", () => {
  it("copiar exacto no tiene errores", () => {
    expect(compararTipeo("El Ministerio Público.", "El Ministerio Público.").errores).toBe(0);
  });

  it("el acento cuenta", () => {
    expect(compararTipeo("Público", "Publico").errores).toBe(1);
  });

  it("la mayúscula cuenta", () => {
    expect(compararTipeo("Público", "público").errores).toBe(1);
  });

  // Esto es lo que justifica usar distancia de edición y no comparar posición
  // por posición: una letra de más al principio corre todo el resto, y contar
  // cada letra siguiente como error sería contar un error como veinte.
  it("un carácter de más al principio es UN error, no todo el texto", () => {
    expect(compararTipeo("Ministerio Público", "XMinisterio Público").errores).toBe(1);
  });

  it("un renglón entero que falta cuenta lo que ese renglón mide", () => {
    expect(compararTipeo("uno\ndos", "uno").errores).toBe(4);
  });

  it("por palabra cuenta distinto que por carácter", () => {
    const texto = "el ministerio publico de la defensa";
    const escrito = "el ministerio público de la defensa";
    expect(compararTipeo(texto, escrito, "caracter").errores).toBe(1);
    expect(compararTipeo(texto, escrito, "palabra").errores).toBe(1);
    expect(compararTipeo("abc def", "xyz def", "caracter").errores).toBe(3);
    expect(compararTipeo("abc def", "xyz def", "palabra").errores).toBe(1);
  });

  it("el avance no se pasa de uno aunque escriba de más", () => {
    expect(compararTipeo("hola", "hola y mucho más").avance).toBe(1);
    expect(compararTipeo("hola", "ho").avance).toBe(0.5);
  });

  it("los saltos de línea del principio y del final no cuentan", () => {
    expect(compararTipeo("\nhola\n", "hola").errores).toBe(0);
  });

  it("la distancia es simétrica y con el vacío es el largo", () => {
    expect(distanciaDeEdicion("gato", "pato")).toBe(distanciaDeEdicion("pato", "gato"));
    expect(distanciaDeEdicion("", "hola")).toBe(4);
    expect(distanciaDeEdicion("hola", "")).toBe(4);
  });
});
