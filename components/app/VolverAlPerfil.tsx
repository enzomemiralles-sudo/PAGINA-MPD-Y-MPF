"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { volver as t } from "@/content/app";

/**
 * La vuelta al menú del perfil, desde cualquier herramienta.
 *
 * Va dentro del flujo y arriba a la izquierda del contenido, no flotando: una
 * pastilla flotante tapa contenido en el teléfono y se pierde al scrollear,
 * que es justo cuando alguien la busca.
 *
 * Lleva a /app, la home de la puerta, y no a la portada: la piel activa se
 * conserva porque se conserva la sesión.
 *
 * `confirmar` es para el simulacro en curso. Salir de ahí abandona el intento,
 * así que ese es el único caso donde el botón pregunta antes; en todos los
 * demás irse no cuesta nada y preguntar sería ruido.
 */
export function VolverAlPerfil({ confirmar = false }: { confirmar?: boolean }) {
  const router = useRouter();
  const [preguntando, setPreguntando] = useState(false);

  if (!confirmar) {
    return (
      <Link className="volver" href="/app" aria-label={t.ayuda}>
        <span aria-hidden="true">←</span> {t.texto}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="volver"
        onClick={() => setPreguntando(true)}
        aria-label={t.ayuda}
      >
        <span aria-hidden="true">←</span> {t.texto}
      </button>

      {preguntando ? (
        <div className="volver-velo" role="dialog" aria-modal="true" aria-labelledby="volver-que">
          <div className="volver-caja">
            <p id="volver-que">{t.aviso}</p>
            <div className="volver-botones">
              <button type="button" className="btn btn-s" onClick={() => setPreguntando(false)}>
                {t.seguir}
              </button>
              <button type="button" className="btn btn-a" onClick={() => router.push("/app")}>
                {t.salir}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
