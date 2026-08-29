import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { encabezado, organismos, rendir, reglas } from "@/content/simulador";

const raiz = resolve(__dirname, "..");

const fuentes = [
  "content/simulador.ts",
  ...readdirSync(resolve(raiz, "components/simulador")).map((f) => `components/simulador/${f}`),
];

/** Todo lo que en el código es un texto: comillas simples, dobles y plantillas. */
function textosDe(codigo: string): string[] {
  return [...codigo.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g)]
    .map((m) => m[1] ?? m[2] ?? m[3] ?? "")
    .filter(Boolean);
}

/**
 * S-09 es una regla de negocio, no de redacción: la cantidad de preguntas del
 * banco no se publica en ningún lado de la interfaz, porque la base cambia
 * todo el tiempo y un número fijo envejece mal.
 *
 * Esto no puede comprobar la intención, pero sí lo que se rompe en la
 * práctica: un número escrito al lado de la palabra «pregunta». Lo que sí está
 * permitido es interpolar —«Pregunta 7 de 20»—, que es la longitud de este
 * intento y sale de `exams`, no del tamaño del banco. Una plantilla con
 * ${...} no tiene dígitos, así que pasa sola.
 */
describe("S-09: la cantidad de preguntas no se publica", () => {
  for (const archivo of fuentes) {
    it(`${archivo} no tiene un número pegado a «pregunta»`, () => {
      const sospechosos = textosDe(readFileSync(resolve(raiz, archivo), "utf8")).filter((t) =>
        /(\d[\d.]*\s*\S{0,12}\s*preguntas?)|(preguntas?\s*\S{0,12}\s*\d)/i.test(t),
      );
      expect(sospechosos, `textos con un número al lado de «pregunta»:\n${sospechosos.join("\n")}`)
        .toEqual([]);
    });
  }

  it("la posición dentro del intento sí se puede decir, y sale de parámetros", () => {
    expect(rendir.posicion(7, 20)).toBe("Pregunta 7 de 20");
  });

  it("del banco se habla en términos que no envejecen", () => {
    const vocabulario = /amplia|constante|actualiz|múltiples/i;
    expect(vocabulario.test(encabezado.parrafo)).toBe(true);
  });
});

/**
 * Los textos son de la persona que escribe el sitio y no se reformulan. Esto
 * sólo comprueba que sigan estando los que CAMBIOS.md pide literales.
 */
describe("los textos que CAMBIOS.md fija", () => {
  it("el encabezado (S-01)", () => {
    expect(encabezado.titulo).toBe("Simulador de Exámenes");
    expect(encabezado.bajada).toBe("Prepará tu ingreso. Practicá. Medí tu nivel.");
    expect(encabezado.cta).toBe("Comenzar a practicar");
  });

  it("los botones de cada organismo (S-02)", () => {
    expect(organismos.map((o) => o.cta)).toEqual(["Comenzar MPF", "Comenzar MPD"]);
  });

  it("cada organismo lista sus dos instancias (S-02)", () => {
    for (const o of organismos) {
      expect(o.instancias.map((i) => i.instancia)).toEqual(["teorico", "practico"]);
    }
  });

  it("el aviso de que el MPF usa una escala prestada dice que es orientativo", () => {
    expect(reglas.orientativoMpf).toMatch(/orientativo/i);
  });
});
