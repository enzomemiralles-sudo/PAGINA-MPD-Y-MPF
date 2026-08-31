"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { comenzar } from "@/lib/acciones/simulador";
import { reglas as t, vacio } from "@/content/simulador";

/**
 * Crea el intento y lleva a rendirlo.
 *
 * Es cliente porque necesita mostrar que está trabajando: sortear las
 * preguntas y escribir las filas del intento tarda lo suficiente como para
 * que, sin aviso, alguien apriete dos veces y arranque dos exámenes.
 */
export function BotonComenzar({ examenId }: { examenId: string }) {
  const router = useRouter();
  const [yendo, setYendo] = useState(false);
  const [error, setError] = useState("");

  async function arrancar() {
    setYendo(true);
    setError("");
    const r = await comenzar(examenId);
    if (r.ok) {
      router.push(`/simulador/rendir/${r.intento}`);
      return;
    }
    setYendo(false);
    setError(r.motivo === "sin_preguntas" ? vacio.titulo : t.error);
  }

  return (
    <>
      <button className="btn btn-p" type="button" onClick={arrancar} disabled={yendo}>
        {yendo ? t.comenzando : t.comenzar}
      </button>
      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
