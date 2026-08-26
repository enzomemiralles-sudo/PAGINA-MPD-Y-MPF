"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import type { AuthError } from "@supabase/supabase-js";
import { crearClienteServidor } from "@/lib/supabase/server";
import { errores } from "@/content/auth";

export type Resultado = { ok: true; aviso?: string } | { ok: false; error: string };

const CLAVE_MINIMA = 8;

const esquemaEmail = z.string().trim().toLowerCase().email();

/** Traduce el error de Supabase a algo que una persona entienda. */
function traducir(e: AuthError | null): string {
  if (!e) return errores.generico;
  const codigo = (e as AuthError & { code?: string }).code ?? "";
  const texto = e.message.toLowerCase();

  if (codigo === "invalid_credentials" || texto.includes("invalid login credentials"))
    return errores.credenciales;
  if (codigo === "user_already_exists" || texto.includes("already registered"))
    return errores.yaRegistrado;
  if (codigo === "email_not_confirmed" || texto.includes("email not confirmed"))
    return errores.mailSinConfirmar;
  if (codigo === "weak_password" || texto.includes("password should be at least"))
    return errores.claveCorta;
  if (codigo === "over_request_rate_limit" || e.status === 429 || texto.includes("rate limit"))
    return errores.demasiadosIntentos;
  if (codigo === "validation_failed" || texto.includes("unable to validate email"))
    return errores.mailInvalido;
  return errores.generico;
}

/** La URL pública del sitio, para armar los enlaces que vuelven del correo. */
async function urlDelSitio(): Promise<string> {
  const declarada = process.env.NEXT_PUBLIC_SITIO_URL;
  if (declarada) return declarada.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  return `${protocolo}://${host}`;
}

function validarEmail(email: string): string | null {
  if (!email.trim()) return errores.mailFalta;
  return esquemaEmail.safeParse(email).success ? null : errores.mailInvalido;
}

function validarClave(clave: string): string | null {
  if (!clave) return errores.claveFalta;
  if (clave.length < CLAVE_MINIMA) return errores.claveCorta;
  return null;
}

export async function ingresar(entrada: { email: string; clave: string }): Promise<Resultado> {
  const malMail = validarEmail(entrada.email);
  if (malMail) return { ok: false, error: malMail };
  if (!entrada.clave) return { ok: false, error: errores.claveFalta };

  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: errores.sinConfigurar };

  const { error } = await sb.auth.signInWithPassword({
    email: entrada.email.trim().toLowerCase(),
    password: entrada.clave,
  });
  if (error) return { ok: false, error: traducir(error) };
  return { ok: true };
}

export async function registrar(entrada: {
  email: string;
  clave: string;
  claveRepetir: string;
}): Promise<Resultado> {
  const malMail = validarEmail(entrada.email);
  if (malMail) return { ok: false, error: malMail };
  const malClave = validarClave(entrada.clave);
  if (malClave) return { ok: false, error: malClave };
  if (entrada.clave !== entrada.claveRepetir)
    return { ok: false, error: errores.clavesNoCoinciden };

  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: errores.sinConfigurar };

  const { data, error } = await sb.auth.signUp({
    email: entrada.email.trim().toLowerCase(),
    password: entrada.clave,
    options: { emailRedirectTo: `${await urlDelSitio()}/auth/callback` },
  });
  if (error) return { ok: false, error: traducir(error) };

  // Con "Confirm email" prendido, Supabase devuelve un usuario sin sesión y
  // sin identidades cuando el correo ya existía. No decimos cuál de las dos
  // cosas pasó: sería contar si ese mail tiene cuenta.
  if (data.user && data.user.identities?.length === 0)
    return { ok: false, error: errores.yaRegistrado };

  if (!data.session) return { ok: true, aviso: "confirmar" };
  return { ok: true };
}

export async function pedirRecuperacion(email: string): Promise<Resultado> {
  const malMail = validarEmail(email);
  if (malMail) return { ok: false, error: malMail };

  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: errores.sinConfigurar };

  const { error } = await sb.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${await urlDelSitio()}/auth/callback?destino=/ingresar/nueva-clave`,
  });
  // Un error acá no se muestra: la pantalla dice siempre lo mismo, así nadie
  // puede averiguar qué correos tienen cuenta probando de a uno.
  if (error && error.status === 429) return { ok: false, error: errores.demasiadosIntentos };
  return { ok: true };
}

export async function cambiarClave(entrada: {
  clave: string;
  claveRepetir: string;
}): Promise<Resultado> {
  const malClave = validarClave(entrada.clave);
  if (malClave) return { ok: false, error: malClave };
  if (entrada.clave !== entrada.claveRepetir)
    return { ok: false, error: errores.clavesNoCoinciden };

  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: errores.sinConfigurar };

  const { data: sesion } = await sb.auth.getUser();
  if (!sesion.user) return { ok: false, error: errores.generico };

  const { error } = await sb.auth.updateUser({ password: entrada.clave });
  if (error) return { ok: false, error: traducir(error) };
  return { ok: true };
}

export async function ingresarConGoogle(volverA?: string): Promise<Resultado> {
  const sb = await crearClienteServidor();
  if (!sb) return { ok: false, error: errores.sinConfigurar };

  const destino = volverA ? `?destino=${encodeURIComponent(volverA)}` : "";
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${await urlDelSitio()}/auth/callback${destino}`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error || !data.url) return { ok: false, error: errores.google };
  redirect(data.url);
}
