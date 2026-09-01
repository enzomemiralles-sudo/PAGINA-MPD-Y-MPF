import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GUIAS, guiasCargadas } from "@/lib/inscripcion/guias";
import { trampas } from "@/lib/inscripcion/tipos";
import { MPD } from "@/content/inscripcion/mpd";
import { concursosConGuia, loQueHay } from "@/lib/inscripcion/muestra";
import { inscripcionSeccion } from "@/content/landing";

const manual = readFileSync(
  resolve(__dirname, "..", "material/mpd-inscripcion.md"),
  "utf8",
);

/**
 * I-08: la estructura del MPD y la del MPF tienen que ser idénticas.
 *
 * No alcanza con la intención: el tipo `Guia` es el que la impone, y estas
 * pruebas comprueban que el registro tenga los dos organismos desde ahora y
 * que la pantalla se comporte con uno solo cargado.
 */
describe("las dos guías comparten estructura", () => {
  it("el registro tiene los dos organismos desde el principio", () => {
    expect(Object.keys(GUIAS).sort()).toEqual(["mpd", "mpf"]);
  });

  it("hoy sólo el MPD está cargado", () => {
    expect(guiasCargadas().map((g) => g.organismo)).toEqual(["mpd"]);
    expect(GUIAS.mpf).toBeNull();
  });

  it("con una sola guía no se ofrece elegir concurso", () => {
    // El <Selector> se esconde por debajo de dos opciones: un selector de una
    // opción no es un selector.
    expect(guiasCargadas().length).toBeLessThan(2);
  });

  it("una guía nueva entra en el mismo molde o no compila", () => {
    // Si alguien agrega la del MPF salteándose un campo, esto lo caza antes
    // que el navegador.
    const campos = Object.keys(MPD).sort();
    expect(campos).toEqual([
      "cargo", "checklist", "destacado", "enlaces", "errores", "fuente",
      "nombre", "organismo", "pasos", "repaso", "secciones", "sigla",
    ]);
  });
});

/** Las anclas se arman con el organismo adelante para que no choquen. */
describe("los anclajes no se pisan entre organismos", () => {
  it("cada paso y cada sección tiene un ancla propia", () => {
    const anclas = [
      ...MPD.pasos.map((p) => `${MPD.organismo}-paso-${p.n}`),
      ...MPD.secciones.map((s) => `${MPD.organismo}-${s.ancla}`),
    ];
    expect(anclas.length).toBe(new Set(anclas).size);
  });

  it("los pasos van numerados de 1 en adelante, sin saltos", () => {
    expect(MPD.pasos.map((p) => p.n)).toEqual([1, 2, 3, 4]);
  });
});

/**
 * Las trampas son lo que más valor tiene de la guía. Salen de los avisos, no
 * se escriben aparte: así no hay forma de que la lista de arriba y el paso
 * digan cosas distintas.
 */
describe("las trampas", () => {
  it("se sacan de los avisos de los pasos y las secciones", () => {
    const lista = trampas(MPD);
    expect(lista.length).toBeGreaterThanOrEqual(5);
    for (const t of lista) expect(t.aviso.tono).toBe("trampa");
  });

  it("cada una apunta a un ancla que existe", () => {
    const existentes = new Set([
      ...MPD.pasos.map((p) => `paso-${p.n}`),
      ...MPD.secciones.map((s) => s.ancla),
    ]);
    for (const t of trampas(MPD)) expect(existentes).toContain(t.ancla);
  });

  it("están las cinco que nombra la tanda", () => {
    const texto = trampas(MPD).map((t) => `${t.aviso.titulo} ${t.aviso.texto}`).join(" ").toLowerCase();
    for (const clave of ["windows", "cuil", "dni", "se congela", "comprobante", "no manda mails"]) {
      expect(texto, `falta la trampa de «${clave}»`).toContain(clave);
    }
  });
});

/**
 * La guía es una traducción del manual, no una reescritura: si un dato de acá
 * no está allá, lo inventamos nosotros.
 */
describe("nada que el manual no diga", () => {
  const enElManual = (t: string) => manual.toLowerCase().includes(t.toLowerCase());

  it("los datos duros salen del manual", () => {
    for (const dato of [
      "concursos-prod.msi", "nueve páginas", "240 minutos", "cinco días hábiles",
      "Título Principal", "Mis Inscripciones", "examen.mpd.gov.ar", "25 %",
      "tres días hábiles", "Escribiente Auxiliar",
    ]) {
      expect(enElManual(dato), `«${dato}» no está en el manual`).toBe(true);
    }
  });

  it("no hay paso de adjuntar documentación, porque no se adjunta nada", () => {
    const titulos = MPD.pasos.map((p) => p.titulo.toLowerCase()).join(" · ");
    expect(titulos).not.toContain("adjunt");
    expect(manual).toContain("No se sube ningún documento");
  });

  it("la sorpresa de que no se sube nada está contada donde corresponde", () => {
    const errores = MPD.errores.map((e) => `${e.titulo} ${e.cuerpo.join(" ")}`).join(" ");
    expect(errores.toLowerCase()).toContain("no se suben");
  });
});

/** Toda sección sin datos no se renderiza: la portada no promete lo que no hay. */
describe("la muestra no promete lo que todavía no existe", () => {
  it("hoy sólo se anuncian guías y errores frecuentes", () => {
    const hay = loQueHay([]);
    expect(hay.guias).toBe(true);
    expect(hay.errores).toBe(true);
    expect(hay.capturas).toBe(false);
    expect(hay.videos).toBe(false);
  });

  it("los videos se anuncian solos cuando haya uno cargado", () => {
    const hay = loQueHay([
      { id: "1", titulo: "Instalar CONCURSOS", youtube_id: "abc", organismo: "mpd", orden: 1 },
    ]);
    expect(hay.videos).toBe(true);
  });

  it("cada destacado de la portada depende de algo que se puede contar", () => {
    const contables = Object.keys(loQueHay([]));
    for (const d of inscripcionSeccion.destacados) {
      expect(contables, `«${d.texto}» depende de «${d.depende}», que nadie cuenta`).toContain(d.depende);
    }
  });

  it("se dibuja una tarjeta por guía cargada", () => {
    expect(concursosConGuia().map((c) => c.sigla)).toEqual(["MPD"]);
  });
});
