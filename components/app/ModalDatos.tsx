"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { guardarDatos } from "@/lib/acciones/onboarding";
import { modal as t, camposDe } from "@/content/onboarding";
import { CamposPerfil } from "./CamposPerfil";
import { TextoLegal } from "./TextoLegal";
import type { TipoPerfil } from "@/lib/marca/marcas";

/**
 * «Contanos un poco más». Se abre sobre la pantalla principal la primera vez.
 * Se puede cerrar: quien lo cierre lo completa después desde «Mi perfil».
 *
 * Todos los campos son opcionales. Lo único obligatorio es el checkbox:
 * mientras no esté tildado, el botón queda deshabilitado.
 */
export function ModalDatos({
  tipo,
  org,
  legal,
  bajada,
}: {
  tipo: TipoPerfil;
  org: string;
  legal: string;
  bajada: string;
}) {
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const idAcepta = useId();
  const idTitulo = useId();

  const [valores, setValores] = useState<Record<string, string>>({});
  const [acepta, setAcepta] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
  }, []);

  function cerrar() {
    dialogo.current?.close();
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    const r = await guardarDatos(valores, acepta);
    setGuardando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    cerrar();
    router.refresh();
  }

  return (
    <dialog ref={dialogo} className="modal" aria-labelledby={idTitulo}>
      <form className="modal-caja" onSubmit={enviar}>
        <div className="modal-encabezado">
          <h2 id={idTitulo}>{t.titulo}</h2>
          <button type="button" className="modal-cerrar" onClick={cerrar} aria-label={t.cerrar}>
            ✕
          </button>
        </div>
        <p className="modal-bajada">{bajada}</p>

        <CamposPerfil
          campos={camposDe(tipo)}
          valores={valores}
          onCambio={(n, v) => setValores((p) => ({ ...p, [n]: v }))}
          org={org}
          deshabilitado={guardando}
        />

        <TextoLegal texto={legal} />

        <label className="consentimiento" htmlFor={idAcepta}>
          <input
            id={idAcepta}
            type="checkbox"
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
          />
          <span>{t.aceptar}</span>
        </label>

        <p className="modal-aclaracion">{t.aclaracion}</p>

        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="btn btn-acento modal-guardar"
          type="submit"
          disabled={!acepta || guardando}
        >
          {guardando ? t.guardando : t.guardar}
        </button>
      </form>
    </dialog>
  );
}
