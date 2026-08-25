import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AA_TEXTO, contraste, resolver } from "@/lib/marca/contraste";
import { BASE, MARCAS, PIELES, STOPS_BRILLO, TOKENS_DE_FONDO, TOKENS_DE_TEXTO } from "@/lib/marca/tokens";

const css = readFileSync(resolve(__dirname, "../styles/tokens.css"), "utf8");

/**
 * El contraste se calcula, no se compara contra una tabla escrita a mano.
 *
 * Se recorre el producto de tokens de texto por tokens de fondo, en las tres
 * marcas. Incluye --superficie porque el vidrio es más claro que el fondo
 * base: el par que puede fallar es texto sobre vidrio, no texto sobre negro.
 */
describe("contraste AA", () => {
  for (const marca of MARCAS) {
    const piel = PIELES[marca];

    const fondos: [string, string][] = [
      ...TOKENS_DE_FONDO.map((f) => [f, BASE[f]] as [string, string]),
      // El vidrio se compone sobre --tinta, así que su fondo efectivo es
      // superficie sobre tinta.
      ["superficie", piel.superficie],
    ];

    const textos: [string, string][] = [
      ...TOKENS_DE_TEXTO.map((t) => [t, BASE[t]] as [string, string]),
      ["acento-texto", piel["acento-texto"]],
      ["marca-revisar", piel["marca-revisar"]],
    ];

    for (const [nombreFondo, valorFondo] of fondos) {
      for (const [nombreTexto, valorTexto] of textos) {
        it(`${marca}: --${nombreTexto} sobre --${nombreFondo}`, () => {
          // La superficie es semitransparente: se aplana sobre --tinta primero.
          const base = resolver(BASE.tinta, [0, 0, 0]);
          const fondo = resolver(valorFondo, base);
          const texto = resolver(valorTexto, fondo);
          const r = contraste(texto, fondo);
          expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
        });
      }
    }
  }

  it("cada stop del gradiente del titular llega a AA", () => {
    const fondo = resolver(BASE.tinta, [0, 0, 0]);
    for (const stop of STOPS_BRILLO) {
      const r = contraste(resolver(stop, fondo), fondo);
      expect(r, `${stop} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
    }
  });

  it("--acento no se usa como color de texto en ninguna marca", () => {
    // --acento es para títulos y botones. El texto va siempre por
    // --acento-texto. Si alguien escribe color:var(--acento) el test lo caza.
    expect(css).not.toMatch(/color:\s*var\(--acento\)/);
  });
});

/**
 * lib/marca/tokens.ts es un espejo de styles/tokens.css. Si se tocan los
 * valores del CSS y no los del espejo, el test de arriba deja de decir la
 * verdad. Esto lo detecta.
 */
describe("el espejo de tokens coincide con el CSS", () => {
  const leer = (bloque: string, token: string): string | null => {
    const sel = bloque === "dual" ? ":root" : `html\\[data-marca="${bloque}"\\]`;
    const re = new RegExp(`${sel}\\s*\\{[^}]*?--${token}:\\s*([^;]+);`, "s");
    return css.match(re)?.[1]?.trim() ?? null;
  };
  const normalizar = (v: string) => v.toLowerCase().replace(/\s+/g, "");

  for (const token of TOKENS_DE_TEXTO) {
    it(`--${token}`, () => {
      expect(normalizar(leer("dual", token) ?? "")).toBe(normalizar(BASE[token]));
    });
  }

  for (const marca of MARCAS) {
    for (const token of ["acento-texto", "marca-revisar"] as const) {
      it(`${marca}: --${token}`, () => {
        expect(normalizar(leer(marca, token) ?? "")).toBe(normalizar(PIELES[marca][token]));
      });
    }
  }
});
