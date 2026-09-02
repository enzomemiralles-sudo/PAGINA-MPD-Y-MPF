import { z } from "zod";

/**
 * El formato del JSON que se pega en /admin.
 *
 * Está pensado para escribirse a mano o pedírselo a un modelo, no para salir
 * de un export: nada de ids, nada de `orden`, nada de claves foráneas. El
 * examen se identifica por lo que una persona sabe decir —organismo,
 * instancia y modalidad— y el orden lo pone la base.
 *
 * Lo que NO está acá es tan importante como lo que está: no hay campo
 * `revisada`. Las preguntas entran siempre sin revisar y la política de la
 * base no las deja leer hasta que alguien las apruebe una por una en
 * /revisar. Que no se pueda pedir desde el JSON es a propósito.
 */

export const ORGANISMOS = ["mpd", "mpf"] as const;
export const INSTANCIAS = ["teorico", "practico"] as const;
export const MODALIDADES = ["multiple_choice", "tipeo", "investigacion"] as const;

const opcion = z.object({
  clave: z.string().trim().min(1).max(4),
  texto: z.string().trim().min(1).max(1000),
});

const pregunta = z
  .object({
    enunciado: z.string().trim().min(8).max(4000),
    tipo: z.enum(["multiple_choice", "tipeo"]).default("multiple_choice"),
    opciones: z.array(opcion).max(8).default([]),
    respuesta: z.string().trim().min(1).max(2000),
    tema: z.string().trim().min(2).max(120).nullable().default(null),
    fuente: z.string().trim().max(200).nullable().default(null),
    explicacion: z.string().trim().max(4000).nullable().default(null),
    confianza: z.enum(["alta", "media", "baja"]).default("media"),
  })
  .superRefine((p, ctx) => {
    if (p.tipo !== "multiple_choice") return;

    if (p.opciones.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["opciones"],
        message: "una pregunta de opción múltiple necesita al menos dos opciones",
      });
      return;
    }

    const claves = p.opciones.map((o) => o.clave.toLowerCase());
    if (new Set(claves).size !== claves.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["opciones"],
        message: "hay dos opciones con la misma clave",
      });
    }

    // El error más caro de todos: una respuesta que no es ninguna de las
    // opciones deja la pregunta imposible de acertar. Se corta acá.
    if (!claves.includes(p.respuesta.trim().toLowerCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["respuesta"],
        message: `«${p.respuesta}» no es ninguna de las opciones (${claves.join(", ")})`,
      });
    }
  })
  /**
   * La respuesta se normaliza a la clave EXACTA de la opción.
   *
   * Al corregir se comparan las dos cadenas tal cual —`r.respuesta ===
   * correcta`— y el cliente manda la clave como está escrita en `opciones`.
   * Si el JSON dice «A» y la opción es «a», la comparación falla y todo el
   * mundo contesta mal esa pregunta sin que nada avise. Se arregla acá, en la
   * carga, y no aflojando la comparación: el resto del sistema sigue
   * comparando exacto, que es lo correcto.
   */
  .transform((p) => {
    if (p.tipo !== "multiple_choice") return p;
    const exacta = p.opciones.find(
      (o) => o.clave.toLowerCase() === p.respuesta.trim().toLowerCase(),
    );
    return exacta ? { ...p, respuesta: exacta.clave } : p;
  });

export const lote = z.object({
  organismo: z.enum(ORGANISMOS),
  instancia: z.enum(INSTANCIAS),
  modalidad: z.enum(MODALIDADES),
  preguntas: z.array(pregunta).min(1).max(300),
});

export type Lote = z.infer<typeof lote>;
export type PreguntaDelLote = Lote["preguntas"][number];

/** Un problema, dicho en el lugar donde está: «preguntas[3].respuesta». */
export type Problema = { donde: string; que: string };

export function problemasDe(error: z.ZodError): Problema[] {
  return error.issues.slice(0, 40).map((i) => ({
    donde: i.path.length > 0 ? i.path.join(".") : "(la raíz del JSON)",
    que: i.message,
  }));
}
