import { describe, expect, it } from "vitest";
import { CORPUS } from "@/content/asistente/corpus.generado";
import { OFICIALES } from "@/content/asistente/oficiales";
import { CONTRADICCIONES, FUENTES, RESPALDO, fuentePorId } from "@/content/asistente/fuentes";
import { TODO, buscar, esOficial, normalizar, palabras } from "@/lib/asistente/buscar";
import { responder } from "@/lib/asistente/responder";

describe("el corpus", () => {
  it("trae las dos fuentes de dudas", () => {
    expect(CORPUS.filter((e) => e.organismo === "mpf").length).toBeGreaterThan(50);
    expect(CORPUS.filter((e) => e.organismo === "mpd").length).toBeGreaterThan(10);
  });

  it("ninguna entrada quedó sin pregunta ni sin respuesta", () => {
    const rotas = TODO.filter((e) => e.pregunta.length < 5 || e.respuesta.length < 30);
    expect(rotas.map((e) => e.id)).toEqual([]);
  });

  it("no hay ids repetidos entre el corpus y lo oficial", () => {
    const ids = TODO.map((e) => e.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
});

/**
 * A-02: mezclar información de dos concursos distintos es el peor error
 * posible. El filtro tiene que ser duro, no una preferencia.
 */
describe("el selector de organismo filtra de verdad", () => {
  it("preguntando por el MPD no aparece nada del MPF", () => {
    for (const consulta of ["como es el examen", "que temas entran", "cuanto dura", "que estudio"]) {
      const ajenas = buscar(consulta, "mpd").filter((r) => r.entrada.organismo !== "mpd");
      expect(ajenas, `«${consulta}» trajo del MPF: ${ajenas.map((r) => r.entrada.id)}`).toEqual([]);
    }
  });

  it("y al revés", () => {
    for (const consulta of ["como es el examen", "que temas entran", "donde me inscribo"]) {
      const ajenas = buscar(consulta, "mpf").filter((r) => r.entrada.organismo !== "mpf");
      expect(ajenas).toEqual([]);
    }
  });

  it("«no estoy seguro» sí puede traer de los dos", () => {
    const orgs = new Set(buscar("como es el examen", "ambos", 20).map((r) => r.entrada.organismo));
    expect(orgs.size).toBe(2);
  });
});

/**
 * A-07 y A-08. Verde significa «hay una fuente oficial que dice esto y la
 * podés abrir». Si no la hay, es amarillo; si no hay nada, es rojo.
 */
describe("los tres niveles de certeza", () => {
  it("verde sólo si hay una fuente que se puede abrir", () => {
    for (const e of TODO) {
      const r = responder(e.pregunta, e.organismo);
      if (r.certeza !== "respaldada") continue;
      expect(r.fuente, `${r.entrada?.id} salió verde sin fuente`).not.toBeNull();
      expect(r.fuente!.url).toMatch(/^https:\/\//);
      expect(r.donde, `${r.entrada?.id} no dice en qué parte de la fuente`).toBeTruthy();
    }
  });

  it("lo que no tiene respaldo sale amarillo, nunca verde", () => {
    const sinRespaldo = CORPUS.find((e) => !RESPALDO[e.id])!;
    expect(responder(sinRespaldo.pregunta, sinRespaldo.organismo).certeza).toBe("orientativa");
  });

  // El corazón de la pestaña: preferible decir que no se sabe.
  it("una consulta que el corpus no cubre devuelve rojo", () => {
    for (const consulta of [
      "cuanto cuesta el alquiler en palermo",
      "receta de milanesas a la napolitana",
      "quien gano el mundial de 1986",
      "asdfgh qwerty zxcvb",
    ]) {
      const r = responder(consulta, "mpf");
      expect(r.certeza, `«${consulta}» devolvió ${r.entrada?.id}`).toBe("sin_respuesta");
      expect(r.entrada).toBeNull();
    }
  });

  it("una consulta vacía no inventa nada", () => {
    expect(responder("", "mpf").certeza).toBe("sin_respuesta");
    expect(responder("   ", "ambos").certeza).toBe("sin_respuesta");
  });
});

describe("las preguntas que la gente hace de verdad encuentran su entrada", () => {
  // Salen de A-05 y A-10: son las que el propio CAMBIOS.md pone de ejemplo.
  const casos: [string, "mpd" | "mpf", string][] = [
    ["¿Qué temas entran en el examen del MPF?", "mpf", "of-mpf-temas"],
    ["¿Qué normativa tengo que estudiar para el MPD?", "mpd", "of-mpd-temario"],
    ["¿Cómo se computan las respuestas incorrectas?", "mpd", "of-mpd-examen"],
    ["cuanto dura el examen del mpd", "mpd", "of-mpd-tiempo"],
    ["como se corrige el tipeo", "mpd", "of-mpd-tipeo"],
    ["donde me inscribo", "mpf", "mpf-001"],
    ["el practico del mpf es de word?", "mpf", "of-mpf-practico"],
  ];

  for (const [consulta, ambito, esperado] of casos) {
    it(`«${consulta}» → ${esperado}`, () => {
      const r = responder(consulta, ambito);
      expect(r.entrada?.id).toBe(esperado);
    });
  }

  it("encuentra usando la forma en que se preguntó en el chat, no la prolija", () => {
    // Literal del corpus: así lo escribió alguien en el grupo.
    const r = responder("Saben hasta q hora hay tiempo mañana para inscribirse?", "mpf");
    expect(r.entrada?.id).toBe("mpf-003");
  });
});

/** Cuando el documento y la memoria del chat difieren, se muestran los dos. */
describe("contradicciones", () => {
  it("las registradas apuntan a entradas que existen", () => {
    for (const c of CONTRADICCIONES) {
      expect(TODO.find((e) => e.id === c.oficial), c.oficial).toBeTruthy();
      expect(TODO.find((e) => e.id === c.corpus), c.corpus).toBeTruthy();
    }
  });

  it("preguntar por los temas del MPF muestra la discrepancia, no una sola versión", () => {
    const r = responder("¿Qué temas entran en la parte teórica?", "mpf");
    expect(r.entrada?.id).toBe("of-mpf-temas");
    expect(r.contraste).not.toBeNull();
    expect(r.contraste!.entrada.id).toBe("mpf-053");
    expect(r.contraste!.que).toMatch(/género|Procesal/);
  });
});

describe("las fuentes", () => {
  it("todas tienen una URL de verdad", () => {
    for (const f of FUENTES) expect(f.url, f.id).toMatch(/^https:\/\/\S+$/);
  });

  it("cada entrada oficial apunta a una fuente que existe y dice dónde", () => {
    for (const e of OFICIALES) {
      expect(fuentePorId(e.fuente), `${e.id} → ${e.fuente}`).toBeTruthy();
      expect(e.donde.length, e.id).toBeGreaterThan(3);
    }
  });

  it("cada respaldo del corpus apunta a una entrada y a una fuente que existen", () => {
    for (const [id, ref] of Object.entries(RESPALDO)) {
      expect(CORPUS.find((e) => e.id === id), id).toBeTruthy();
      expect(fuentePorId(ref.fuente), ref.fuente).toBeTruthy();
    }
  });

  it("una entrada oficial es de la misma jurisdicción que su fuente", () => {
    for (const e of OFICIALES) {
      const f = fuentePorId(e.fuente)!;
      expect(f.organismo === "ambos" || f.organismo === e.organismo, `${e.id}`).toBe(true);
    }
  });
});

describe("normalización", () => {
  it("los acentos y la puntuación no cambian la búsqueda", () => {
    expect(normalizar("¿Cuántas preguntas?")).toBe("cuantas preguntas");
    expect(palabras("¿Qué temas entran en el examen?")).toEqual(["temas", "entran", "examen"]);
  });

  it("lo oficial gana el empate contra el corpus", () => {
    const oficial = OFICIALES.find((e) => e.id === "of-mpd-tipeo")!;
    const r = buscar(oficial.pregunta, "mpd");
    expect(esOficial(r[0]!.entrada)).toBe(true);
  });
});
