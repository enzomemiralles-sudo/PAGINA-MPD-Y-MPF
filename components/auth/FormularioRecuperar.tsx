"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { pedirRecuperacion } from "@/lib/acciones/auth";
import { recuperar as t } from "@/content/auth";

export function FormularioRecuperar() {
  const idMail = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    const r = await pedirRecuperacion(email);
    setEnviando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setListo(true);
  }

  if (listo) {
    return (
      <>
        <h1>{t.listoTitulo}</h1>
        <p className="auth-bajada">{t.listoTexto}</p>
        <p className="auth-pie-caja">
          <Link href="/ingresar">{t.volver}</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>{t.titulo}</h1>
      <p className="auth-bajada">{t.bajada}</p>

      <form className="auth-form" onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor={idMail}>{t.email}</label>
          <input
            id={idMail}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            required
          />
        </div>
        <button className="btn btn-p" type="submit" disabled={enviando} style={{ width: "100%" }}>
          {enviando ? t.enviando : t.enviar}
        </button>
      </form>

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="auth-pie-caja">
        <Link href="/ingresar">{t.volver}</Link>
      </p>
    </>
  );
}
