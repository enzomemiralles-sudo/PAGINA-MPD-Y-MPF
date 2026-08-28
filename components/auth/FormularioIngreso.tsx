"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ingresar, registrar } from "@/lib/acciones/auth";
import { ingreso as t, errores } from "@/content/auth";

type Modo = "ingresar" | "registro";

export function FormularioIngreso({
  volverA,
  errorInicial,
  modoInicial = "ingresar",
}: {
  volverA?: string;
  errorInicial?: string;
  /** /crear-perfil abre en alta; /ingresar, en ingreso. Se alterna igual. */
  modoInicial?: Modo;
}) {
  const router = useRouter();
  const idMail = useId();
  const idClave = useId();
  const idClave2 = useId();

  const [modo, setModo] = useState<Modo>(modoInicial);
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [claveRepetir, setClaveRepetir] = useState("");
  const [error, setError] = useState(errorInicial ?? "");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modo === "registro";

  function alternar() {
    setModo(esRegistro ? "ingresar" : "registro");
    setError("");
    setAviso("");
    setClave("");
    setClaveRepetir("");
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    setEnviando(true);

    const r = esRegistro
      ? await registrar({ email, clave, claveRepetir })
      : await ingresar({ email, clave });

    if (!r.ok) {
      setError(r.error);
      setEnviando(false);
      return;
    }

    if (r.aviso === "confirmar") {
      setAviso(t.revisaMail);
      setEnviando(false);
      return;
    }

    // La sesión vive en cookies: hay que refrescar para que el servidor la vea.
    router.refresh();
    router.push(volverA ?? "/app");
  }

  return (
    <>
      <h1>{esRegistro ? t.tituloRegistro : t.titulo}</h1>
      <p className="auth-bajada">{t.bajada}</p>

      {/* «Continuar con Google» está apagado a propósito. Andar requiere dar de
          alta credenciales en Google Cloud Console y configurar el proveedor en
          Supabase Auth, y no queremos esa dependencia externa para lanzar: con
          correo y contraseña alcanza.

          Para volver a prenderlo, tres cosas:
            1. configurar el proveedor Google en Supabase → Authentication →
               Sign In / Providers, con las credenciales de Google Cloud;
            2. `import { BotonGoogle } from "./BotonGoogle";` acá arriba;
            3. descomentar el bloque de abajo.
          El componente, la acción `ingresarConGoogle` y los textos siguen en el
          repo sin tocar, así que no hay nada más que escribir.

      <div style={{ marginTop: "1.6rem" }}>
        <BotonGoogle volverA={volverA} onError={setError} />
      </div>

      <div className="auth-divisor">{t.divisor}</div>
      */}

      <form className="auth-form" onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor={idMail}>{t.email}</label>
          <input
            id={idMail}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error === errores.mailInvalido || error === errores.mailFalta}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor={idClave}>{t.clave}</label>
          <input
            id={idClave}
            type="password"
            autoComplete={esRegistro ? "new-password" : "current-password"}
            placeholder={t.clavePlaceholder}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            aria-invalid={error === errores.claveCorta || error === errores.claveFalta}
            required
          />
        </div>

        {esRegistro ? (
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
        ) : (
          <p className="auth-olvide">
            {t.olvide} <Link href="/ingresar/recuperar">{t.olvideLink}</Link>
          </p>
        )}

        <button className="btn btn-p" type="submit" disabled={enviando} style={{ width: "100%" }}>
          {enviando ? (esRegistro ? t.creando : t.entrando) : esRegistro ? t.crear : t.entrar}
        </button>
      </form>

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      {aviso ? (
        <p className="auth-aviso" role="status">
          {aviso}
        </p>
      ) : null}

      <p className="auth-pie-caja">
        {esRegistro ? t.conCuenta : t.sinCuenta}{" "}
        <button type="button" className="auth-alternar" onClick={alternar}>
          {esRegistro ? t.conCuentaLink : t.sinCuentaLink}
        </button>
      </p>
    </>
  );
}
