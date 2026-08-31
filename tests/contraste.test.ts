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

  /**
   * El logotipo no es texto, así que el umbral que le corresponde es el 3:1
   * de los elementos gráficos, no el 4,5:1 de lectura. Va acá igual porque es
   * lo primero que se ve de la marca: si queda apagado sobre su fondo, no se
   * lee que dice Nexo.
   */
  it("el logotipo de Nexo se distingue de su fondo en las dos superficies", () => {
    const AA_GRAFICO = 3;
    for (const superficie of ["oscura", "clara"] as const) {
      const re = new RegExp(
        `html\\[data-superficie="${superficie}"\\][^{]*\\{[^}]*?--logo-nexo:\\s*([^;]+);`,
        "s",
      );
      const color = css.match(re)?.[1]?.trim();
      expect(color, `falta --logo-nexo en la superficie ${superficie}`).toBeTruthy();

      const piel = PIELES[`${superficie}/${superficie === "oscura" ? "dual" : "neutro"}`]!;
      const fondo = resolver(piel.fondo, [0, 0, 0]);
      const r = contraste(resolver(color!, fondo), fondo);
      expect(r, `${color} sobre ${superficie} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(
        AA_GRAFICO,
      );
    }
  });

  it("cada stop del gradiente del titular llega a AA", () => {
    const fondo = resolver(PIELES["oscura/dual"]!.fondo, [0, 0, 0]);
    for (const stop of STOPS_BRILLO) {
      const r = contraste(resolver(stop, fondo), fondo);
      expect(r, `${stop} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA_TEXTO);
    }
  });
});

/**
 * Qué rutas van en superficie clara está escrito en tres lugares —el script del
 * <head>, el proveedor de marca y el envoltorio del ingreso— y no hay forma de
 * unificarlos: uno es una cadena que corre antes de React, otro es cliente y
 * otro es servidor. Lo que sí se puede es exigir que digan lo mismo.
 *
 * Esto existe porque al agregar /crear-perfil quedó fuera de dos de las tres
 * listas: el proveedor pasaba <html> a oscuro y, como el script de <AplicarPiel>
 * no corre en las navegaciones de cliente, la pestaña principal salía oscura.
 */
describe("las rutas de superficie clara coinciden en los tres lugares", () => {
  const leer = (ruta: string) => readFileSync(resolve(__dirname, "..", ruta), "utf8");

  const rutasDe = (texto: string, re: RegExp) =>
    (texto.match(re)?.[1] ?? "").split("|").map((r) => r.trim()).filter(Boolean).sort();

  it("el script del <head> y el proveedor listan las mismas", () => {
    const enScript = rutasDe(
      leer("components/marca/pielInicial.ts"),
      /var clara=\/\^\\\\\/\(([^)]+)\)/,
    );
    const enProveedor = (leer("components/marca/MarcaProvider.tsx")
      .match(/const PIEL_DEL_SERVIDOR = \[([^\]]+)\]/)?.[1] ?? "")
      .split(",")
      .map((s) => s.trim().replace(/^"\//, "").replace(/"$/, ""))
      .filter(Boolean)
      .sort();

    expect(enScript.length, "no se pudo leer la lista del script").toBeGreaterThan(0);
    expect(enProveedor.length, "no se pudo leer la lista del proveedor").toBeGreaterThan(0);
    expect(enScript).toEqual(enProveedor);
  });

  it("toda ruta con pantalla de ingreso está entre las claras", () => {
    const enScript = rutasDe(
      leer("components/marca/pielInicial.ts"),
      /var clara=\/\^\\\\\/\(([^)]+)\)/,
    );
    for (const ruta of ["ingresar", "crear-perfil", "elegir-perfil", "app", "mi-perfil", "simulador", "revisar"]) {
      expect(enScript, `falta ${ruta}`).toContain(ruta);
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
