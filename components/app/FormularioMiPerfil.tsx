"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { guardarDatos } from "@/lib/acciones/onboarding";
import { camposDe, miPerfil as t, modal as tm } from "@/content/onboarding";
import { CamposPerfil } from "./CamposPerfil";
import { TextoLegal } from "./TextoLegal";
import type { TipoPerfil } from "@/lib/marca/marcas";

export function FormularioMiPerfil({
  tipo,
  org,
  legal,
  iniciales,
  yaAcepto,
}: {
  tipo: TipoPerfil;
  org: string;
  legal: string;
  iniciales: Record<string, string>;
  yaAcepto: boolean;
}) {
  const router = useRouter();
  const idAcepta = useId();
  const [valores, setValores] = useState(iniciales);
  const [acepta, setAcepta] = useState(yaAcepto);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setListo(false);
    setGuardando(true);
    const r = await guardarDatos(valores, acepta);
    setGuardando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setListo(true);
    router.refresh();
  }

  return (
    <form onSubmit={enviar}>
      <CamposPerfil
        campos={camposDe(tipo)}
        valores={valores}
        onCambio={(n, v) => {
          setValores((p) => ({ ...p, [n]: v }));
          setListo(false);
        }}
        org={org}
        deshabilitado={guardando}
      />

      {/* Si nunca aceptó, la aceptación sigue siendo obligatoria acá también. */}
      {yaAcepto ? null : (
        <>
          <TextoLegal texto={legal} />
          <label className="consentimiento" htmlFor={idAcepta}>
            <input
              id={idAcepta}
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
            />
            <span>{tm.aceptar}</span>
          </label>
          <p className="modal-aclaracion">{tm.aclaracion}</p>
        </>
      )}

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      {listo ? (
        <p className="auth-aviso" role="status">
          {t.guardado}
        </p>
      ) : null}

      <button className="btn btn-acento" type="submit" disabled={!acepta || guardando} style={{ marginTop: "1.4rem" }}>
        {guardando ? t.guardando : t.guardar}
      </button>
    </form>
  );
}
