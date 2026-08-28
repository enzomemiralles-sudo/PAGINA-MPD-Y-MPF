import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { privacidad, terminos } from "@/content/legales.generado";

const raiz = resolve(__dirname, "..");
const leerMd = (archivo: string) =>
  readFileSync(resolve(raiz, "content/legales", archivo), "utf8");

const DOCS = [
  { nombre: "términos", doc: terminos, md: "terminos-y-condiciones.md" },
  { nombre: "privacidad", doc: privacidad, md: "politica-de-privacidad.md" },
] as const;

/**
 * El texto legal llegó redactado y no se toca. Vive en los .md de
 * content/legales/ y el .ts se genera desde ahí con scripts/legales_a_ts.py.
 *
 * Esto comprueba que sigan diciendo lo mismo, en las dos direcciones: que no
 * falte en la página nada que el documento diga, y que la página no diga nada
 * que el documento no tenga. Sin esto, editar el .md y olvidarse de regenerar
 * —o retocar el .ts a mano— publicaría un texto legal que nadie aprobó.
 */
describe("las páginas legales dicen exactamente lo que dicen los documentos", () => {
  /** Todo el texto de un documento, renglón por renglón, sin marcas. */
  function renglonesDelMd(md: string): string[] {
    return md
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== "---")
      .map((l) => l.replace(/^#+\s*/, "").replace(/^-\s*/, "").replace(/\*\*/g, "").trim());
  }

  /** Todo el texto del contenido generado. */
  function renglonesDelDoc(doc: (typeof DOCS)[number]["doc"]): string[] {
    return [
      doc.titulo,
      doc.actualizado,
      ...doc.entradilla,
      ...doc.bloques.flatMap((b) => [b.h, ...b.p, ...(("lista" in b ? b.lista : []) as string[])]),
      ...doc.firma,
    ].filter(Boolean);
  }

  for (const { nombre, doc, md } of DOCS) {
    it(`${nombre}: no falta nada del documento`, () => {
      const enPagina = new Set(renglonesDelDoc(doc));
      const faltan = renglonesDelMd(leerMd(md)).filter((l) => !enPagina.has(l));
      expect(faltan, `renglones del .md que la página no muestra:\n${faltan.join("\n")}`).toEqual(
        [],
      );
    });

    it(`${nombre}: no sobra nada en la página`, () => {
      const enDocumento = new Set(renglonesDelMd(leerMd(md)));
      const sobran = renglonesDelDoc(doc).filter((l) => !enDocumento.has(l));
      expect(sobran, `renglones de la página que el .md no tiene:\n${sobran.join("\n")}`).toEqual(
        [],
      );
    });

    it(`${nombre}: la fecha de actualización está a la vista`, () => {
      expect(doc.actualizado).toMatch(/Última actualización/);
    });
  }
});
