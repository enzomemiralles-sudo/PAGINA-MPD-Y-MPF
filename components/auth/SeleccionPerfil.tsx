"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { elegirPerfil } from "@/lib/acciones/perfil";
import { seleccion as t } from "@/content/perfil";
import { MARCAS_CONFIG, MARCA_DE_PERFIL, type TipoPerfil } from "@/lib/marca/marcas";

export function SeleccionPerfil() {
  const router = useRouter();
  const [eligiendo, setEligiendo] = useState<TipoPerfil | null>(null);
  const [error, setError] = useState("");

  async function elegir(tipo: TipoPerfil) {
    setError("");
    setEligiendo(tipo);

    const r = await elegirPerfil(tipo);
    if (!r.ok) {
      setError(r.error);
      setEligiendo(null);
      return;
    }

    // La piel cambia acá mismo: el paso a la app no es un salto seco.
    document.documentElement.setAttribute("data-marca", r.marca);
    setTimeout(() => {
      router.refresh();
      router.push("/app");
    }, 420);
  }

  return (
    <>
      <h1>{t.titulo}</h1>
      <div className="perfil-lista">
        {t.opciones.map((o) => {
          const cfg = MARCAS_CONFIG[MARCA_DE_PERFIL[o.id]];
          return (
            <button
              key={o.id}
              type="button"
              className="perfil-op"
              onClick={() => elegir(o.id)}
              disabled={eligiendo !== null}
            >
              <span className="etiqueta">{o.etiqueta}</span>
              <span className="quien">{o.quien}</span>
              <span className="perfil-muestra" aria-hidden="true">
                <i style={{ background: cfg.muestra.primario }} />
                <i style={{ background: cfg.muestra.acento }} />
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      {eligiendo ? (
        <p className="auth-bajada" role="status" style={{ textAlign: "center" }}>
          {t.guardando}
        </p>
      ) : null}
    </>
  );
}
