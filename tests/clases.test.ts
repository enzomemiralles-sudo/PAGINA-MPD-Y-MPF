import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const raiz = resolve(__dirname, "..");
const css = readFileSync(resolve(raiz, "app/globals.css"), "utf8");

/**
 * Los `page.tsx` y `layout.tsx` de `app/`, recorriendo la carpeta.
 *
 * Esto salía de `execFileSync("find", ...)`, y en Windows `find` es
 * `C:\Windows\System32\find.exe`, que es otro programa: la llamada tiraba
 * excepción, el archivo entero moría al cargarse y vitest lo contaba como
 * archivo fallado con CERO tests corridos. Los treinta de acá desaparecían
 * del total sin que nadie los extrañara.
 *
 * Las rutas salen siempre con `/` para que el nombre de cada test sea el
 * mismo en Windows que en Linux, y ordenadas, que `find` no garantizaba.
 */
function archivosDePagina(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const camino = resolve(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...archivosDePagina(camino));
    else if (entrada.name === "page.tsx" || entrada.name === "layout.tsx") salida.push(camino);
  }
  return salida;
}

/** Las páginas del sitio, con sus className de nivel raíz. */
function paginas(): { archivo: string; clases: string[] }[] {
  return archivosDePagina(resolve(raiz, "app"))
    .map((absoluto) => relative(raiz, absoluto).split(sep).join("/"))
    .sort()
    .map((archivo) => {
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
  const lasPaginas = paginas();

  it("el CSS tiene alguna clase así, si no el test no comprueba nada", () => {
    expect(invisibles.size).toBeGreaterThan(0);
  });

  it("encontró las páginas, si no esto tampoco comprueba nada", () => {
    // El `for` de abajo genera un test por página. Si el recorrido devuelve
    // una lista vacía no genera ninguno y el archivo pasa en verde sin haber
    // mirado nada, que es la peor forma de fallar: en silencio.
    expect(lasPaginas.length).toBeGreaterThan(15);
  });

  for (const { archivo, clases } of lasPaginas) {
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
