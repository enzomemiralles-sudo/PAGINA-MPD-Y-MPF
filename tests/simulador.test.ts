import { describe, expect, it } from "vitest";
import { corregir, corregirTipeo, porTema, type ReglasPuntaje } from "@/lib/simulador/puntaje";
import {
  compararTipeo,
  distanciaDeEdicion,
  erroresHastaAca,
  REGLAS_TIPEO,
} from "@/lib/simulador/tipeo";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

  // El piso es una decisión de presentación, no del instructivo: abajo de
  // cero el número deja de querer decir algo y no cambia ningún aprobado.
  it("no baja de cero aunque conteste todo mal", () => {
    expect(corregir(resp(0, 10, 0), MPD)).toMatchObject({ puntaje: 0, aprobado: false });
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

  // Quien entrega a mitad de camino acumula un error por cada carácter que
  // falta. Sin piso eso daba «−4225 / 100» en pantalla.
  it("muchísimos errores quedan en cero y no en un número absurdo", () => {
    expect(corregirTipeo(865, TIPEO)).toMatchObject({ puntaje: 0, aprobado: false });
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

  // Artículo 27: «las que contengan errores de acentuación» no se tienen por
  // correctamente escritas. Una palabra, un error, cinco puntos.
  it("el acento es un error de palabra", () => {
    expect(compararTipeo("El Ministerio Público", "El Ministerio Publico").errores).toBe(1);
  });

  it("la mayúscula también", () => {
    expect(compararTipeo("El Ministerio Público", "El ministerio Público").errores).toBe(1);
  });

  // Lo que separa contar por palabra de contar por carácter: tres letras mal
  // en la misma palabra siguen siendo UN término erróneo.
  it("varias letras mal en una palabra son un solo error", () => {
    expect(compararTipeo("el ministerio publico", "el xyzisterio publico").errores).toBe(1);
    expect(compararTipeo("el ministerio publico", "el xyzisterio publico", "caracter").errores).toBe(3);
  });

  // Esto es lo que justifica usar distancia de edición: una palabra de más al
  // principio corre todo el resto, y contar cada una como error sería contar
  // un error como veinte.
  it("una palabra de más al principio es UN error", () => {
    expect(compararTipeo("Ministerio Público de la Defensa", "Hola Ministerio Público de la Defensa").errores).toBe(1);
  });

  it("una palabra duplicada es un error", () => {
    expect(compararTipeo("el ministerio público", "el el ministerio público").errores).toBe(1);
  });

  // Artículo 27: «también le será reducido cinco puntos por cada palabra no
  // escrita». En la distancia de edición eso es una operación de borrado, así
  // que sale del mismo cálculo.
  it("las palabras que faltan cuentan una por una", () => {
    expect(compararTipeo("uno dos tres cuatro cinco", "uno dos").errores).toBe(3);
  });

  it("el avance se mide en palabras y no se pasa de uno", () => {
    expect(compararTipeo("uno dos tres cuatro", "uno dos").avance).toBe(0.5);
    expect(compararTipeo("uno dos", "uno dos tres cuatro").avance).toBe(1);
  });

  it("los saltos de línea del principio y del final no cuentan", () => {
    expect(compararTipeo("\nhola\n", "hola").errores).toBe(0);
  });

  it("la distancia por caracteres sigue siendo simétrica", () => {
    expect(distanciaDeEdicion("gato", "pato")).toBe(distanciaDeEdicion("pato", "gato"));
    expect(distanciaDeEdicion("", "hola")).toBe(4);
  });
});

/**
 * El reglamento fija el largo del texto: ciento treinta palabras. Es lo único
 * del texto que la norma dice, así que es lo único que se puede comprobar.
 */
describe("los textos de práctica siguen el artículo 27", () => {
  const textos = JSON.parse(
    readFileSync(resolve(__dirname, "../material/tipeo/textos.json"), "utf8"),
  ) as { titulo: string; texto: string }[];

  it("hay textos cargados", () => {
    expect(textos.length).toBeGreaterThan(0);
  });

  for (const t of textos) {
    it(`«${t.titulo}» tiene ${REGLAS_TIPEO.palabras} palabras`, () => {
      expect(t.texto.trim().split(/\s+/).length).toBe(REGLAS_TIPEO.palabras);
    });
  }

  // Si copiar el texto entero sin errores no diera el máximo, el simulador
  // estaría midiendo otra cosa que el examen.
  it("copiar un texto entero y bien da cero errores", () => {
    for (const t of textos) expect(compararTipeo(t.texto, t.texto).errores).toBe(0);
  });

  it("doce errores desaprueban, que es lo que dicen los artículos 25 y 27", () => {
    expect(corregirTipeo(8, TIPEO).aprobado).toBe(true);
    expect(corregirTipeo(9, TIPEO).aprobado).toBe(false);
  });
});

/**
 * Durante el examen se cuentan los errores cometidos; al entregar, el texto
 * entero. Los dos números son distintos a propósito y los dos son ciertos.
 */
describe("errores mientras se escribe", () => {
  const original =
    "El Ministerio Público de la Defensa es una institución de defensa y protección de derechos humanos que garantiza el acceso a la justicia.";
  const mitad = original.split(" ").slice(0, 10).join(" ");

  it("copiar bien la mitad no acusa ningún error", () => {
    expect(erroresHastaAca(original, mitad)).toBe(0);
  });

  // Es el caso que motivó la función: contra el texto entero, quien copió diez
  // palabras de veinticuatro y se equivocó una vez vería quince errores.
  it("un error en la mitad copiada es un error, no todo lo que falta", () => {
    const conFalla = `${mitad} XXXX`;
    expect(erroresHastaAca(original, conFalla)).toBe(1);
    expect(compararTipeo(original, conFalla).errores).toBeGreaterThan(10);
  });

  it("sin escribir nada no hay errores todavía", () => {
    expect(erroresHastaAca(original, "")).toBe(0);
  });

  // Al terminar, los dos números tienen que coincidir: si no, el contador
  // saltaría en la última palabra.
  it("con el texto completo coincide con la corrección final", () => {
    const conFalla = original.replace("Público", "Publico");
    expect(erroresHastaAca(original, conFalla)).toBe(compararTipeo(original, conFalla).errores);
    expect(erroresHastaAca(original, original)).toBe(0);
  });
});
