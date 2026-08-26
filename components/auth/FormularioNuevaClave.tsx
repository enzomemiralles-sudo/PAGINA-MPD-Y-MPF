"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cambiarClave } from "@/lib/acciones/auth";
import { nuevaClave as t } from "@/content/auth";
import { errores } from "@/content/auth";

export function FormularioNuevaClave({ haySesion }: { haySesion: boolean }) {
  const router = useRouter();
  const idClave = useId();
  const idClave2 = useId();
  const [clave, setClave] = useState("");
  const [claveRepetir, setClaveRepetir] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  if (!haySesion) {
    return (
      <>
        <h1>{t.titulo}</h1>
        <p className="auth-error" role="alert" style={{ marginTop: "1.2rem" }}>
          {t.enlaceVencido}
        </p>
        <p className="auth-pie-caja">
          <Link href="/ingresar/recuperar">{t.pedirOtro}</Link>
        </p>
      </>
    );
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    const r = await cambiarClave({ clave, claveRepetir });
    setGuardando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setListo(true);
    router.refresh();
    setTimeout(() => router.push("/app"), 1200);
  }

  return (
    <>
      <h1>{t.titulo}</h1>
      <p className="auth-bajada">{t.bajada}</p>

      <form className="auth-form" onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor={idClave}>{t.clave}</label>
          <input
            id={idClave}
            type="password"
            autoComplete="new-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            aria-invalid={error === errores.claveCorta}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor={idClave2}>{t.claveRepetir}</label>
          <input
            id={idClave2}
            type="password"
            autoComplete="new-password"
            value={claveRepetir}
            onChange={(e) => setClaveRepetir(e.target.value)}
            aria-invalid={error === errores.clavesNoCoinciden}
            required
          />
        </div>
        <button className="btn btn-p" type="submit" disabled={guardando || listo} style={{ width: "100%" }}>
          {guardando ? t.guardando : t.guardar}
        </button>
      </form>

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      {listo ? (
        <p className="auth-aviso" role="status">
          {t.listo}
        </p>
      ) : null}
    </>
  );
}
