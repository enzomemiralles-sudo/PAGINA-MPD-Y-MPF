import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { MARCA_DE_PERFIL, MARCAS_CONFIG, configDe, laOtra } from "@/lib/marca/marcas";
import { MARCAS } from "@/lib/marca/tokens";

/** Las reglas de marca del brief, escritas como constantes y comprobadas acá. */
describe("qué piel le toca a cada perfil", () => {
  it("estudiante va a Nexo y abogado a Nueva Abogacía", () => {
    expect(MARCA_DE_PERFIL.estudiante).toBe("nexo");
    expect(MARCA_DE_PERFIL.abogado).toBe("na");
  });

  it("«otro» va a la piel neutra, no a una agrupación", () => {
    // Antes iba a Nueva Abogacía: alguien que dijo que no es ni estudiante ni
    // abogado/a terminaba con los colores de una agrupación que no es la suya.
    expect(MARCA_DE_PERFIL.otro).toBe("neutro");
  });
});

describe("la coorganización del pie", () => {
  it("en cada puerta aparece la otra agrupación", () => {
    expect(laOtra("nexo")?.id).toBe("na");
    expect(laOtra("na")?.id).toBe("nexo");
  });

  it("sin puerta elegida no hay «otra»", () => {
    expect(laOtra("dual")).toBeNull();
    expect(laOtra("neutro")).toBeNull();
  });
});

describe("los lemas y los logotipos del pie", () => {
  it("cada agrupación tiene el suyo, y son distintos", () => {
    const lemas = Object.values(MARCAS_CONFIG).map((c) => c.lema);
    expect(lemas).toEqual(["La alternativa en Derecho", "Construyendo una nueva abogacía"]);
    expect(new Set(lemas).size).toBe(2);
  });

  it("el logotipo gigante dice el nombre de la agrupación", () => {
    expect(MARCAS_CONFIG.nexo.gigante).toBe("NEXO DERECHO");
    expect(MARCAS_CONFIG.na.gigante).toBe("NUEVA ABOGACÍA");
  });

  it("las pieles sin agrupación no tienen configuración de marca", () => {
    for (const m of MARCAS) {
      const esAgrupacion = m === "nexo" || m === "na";
      expect(configDe(m) !== null, `${m}`).toBe(esAgrupacion);
    }
  });
});

/**
 * La diferenciación del brief: las dos puertas tienen que distinguirse incluso
 * en escala de grises. Tres marcas lo hacen y ninguna depende del color —el
 * naranja, el ancho de los títulos y su itálica— así que se comprueban sobre
 * el CSS, que es donde viven.
 */
describe("las dos puertas se distinguen sin mirar el color", () => {
  const tokens = readFileSync(resolve(__dirname, "../styles/tokens.css"), "utf8");

  /** El cuerpo de la regla de una piel. */
  function piel(marca: string): string {
    const m = tokens.match(new RegExp(`\\[data-marca="${marca}"\\][^{]*\\{([^}]*)\\}`));
    if (!m?.[1]) throw new Error(`no encontré la piel ${marca}`);
    return m[1];
  }

  function valor(marca: string, token: string): string | null {
    return piel(marca).match(new RegExp(`--${token}:\\s*([^;]+);`))?.[1]?.trim() ?? null;
  }

  it("la itálica en títulos es sólo de Nexo", () => {
    expect(valor("nexo", "ital-estilo")).toBe("italic");
    for (const otra of ["na", "dual", "neutro"]) {
      expect(valor(otra, "ital-estilo"), otra).toBe("normal");
    }
  });

  it("el naranja es sólo de Nexo", () => {
    expect(valor("nexo", "acento-2")).toBe("#f58220");
    for (const otra of ["na", "dual"]) {
      expect(valor(otra, "acento-2"), otra).toBe("transparent");
    }
  });

  it("Nexo usa color plano y Nueva Abogacía siempre el degradé", () => {
    expect(valor("nexo", "relleno")).toBe("#059249");
    expect(valor("na", "relleno")).toMatch(/^linear-gradient/);
  });

  it("los títulos de Nexo son más condensados que los de Nueva Abogacía", () => {
    const nexo = Number(valor("nexo", "ancho-h"));
    const na = Number(valor("na", "ancho-h"));
    expect(nexo).toBeLessThan(na);
  });
});
