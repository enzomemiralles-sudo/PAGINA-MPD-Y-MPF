"use client";

import { useEffect, useRef, useState } from "react";
import { rendir as t } from "@/content/simulador";

/**
 * La cuenta regresiva.
 *
 * Los segundos iniciales los calcula el servidor a partir de `iniciado_en` y
 * la duración del examen, así que recargar la página no regala tiempo: el
 * reloj sigue donde iba. Acá sólo se descuenta.
 *
 * `onFin` se llama una sola vez. Sin el ref, un re-render mientras se está
 * entregando dispararía la entrega de nuevo.
 */
export function Cronometro({ segundos, onFin }: { segundos: number; onFin: () => void }) {
  const [quedan, setQuedan] = useState(segundos);
  const yaAviso = useRef(false);

  useEffect(() => {
    if (quedan <= 0) {
      if (!yaAviso.current) {
        yaAviso.current = true;
        onFin();
      }
      return;
    }
    const t = setTimeout(() => setQuedan((q) => q - 1), 1000);
    return () => clearTimeout(t);
  }, [quedan, onFin]);

  const minutos = Math.floor(quedan / 60);
  const resto = quedan % 60;
  // Los últimos cinco minutos se marcan: es cuando la información sirve.
  const apurando = quedan <= 300;

  return (
    <div className={`rend-cron${apurando ? " apurando" : ""}`} role="timer" aria-live="off">
      <span className="rend-cron-rotulo mono">{t.tiempoRotulo}</span>
      <span className="rend-cron-numero">
        {String(minutos).padStart(2, "0")}:{String(resto).padStart(2, "0")}
      </span>
    </div>
  );
}
