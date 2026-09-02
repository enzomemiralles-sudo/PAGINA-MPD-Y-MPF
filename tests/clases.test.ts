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
 * Clases que el CSS deja invisibles o inservibles a la espera de que algo las
 * despierte.
 *
 * Tres formas de lo mismo, y las tres ya pasaron:
 *
 *  · `opacity: 0` — `.rev`, la del sistema de movimiento de la portada: sólo
 *    se ve cuando el observador de scroll le agrega `.on`. Una página que la
 *    use se renderiza entera, devuelve 200 y no se ve nada, que es lo que pasó
 *    con /revisar.
 *  · `display: none` — `.riel`, los rieles verticales decorativos, que arrancan
 *    ocultos y aparecen recién a 1180px. Una página con esa clase directamente
 *    no existe por debajo de ese ancho.
 *  · `pointer-events: none` — la misma `.riel` de 1180px para arriba. La
 *    página se ve pero no se le puede hacer clic a nada, que es peor que no
 *    verla porque parece que anda.
 *
 * El HTML está bien en los tres casos, así que ningún test de contenido los
 * agarra. Éste sí.
 */
function clasesInvisibles(): string[] {
  const invisibles: string[] = [];
  // Bloques de una sola clase, sin combinar, dentro o fuera de media queries.
  for (const m of css.matchAll(/(?:^|\n)\s*\.([a-z][a-z0-9-]*)\s*\{([^}]*)\}/g)) {
    const cuerpo = m[2]!;
    if (
      /opacity:\s*0\s*[;}]/.test(cuerpo) ||
      /display:\s*none\s*[;}]/.test(cuerpo) ||
      /pointer-events:\s*none\s*[;}]/.test(cuerpo)
    ) {
      invisibles.push(m[1]!);
    }
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
        `${archivo} usa ${malas.join(", ")}, que el CSS deja en opacity: 0, ` +
          `display: none o pointer-events: none. La página se renderiza y ` +
          `devuelve 200, pero no se ve o no se le puede hacer clic.`,
      ).toEqual([]);
    });
  }
});
