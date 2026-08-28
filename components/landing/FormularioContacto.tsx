"use client";

import { useId, useState } from "react";
import { contacto as t } from "@/content/contacto";
import { enviarConsulta, type CampoConsulta } from "@/lib/acciones/consultas";

type Estado = "quieto" | "enviando" | "ok" | "error";

export function FormularioContacto() {
  const idNombre = useId();
  const idEmail = useId();
  const idMotivo = useId();
  const idMensaje = useId();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<Estado>("quieto");
  const [campoMalo, setCampoMalo] = useState<CampoConsulta | null>(null);
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setError("");
    setCampoMalo(null);

    const r = await enviarConsulta({ nombre, email, motivo, mensaje });

    if (r.ok) {
      setEstado("ok");
      return;
    }
    setEstado("error");
    setCampoMalo(r.campo);
    setError(r.campo ? t.errores[r.campo] : t.errores.generico);
  }

  function deNuevo() {
    setNombre("");
    setEmail("");
    setMotivo("");
    setMensaje("");
    setEstado("quieto");
    setError("");
    setCampoMalo(null);
  }

  if (estado === "ok") {
    return (
      <div className="contacto-listo" role="status">
        <p className="contacto-listo-titulo">{t.formulario.exitoTitulo}</p>
        <p>{t.formulario.exitoTexto}</p>
        <button type="button" className="btn btn-s" onClick={deNuevo}>
          {t.formulario.otra}
        </button>
      </div>
    );
  }

  const enviando = estado === "enviando";

  return (
    <form className="contacto-form" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor={idNombre}>{t.formulario.nombre}</label>
        <input
          id={idNombre}
          type="text"
          autoComplete="name"
          placeholder={t.formulario.nombrePlaceholder}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-invalid={campoMalo === "nombre"}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor={idEmail}>{t.formulario.email}</label>
        <input
          id={idEmail}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t.formulario.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={campoMalo === "email"}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor={idMotivo}>{t.formulario.motivo}</label>
        <select
          id={idMotivo}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          aria-invalid={campoMalo === "motivo"}
          required
        >
          <option value="" disabled>
            {t.formulario.motivoPlaceholder}
          </option>
          {t.motivos.map((m) => (
            <option key={m.valor} value={m.valor}>
              {m.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor={idMensaje}>{t.formulario.mensaje}</label>
        <textarea
          id={idMensaje}
          rows={6}
          placeholder={t.formulario.mensajePlaceholder}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          aria-invalid={campoMalo === "mensaje"}
          required
        />
      </div>

      <button className="btn btn-p" type="submit" disabled={enviando}>
        {enviando ? t.formulario.enviando : t.formulario.enviar}
      </button>

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="contacto-form-pie">{t.formulario.pie}</p>
    </form>
  );
}
