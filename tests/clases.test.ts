import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const raiz = resolve(__dirname, "..");
const css = readFileSync(resolve(raiz, "app/globals.css"), "utf8");

/** Las páginas del sitio, con sus className de nivel raíz. */
function paginas(): { archivo: string; clases: string[] }[] {
  const encontrados = execFileSync(
    "find",
    ["app", "-name", "page.tsx", "-o", "-name", "layout.tsx"],
    { cwd: raiz, encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean);

  return encontrados.map((archivo) => {
    const fuente = readFileSync(resolve(raiz, archivo), "utf8");
    const clases = [...fuente.matchAll(/className="([^"]+)"/g)].flatMap((m) =>
      m[1]!.split(/\s+/).filter(Boolean),
    );
    return { archivo, clases };
  });
}

/**
 * Clases que el CSS deja invisibles a la espera de que algo las despierte.
 *
 * `.rev` es la del sistema de movimiento de la portada: arranca en opacity 0 y
 * sólo se ve cuando el observador de scroll le agrega `.on`. Una página que la
 * use se renderiza entera, devuelve 200 y no se ve nada, que es exactamente lo
 * que pasó con /revisar y no lo detectó ningún test: el HTML estaba bien.
 */
function clasesInvisibles(): string[] {
  const invisibles: string[] = [];
  // Bloques de una sola clase, sin combinar, que fijan opacity: 0.
  for (const m of css.matchAll(/^\.([a-z][a-z0-9-]*)\s*\{([^}]*)\}/gm)) {
    if (/opacity:\s*0\s*[;}]/.test(m[2]!)) invisibles.push(m[1]!);
  }
  return invisibles;
}

describe("ninguna página usa una clase que nace invisible", () => {
  const invisibles = new Set(clasesInvisibles());

  it("el CSS tiene alguna clase así, si no el test no comprueba nada", () => {
    expect(invisibles.size).toBeGreaterThan(0);
  });

  for (const { archivo, clases } of paginas()) {
    const malas = clases.filter((c) => invisibles.has(c));
    it(`${archivo}`, () => {
      expect(
        malas,
        `${archivo} usa ${malas.join(", ")}, que el CSS deja en opacity: 0 hasta ` +
          `que el sistema de movimiento le agregue .on. La página se ve en blanco.`,
      ).toEqual([]);
    });
  }
});
