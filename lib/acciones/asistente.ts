"use server";

import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";
import { responder } from "@/lib/asistente/responder";
import { aVista, type EntradaVista } from "@/lib/asistente/vista";
import type { Ambito, Organismo } from "@/lib/asistente/buscar";
import type { Certeza } from "@/lib/asistente/responder";

/**
 * Por qué esto vive en el servidor y no en el navegador.
 *
 * El corpus entero pesa 35 KB comprimidos, casi la mitad en las variantes
 * —las citas textuales de cómo preguntó la gente—, que son justamente lo que
 * hace andar la búsqueda. Mandarlo al teléfono para poder buscar sin ida y
 * vuelta sale más caro que la ida y vuelta, y además obligaría a tener dos
 * implementaciones del puntaje. Hay una sola, y está acá.
 */

export type RespuestaVista = {
  certeza: Certeza;
  organismo: Organismo | null;
  entrada: EntradaVista | null;
  /** A-06: la consulta relacionada, si la hay. */
  relacionada: { id: string; pregunta: string } | null;
  /** Cuando el documento y el chat no coinciden, van las dos. */
  contraste: { entrada: EntradaVista; que: string } | null;
};

export type Contestacion = {
  consulta: string;
  ambito: Ambito;
  /**
   * Una por organismo. Con MPD o MPF elegido es una sola; con «no estoy
   * seguro» son las dos, separadas y etiquetadas. Nunca combinadas: mezclar
   * dos concursos distintos es el peor error posible acá (A-02).
   */
  partes: RespuestaVista[];
};

const consultaValida = z.string().trim().min(3).max(500);

function contestar(consulta: string, organismo: Organismo): RespuestaVista {
  const r = responder(consulta, organismo);
  return {
    certeza: r.certeza,
    organismo,
    entrada: r.entrada ? aVista(r.entrada) : null,
    relacionada: r.relacionadas[0]
      ? { id: r.relacionadas[0].id, pregunta: r.relacionadas[0].pregunta }
      : null,
    contraste: r.contraste
      ? { entrada: aVista(r.contraste.entrada), que: r.contraste.que }
      : null,
  };
}

/**
 * La respuesta a lo que alguien escribió.
 *
 * No redacta nada: elige una entrada ya escrita y la devuelve con su nivel de
 * respaldo, o dice que no encontró (A-08). Que no haya ningún camino por el
 * que esta función invente texto es la razón de que devuelva entradas y no
 * cadenas.
 */
export async function preguntar(consulta: string, ambito: Ambito): Promise<Contestacion> {
  const parseo = consultaValida.safeParse(consulta);
  const texto = parseo.success ? parseo.data : "";

  const organismos: Organismo[] = ambito === "ambos" ? ["mpd", "mpf"] : [ambito];
  const partes = texto
    ? organismos.map((o) => contestar(texto, o))
    : organismos.map((o) => contestar("", o));

  // Con «no estoy seguro», si sólo uno de los dos tiene respuesta se muestra
  // ese. Mostrar además el «no encontramos» del otro no informa nada: la
  // pregunta era de este concurso.
  const conRespuesta = partes.filter((p) => p.certeza !== "sin_respuesta");

  return {
    consulta: texto,
    ambito,
    partes: conRespuesta.length > 0 ? conRespuesta : partes.slice(0, 1),
  };
}

const consultaSinRespuesta = z.object({
  consulta: z.string().trim().min(4).max(2000),
  organismo: z.enum(["mpd", "mpf", "ambos"]),
  // Opcional de verdad: dejar la duda no tiene que costar dar el correo.
  email: z.union([z.string().trim().toLowerCase().email().max(200), z.literal("")]),
  origen: z.enum(["asistente", "formulario"]),
});

export type CampoSinRespuesta = "consulta" | "email" | null;
export type ResultadoSinRespuesta = { ok: true } | { ok: false; campo: CampoSinRespuesta };

/**
 * A-12. Guarda lo que no supimos contestar.
 *
 * Es la parte que hace que el asistente mejore: sin esto, cada respuesta roja
 * es información que se pierde. Por eso el correo es opcional y la consulta
 * no.
 */
export async function dejarConsulta(entrada: {
  consulta: string;
  organismo: string;
  email: string;
  origen: string;
}): Promise<ResultadoSinRespuesta> {
  const parseo = consultaSinRespuesta.safeParse(entrada);
  if (!parseo.success) {
    const campo = parseo.error.issues[0]?.path[0];
    return { ok: false, campo: campo === "email" ? "email" : campo === "consulta" ? "consulta" : null };
  }

  const sb = await crearClienteServidor();
  // Sin Supabase configurado el formulario valida y responde igual, para poder
  // ver el flujo entero antes de tener la base. Mismo criterio que el
  // formulario de contacto y la captura de mails de la portada.
  if (!sb) return { ok: true };

  const { error } = await sb.from("consultas_sin_respuesta").insert({
    consulta: parseo.data.consulta,
    organismo: parseo.data.organismo,
    email: parseo.data.email === "" ? null : parseo.data.email,
    origen: parseo.data.origen,
  });

  if (error) return { ok: false, campo: null };
  return { ok: true };
}
