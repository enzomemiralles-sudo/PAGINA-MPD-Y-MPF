import { describe, expect, it } from "vitest";
import { lote, problemasDe } from "@/lib/admin/esquema";
import { EJEMPLO } from "@/content/admin";

/** Un lote mínimo válido, para ir rompiéndolo de a un campo por vez. */
function unLote(cambios: Record<string, unknown> = {}) {
  return {
    organismo: "mpd",
    instancia: "teorico",
    modalidad: "multiple_choice",
    preguntas: [
      {
        enunciado: "¿Quién ejerce la superintendencia del Ministerio Público de la Defensa?",
        opciones: [
          { clave: "a", texto: "La Defensoría General de la Nación" },
          { clave: "b", texto: "La Corte Suprema" },
        ],
        respuesta: "a",
        ...cambios,
      },
    ],
  };
}

describe("el JSON que se pega en /admin", () => {
  it("el ejemplo que ofrece la pantalla es válido", () => {
    expect(lote.safeParse(JSON.parse(EJEMPLO)).success).toBe(true);
  });

  it("acepta un lote mínimo y completa lo que falta", () => {
    const r = lote.safeParse(unLote());
    expect(r.success).toBe(true);
    if (!r.success) return;
    const p = r.data.preguntas[0]!;
    expect(p.confianza).toBe("media");
    expect(p.tipo).toBe("multiple_choice");
    expect(p.tema).toBeNull();
  });

  /**
   * El error más caro de todos. Una respuesta que no está entre las opciones
   * deja la pregunta imposible de acertar, y eso no se ve revisando de a una
   * salvo que uno la conteste. Se corta en la carga.
   */
  it("rechaza una respuesta que no es ninguna de las opciones", () => {
    const r = lote.safeParse(unLote({ respuesta: "d" }));
    expect(r.success).toBe(false);
    if (r.success) return;
    const problemas = problemasDe(r.error);
    expect(problemas.some((p) => p.donde.endsWith("respuesta"))).toBe(true);
    expect(problemas.some((p) => p.que.includes("no es ninguna de las opciones"))).toBe(true);
  });

  /**
   * Al corregir se comparan las dos cadenas exacto, y el cliente manda la
   * clave como figura en `opciones`. Si se guardara «A» contra una opción
   * «a», todo el mundo contestaría mal esa pregunta y nada avisaría.
   */
  it("normaliza la respuesta a la clave exacta de la opción", () => {
    const r = lote.safeParse(unLote({ respuesta: " A " }));
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.preguntas[0]!.respuesta).toBe("a");
  });

  it("y respeta la caja de la opción cuando la clave va en mayúscula", () => {
    const r = lote.safeParse(
      unLote({
        opciones: [
          { clave: "A", texto: "Una" },
          { clave: "B", texto: "Otra" },
        ],
        respuesta: "b",
      }),
    );
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.preguntas[0]!.respuesta).toBe("B");
  });

  it("rechaza dos opciones con la misma clave", () => {
    const r = lote.safeParse(
      unLote({
        opciones: [
          { clave: "a", texto: "Una" },
          { clave: "a", texto: "Otra" },
        ],
      }),
    );
    expect(r.success).toBe(false);
  });

  it("rechaza una opción múltiple con una sola opción", () => {
    const r = lote.safeParse(unLote({ opciones: [{ clave: "a", texto: "Sola" }] }));
    expect(r.success).toBe(false);
  });

  it("el tipeo no necesita opciones", () => {
    const r = lote.safeParse(unLote({ tipo: "tipeo", opciones: [], respuesta: "el texto tipeado" }));
    expect(r.success).toBe(true);
  });

  /**
   * Que no se pueda pedir `revisada: true` desde el JSON es la garantía de
   * que nada llega al simulador sin que alguien lo haya mirado. Si alguna vez
   * se agrega ese campo al esquema, este test tiene que fallar.
   */
  it("no hay manera de pedir que entre ya revisada", () => {
    const r = lote.safeParse(unLote({ revisada: true }));
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(Object.keys(r.data.preguntas[0]!)).not.toContain("revisada");
  });

  it("rechaza un organismo que no existe", () => {
    expect(lote.safeParse({ ...unLote(), organismo: "mpn" }).success).toBe(false);
  });

  it("un lote vacío no es un lote", () => {
    expect(lote.safeParse({ ...unLote(), preguntas: [] }).success).toBe(false);
  });

  it("los problemas dicen dónde están", () => {
    const r = lote.safeParse({ ...unLote(), preguntas: [{ enunciado: "corto" }] });
    expect(r.success).toBe(false);
    if (r.success) return;
    for (const p of problemasDe(r.error)) {
      expect(p.donde).toMatch(/^preguntas\.0\./);
      expect(p.que.length).toBeGreaterThan(0);
    }
  });
});
