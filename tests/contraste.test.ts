import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AA_TEXTO, contraste, resolver } from "@/lib/marca/contraste";
import { COMBOS, PIELES, STOPS_BRILLO, TOKENS_DE_FONDO, TOKENS_DE_TEXTO } from "@/lib/marca/tokens";

const css = readFileSync(resolve(__dirname, "../styles/tokens.css"), "utf8");

/**
 * El contraste se calcula, no se compara contra una tabla escrita a mano.
 *
 * Se recorre cada combinación de superficie y marca que la app usa, cruzando
 * todo color de texto contra todo fondo. La tarjeta va incluida porque el par
 * que suele fallar es texto sobre tarjeta, no texto sobre el fondo pelado.
 */
describe("contraste AA", () => {
  for (const { superficie, marca, donde } of COMBOS) {
    const piel = PIELES[`${superficie}/${marca}`]!;
    const base = resolver(piel.fondo, [0, 0, 0]);

    for (const nombreFondo of TOKENS_DE_FONDO) {
      const fondo = resolver(piel[nombreFondo], base);

      for (const nombreTexto of TOKENS_DE_TEXTO) {
        it(`${donde}: --${nombreTexto} sobre --${nombreFondo}`, () => {
          const r = contraste(resolver(piel[nombreTexto], fondo), fondo);
          expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
        });
      }
    }

    it(`${donde}: la letra del botón principal sobre --acento`, () => {
      const bg = resolver(piel.acento, base);
      const r = contraste(resolver(piel["sobre-acento"], bg), bg);
      expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
    });

    const acento2 = piel["acento-2"];
    if (acento2) {
      it(`${donde}: la letra sobre --acento-2`, () => {
        const bg = resolver(acento2, base);
        const r = contraste(resolver(piel["sobre-acento-2"], bg), bg);
        expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
      });
    }
  }

  it("cada stop del gradiente del titular llega a AA", () => {
    const fondo = resolver(PIELES["oscura/dual"]!.fondo, [0, 0, 0]);
    for (const stop of STOPS_BRILLO) {
      const r = contraste(resolver(stop, fondo), fondo);
      expect(r, `${stop} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
    }
  });
});

/** Si alguien toca tokens.css y no el espejo, esto lo caza. */
describe("el espejo de tokens coincide con el CSS", () => {
  const normalizar = (v: string) => v.toLowerCase().replace(/\s+/g, "");

  /**
   * Busca un token dentro del bloque que declara ese selector. El [^{]* del
   * medio existe porque un selector puede venir agrupado con otros por coma:
   * `html[data-marca="nexo"], [data-marca="nexo"] { … }`.
   */
  const leerEnBloque = (selector: string, token: string): string | null => {
    const re = new RegExp(`${selector}[^{]*\\{[^}]*?--${token}:\\s*([^;]+);`, "s");
    return css.match(re)?.[1]?.trim() ?? null;
  };

  // --marca-revisar dejó de ser un color de marca: vive en el bloque de
  // superficie y es el mismo en las tres pieles.
  for (const superficie of ["oscura", "clara"] as const) {
    it(`superficie ${superficie}: --marca-revisar`, () => {
      const enCss = leerEnBloque(`html\\[data-superficie="${superficie}"\\]`, "marca-revisar");
      const piel = PIELES[`${superficie}/${superficie === "oscura" ? "dual" : "neutro"}`]!;
      expect(normalizar(enCss ?? "")).toBe(normalizar(piel["marca-revisar"]));
    });
  }

  for (const { superficie, marca, donde } of COMBOS) {
    const piel = PIELES[`${superficie}/${marca}`]!;
    for (const token of ["acento", "acento-texto"] as const) {
      it(`${donde}: --${token}`, () => {
        // El valor puede estar en el bloque combinado o en el de la marca sola.
        const combinado = leerEnBloque(
          `html\\[data-marca="${marca}"\\]\\[data-superficie="${superficie}"\\]`,
          token,
        );
        const soloMarca = leerEnBloque(`html\\[data-marca="${marca}"\\]`, token);
        const enCss = combinado ?? soloMarca;
        // Los tokens que el CSS resuelve con var() no se comparan literalmente.
        if (enCss?.startsWith("var(")) return;
        expect(normalizar(enCss ?? "")).toBe(normalizar(piel[token]!));
      });
    }
  }
});
