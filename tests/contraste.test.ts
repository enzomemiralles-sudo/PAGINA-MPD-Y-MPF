import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AA_TEXTO, contraste, resolver } from "@/lib/marca/contraste";
import {
  DONDE, MARCAS, NUNCA_TEXTO, PIELES, STOPS_BRILLO, TOKENS_DE_FONDO, TOKENS_DE_TEXTO,
} from "@/lib/marca/tokens";

const css = readFileSync(resolve(__dirname, "../styles/tokens.css"), "utf8");

/**
 * El contraste se calcula, no se compara contra una tabla escrita a mano.
 *
 * Se recorre cada piel cruzando todo color de texto contra todo fondo. La
 * tarjeta va incluida porque el par que suele fallar es texto sobre tarjeta,
 * no texto sobre el fondo pelado.
 */
describe("contraste AA", () => {
  for (const marca of MARCAS) {
    const piel = PIELES[marca];
    const base = resolver(piel.fondo, [0, 0, 0]);

    for (const nombreFondo of TOKENS_DE_FONDO) {
      const fondo = resolver(piel[nombreFondo], base);

      for (const nombreTexto of TOKENS_DE_TEXTO) {
        it(`${DONDE[marca]}: --${nombreTexto} sobre --${nombreFondo}`, () => {
          const r = contraste(resolver(piel[nombreTexto], fondo), fondo);
          expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
        });
      }
    }

    it(`${DONDE[marca]}: la letra del botón principal sobre --acento`, () => {
      const bg = resolver(piel.acento, base);
      const r = contraste(resolver(piel["sobre-acento"], bg), bg);
      expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
    });

    it(`${DONDE[marca]}: la letra del botón de marca sobre cada parada de --relleno`, () => {
      // El degradé se rompe en la parada más clara, no en el promedio: si la
      // letra se mide contra el color de fondo declarado, el extremo turquesa
      // pasa desapercibido hasta que alguien no puede leer el botón.
      for (const parada of piel.relleno) {
        const bg = resolver(parada, base);
        const r = contraste(resolver(piel["sobre-relleno"], bg), bg);
        expect(r, `${parada} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
      }
    });

    const acento2 = piel["acento-2"];
    if (acento2) {
      it(`${DONDE[marca]}: la letra sobre --acento-2`, () => {
        const bg = resolver(acento2, base);
        const r = contraste(resolver(piel["sobre-acento-2"], bg), bg);
        expect(r, `${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
      });
    }
  }

  /**
   * La regla no negociable del brief: los dos colores de marca no pintan
   * texto. El azul da 2,8:1 sobre oscuro y el verde 4,6:1, que alcanza para
   * un título grande pero no para leer. Para texto va siempre --acento-texto,
   * y esto comprueba que ninguna piel lo haya asignado a uno de los dos.
   */
  describe("los colores de marca nunca pintan texto", () => {
    for (const marca of MARCAS) {
      it(`${DONDE[marca]}: --acento-texto no es un color de marca`, () => {
        const at = PIELES[marca]["acento-texto"].toLowerCase();
        expect(NUNCA_TEXTO as readonly string[]).not.toContain(at);
      });
    }

    it("ninguna regla del CSS pinta texto con --acento", () => {
      // El verde de marca llega a 4,64:1, o sea que pasaría AA. La regla no
      // es de contraste sino de producto: --acento es el color de los botones
      // y los títulos; el texto se lee con --acento-texto.
      const globales = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
      const culpables = [...globales.matchAll(/^\s*([^{}\n]+)\{([^}]*)\}/gm)]
        .filter(([, , cuerpo]) => /(^|[^-])color:\s*var\(--acento\)/.test(cuerpo!))
        .map(([, sel]) => sel!.trim().slice(0, 60));
      expect(culpables).toEqual([]);
    });
  });

  /**
   * El logotipo no es texto, así que le corresponde el 3:1 de los elementos
   * gráficos. Va acá igual porque es lo primero que se ve de la marca: si
   * queda apagado sobre su fondo, no se lee que dice Nexo.
   */
  it("el logotipo de Nexo se distingue de su fondo en las cuatro pieles", () => {
    const AA_GRAFICO = 3;
    const color = css.match(/--logo-nexo:\s*([^;]+);/)?.[1]?.trim();
    expect(color, "falta --logo-nexo").toBeTruthy();
    for (const marca of MARCAS) {
      const fondo = resolver(PIELES[marca].fondo, [0, 0, 0]);
      const r = contraste(resolver(color!, fondo), fondo);
      expect(r, `${color} sobre ${DONDE[marca]} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(
        AA_GRAFICO,
      );
    }
  });

  it("cada stop del gradiente del titular llega a AA", () => {
    const fondo = resolver(PIELES.dual.fondo, [0, 0, 0]);
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

  it("los semánticos y el marcador de revisar viven en :root, no en la marca", () => {
    for (const token of ["ok", "error", "marca-revisar"] as const) {
      const enCss = leerEnBloque(":root", token);
      expect(normalizar(enCss ?? ""), `--${token}`).toBe(normalizar(PIELES.dual[token]));
    }
  });

  for (const marca of MARCAS) {
    for (const token of ["acento", "acento-texto", "fondo", "fondo-bajo"] as const) {
      it(`${DONDE[marca]}: --${token}`, () => {
        const enCss =
          leerEnBloque(`html\\[data-marca="${marca}"\\]`, token) ?? leerEnBloque(":root", token);
        // Los tokens que el CSS resuelve con var() no se comparan literalmente.
        if (enCss?.startsWith("var(")) return;
        expect(normalizar(enCss ?? "")).toBe(normalizar(PIELES[marca][token]));
      });
    }
  }
});
