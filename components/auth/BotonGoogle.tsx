"use client";

import { useState } from "react";
import { ingresarConGoogle } from "@/lib/acciones/auth";
import { ingreso } from "@/content/auth";

export function BotonGoogle({ volverA, onError }: { volverA?: string; onError: (e: string) => void }) {
  const [yendo, setYendo] = useState(false);

  async function entrar() {
    setYendo(true);
    const r = await ingresarConGoogle(volverA);
    // Si sale bien, la acción redirige y no volvemos acá.
    if (r && !r.ok) {
      onError(r.error);
      setYendo(false);
    }
  }

  return (
    <button type="button" className="btn btn-google" onClick={entrar} disabled={yendo}>
      <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.3z"/>
        <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.2l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.6 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.3A22 22 0 0 0 2 24c0 3.5.8 6.9 2.3 9.9l7.3-5.6z"/>
        <path fill="#EA4335" d="M24 10.6c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4 30 2 24 2 15.4 2 7.9 6.9 4.3 14.1l7.3 5.7c1.7-5.2 6.6-9.2 12.4-9.2z"/>
      </svg>
      {ingreso.google}
    </button>
  );
}
