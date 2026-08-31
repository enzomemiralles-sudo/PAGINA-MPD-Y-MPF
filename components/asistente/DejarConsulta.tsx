"use client";

import { useId, useState } from "react";
import { sinRespuesta as t } from "@/content/asistente";
import { dejarConsulta } from "@/lib/acciones/asistente";
import { useAsistente } from "@/components/asistente/estado";

/**
 * A-12. El formulario de «no encontramos la respuesta».
 *
 * Aparece en dos lugares, y no es lo mismo: pegado a una respuesta roja, con
 * la consulta ya escrita, para no obligar a repetirla; y suelto abajo de todo,
 * siempre disponible, porque quien tiene una duda que no encaja en nada no
 * debería tener que provocar un error para poder dejarla.
 *
 * El correo es opcional de verdad. Pedirlo obligatorio filtraría justo a quien
 * tiene la duda y no quiere dejar datos.
 */
export function DejarConsulta({
  consultaInicial = "",
  origen,
  compacto = false,
}: {
  consultaInicial?: string;
  origen: "asistente" | "formulario";
  compacto?: boolean;
}) {
  const { ambito } = useAsistente();
  const id = useId();
  const [consulta, setConsulta] = useState(consultaInicial);
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState<"consulta" | "email" | "guardar" | null>(null);

  if (listo) {
    return (
      <div className="asis-dejar-gracias" role="status">
        <p className="asis-dejar-ok">{t.gracias}</p>
        <p className="asis-dejar-cierre">{t.cierre}</p>
      </div>
    );
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setError(null);

    const r = await dejarConsulta({ consulta, organismo: ambito, email, origen });
    setEnviando(false);

    if (r.ok) {
      setListo(true);
      return;
    }
    setError(r.campo === "email" ? "email" : r.campo === "consulta" ? "consulta" : "guardar");
  }

  return (
    <form className="asis-dejar" data-compacto={compacto} onSubmit={enviar} noValidate>
      {compacto ? null : (
        <>
          <h2 className="asis-titulo">{t.titulo}</h2>
          <p className="asis-bajada">{t.bajada}</p>
        </>
      )}

      <div className="campo">
        <label htmlFor={`${id}-c`}>{t.campos.consulta.rotulo}</label>
        <textarea
          id={`${id}-c`}
          rows={compacto ? 2 : 3}
          value={consulta}
          placeholder={t.campos.consulta.marcador}
          aria-invalid={error === "consulta"}
          onChange={(e) => setConsulta(e.target.value)}
        />
        {error === "consulta" ? <p className="campo-error">{t.errores.consulta}</p> : null}
      </div>

      <div className="campo">
        <label htmlFor={`${id}-e`}>{t.campos.email.rotulo}</label>
        <input
          id={`${id}-e`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          placeholder={t.campos.email.marcador}
          aria-invalid={error === "email"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="campo-ayuda">{t.campos.email.ayuda}</p>
        {error === "email" ? <p className="campo-error">{t.errores.email}</p> : null}
      </div>

      {error === "guardar" ? (
        <p className="campo-error" role="alert">
          {t.errores.guardar}
        </p>
      ) : null}

      <button className="btn btn-p" type="submit" disabled={enviando}>
        {enviando ? t.enviando : t.enviar}
      </button>

      {compacto ? null : <p className="asis-dejar-cierre">{t.cierre}</p>}
    </form>
  );
}
