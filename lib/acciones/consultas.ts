"use server";

import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";
import { contacto } from "@/content/contacto";

const MOTIVOS = contacto.motivos.map((m) => m.valor) as [string, ...string[]];

const esquema = z.object({
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  motivo: z.enum(MOTIVOS),
  // El tope no es capricho: sin él, el campo es una invitación a pegar un
  // libro entero, y del otro lado hay una tabla y un correo.
  mensaje: z.string().trim().min(4).max(4000),
});

export type CampoConsulta = "nombre" | "email" | "motivo" | "mensaje";
export type ResultadoConsulta =
  | { ok: true }
  | { ok: false; campo: CampoConsulta }
  | { ok: false; campo: null };

/**
 * Avisa por correo que llegó una consulta.
 *
 * Va aparte del guardado y no lo bloquea: si Resend está caído o sin
 * configurar, la consulta igual queda en la base, que es lo que no se puede
 * perder. Un aviso que no sale es una molestia; una consulta que se pierde es
 * alguien que escribió y nunca supo nada.
 */
async function avisar(datos: z.infer<typeof esquema>): Promise<void> {
  const clave = process.env.RESEND_API_KEY;
  const de = process.env.RESEND_FROM;
  if (!clave || !de) return;

  const etiqueta =
    contacto.motivos.find((m) => m.valor === datos.motivo)?.etiqueta ?? datos.motivo;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: de,
        to: contacto.correos.map((c) => c.mail),
        // Para poder responder apretando «responder» y que le llegue a quien
        // escribió, en vez de a nosotros mismos.
        reply_to: datos.email,
        subject: `[${etiqueta}] consulta de ${datos.nombre}`,
        text:
          `Motivo: ${etiqueta}\n` +
          `Nombre: ${datos.nombre}\n` +
          `Correo: ${datos.email}\n\n` +
          datos.mensaje,
      }),
    });
  } catch {
    // Ver arriba: el aviso es lo prescindible.
  }
}

export async function enviarConsulta(entrada: {
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
}): Promise<ResultadoConsulta> {
  const parseo = esquema.safeParse(entrada);
  if (!parseo.success) {
    const campo = parseo.error.issues[0]?.path[0];
    return {
      ok: false,
      campo: (["nombre", "email", "motivo", "mensaje"] as const).find((c) => c === campo) ?? null,
    };
  }

  const sb = await crearClienteServidor();
  // Sin Supabase configurado el formulario valida y responde igual, para poder
  // ver el flujo entero antes de tener la base. Es el mismo criterio que usa
  // la captura de mails de la portada.
  if (!sb) return { ok: true };

  const { error } = await sb.from("consultas").insert({
    nombre: parseo.data.nombre,
    email: parseo.data.email,
    motivo: parseo.data.motivo,
    mensaje: parseo.data.mensaje,
    origen: "contacto",
  });

  if (error) return { ok: false, campo: null };

  await avisar(parseo.data);
  return { ok: true };
}
