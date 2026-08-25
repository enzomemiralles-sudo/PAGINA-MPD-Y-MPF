"use client";

import { useId, useState } from "react";
import { captura as t } from "@/content/landing";
import { suscribirAlerta } from "@/app/acciones";
import type { Organismo } from "@/lib/tipos";

/**
 * Consentimientos separados y sin tildar por defecto: los datos por un lado,
 * WhatsApp por otro. No se pide DNI, CUIL, domicilio ni nada sensible.
 */
export function CapturaEmail({ organismo = "mpd" }: { organismo?: Organismo }) {
  const idMail = useId();
  const idDatos = useId();
  const idWsp = useId();

  const [email, setEmail] = useState("");
  const [consentDatos, setConsentDatos] = useState(false);
  const [consentWsp, setConsentWsp] = useState(false);
  const [estado, setEstado] = useState<"quieto" | "enviando" | "ok" | "error">("quieto");
  const [mensaje, setMensaje] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const r = await suscribirAlerta({ email, organismo, consentDatos, consentWsp });

    if (r.ok) {
      setEstado("ok");
      setMensaje(t.exito);
      return;
    }
    setEstado("error");
    setMensaje(
      r.motivo === "mail" ? t.errorMail : r.motivo === "consentimiento" ? t.faltaConsentimiento : t.errorGenerico,
    );
  }

  if (estado === "ok") {
    return (
      <p className="captura-msg ok" role="status" style={{ marginTop: "2rem" }}>
        {mensaje}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} id="avisame" noValidate>
      <div className="captura">
        <label className="sr-only" htmlFor={idMail}>
          Tu correo electrónico
        </label>
        <input
          id={idMail}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-p" type="submit" disabled={estado === "enviando"}>
          {estado === "enviando" ? t.enviando : t.boton}
        </button>
      </div>

      <div style={{ maxWidth: "34rem", margin: "0 auto" }}>
        <label className="consentimiento" htmlFor={idDatos}>
          <input
            id={idDatos}
            type="checkbox"
            checked={consentDatos}
            onChange={(e) => setConsentDatos(e.target.checked)}
          />
          <span>{t.consentimientoDatos}</span>
        </label>
        <label className="consentimiento" htmlFor={idWsp}>
          <input
            id={idWsp}
            type="checkbox"
            checked={consentWsp}
            onChange={(e) => setConsentWsp(e.target.checked)}
          />
          <span>{t.consentimientoWsp}</span>
        </label>
      </div>

      {estado === "error" ? (
        <p className="captura-msg error" role="alert">
          {mensaje}
        </p>
      ) : null}
    </form>
  );
}
