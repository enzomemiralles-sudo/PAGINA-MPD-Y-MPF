import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const raiz = resolve(__dirname, "..");
const dirMigraciones = resolve(raiz, "supabase/migrations");
const instalar = readFileSync(resolve(raiz, "supabase/instalar.sql"), "utf8");
const migraciones = readdirSync(dirMigraciones)
  .filter((f) => f.endsWith(".sql"))
  .sort();

/**
 * `instalar.sql` es lo que alguien pega en el SQL Editor para levantar la base
 * de cero. Se venía manteniendo a mano, y eso se desincroniza solo: se agrega
 * una migración, nadie la copia, y quien instala desde cero se queda sin una
 * tabla. Ahora sale de scripts/instalar_sql.py y esto lo comprueba.
 */
describe("instalar.sql trae todas las migraciones", () => {
  it("hay migraciones que comprobar", () => {
    expect(migraciones.length).toBeGreaterThan(0);
  });

  for (const archivo of migraciones) {
    it(`${archivo} está entero y en orden`, () => {
      const cuerpo = readFileSync(resolve(dirMigraciones, archivo), "utf8").trim();
      expect(instalar, `falta el encabezado de ${archivo}`).toContain(`-- ${archivo}\n`);
      expect(instalar, `${archivo} no está copiado tal cual`).toContain(cuerpo);
    });
  }

  it("van en el mismo orden que en la carpeta", () => {
    const posiciones = migraciones.map((f) => instalar.indexOf(`-- ${f}\n`));
    expect(posiciones).toEqual([...posiciones].sort((a, b) => a - b));
  });
});
