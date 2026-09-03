import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { MPF } from "@/content/guia-mpf";
import { MPDGuia } from "@/content/guia-mpd";
import { ejes, grupos } from "@/content/insumos";
import { paginaNa, paginaNexo } from "@/content/organizaciones";
import type { Captura, Guia } from "@/lib/guia/tipos";

/**
 * QUE LO QUE SE ENLAZA EXISTA
 *
 * Dos veces se rompió por lo mismo: una imagen declarada con una ruta que del
 * otro lado no tenía nada. La primera vez las capturas estaban en una carpeta
 * de rutas, que Next no sirve; la segunda, los botones de descarga apuntaban a
 * archivos que nunca se habían subido. Las dos veces compilaba, pasaban los
 * tests y se veía roto recién en el navegador.
 *
 * Una ruta bajo `public/` se puede comprobar acá mismo, contra el disco.
 */

const PUBLIC = join(process.cwd(), "public");

function capturasDe(guia: Guia): Captura[] {
  return guia.pasos.flatMap((p) => p.capturas ?? []);
}

const todas: { donde: string; captura: Captura }[] = [
  ...capturasDe(MPF).map((captura) => ({ donde: "guía del MPF", captura })),
  ...capturasDe(MPDGuia).map((captura) => ({ donde: "guía del MPD", captura })),
  ...paginaNexo.herramientas.map((h) => ({ donde: "página de Nexo", captura: h.captura })),
  { donde: "página de Nueva Abogacía", captura: paginaNa.captura },
];

describe("las capturas", () => {
  it("son más de una, o este test no está mirando nada", () => {
    expect(todas.length).toBeGreaterThan(15);
  });

  it.each(todas.filter((t) => t.captura.src !== null))(
    "$captura.id ($donde) existe en public/",
    ({ captura }) => {
      // src no es null: lo filtra el `.filter` de arriba, pero TypeScript no lo sabe.
      const src = captura.src as string;
      expect(src.startsWith("/")).toBe(true);
      expect(existsSync(join(PUBLIC, src))).toBe(true);
    },
  );

  it("no repite un id", () => {
    const ids = todas.map((t) => t.captura.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("describe todas, incluso las que todavía no existen", () => {
    for (const { captura } of todas) expect(captura.descripcion.trim().length).toBeGreaterThan(10);
  });
});

describe("los insumos", () => {
  it("no declara un eje sin materiales", () => {
    for (const eje of ejes) expect(eje.materiales.length).toBeGreaterThan(0);
  });

  it("enlaza carpetas de Drive, no archivos sueltos", () => {
    for (const eje of ejes) {
      if (eje.carpeta === null) continue;
      expect(eje.carpeta).toMatch(/^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]{20,}$/);
    }
  });

  it("no repite un id de eje", () => {
    const ids = ejes.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("manda a los grupos de WhatsApp por invitación, sin parámetros de rastreo", () => {
    for (const url of Object.values(grupos)) {
      if (url === null) continue;
      expect(url).toMatch(/^https:\/\/chat\.whatsapp\.com\/[\w-]+$/);
    }
  });
});
