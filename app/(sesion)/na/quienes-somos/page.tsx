import type { Metadata } from "next";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";
import { quienesSomos as t } from "@/content/organizaciones";

export const metadata: Metadata = { title: "¿Quiénes somos? — Nueva Abogacía" };

/**
 * Quiénes son.
 *
 * Página de lectura y nada más: medida de línea corta, jerarquía tipográfica y
 * aire. El texto es de Nueva Abogacía y va tal cual, sin resumir.
 *
 * Sin gradiente detrás del párrafo. El degradé de la marca es acento o filete
 * —acá, la línea que abre el cierre— y nunca fondo de texto: sobre él la letra
 * pierde el contraste que sí tiene sobre el fondo de la piel.
 */
export default function QuienesSomos() {
  return (
    <main className="env app-cuerpo lectura">
      <VolverAlPerfil />
      <h1>{t.titulo}</h1>

      <div className="lectura-cuerpo">
        {t.parrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <p className="lectura-cierre">{t.cierre}</p>
    </main>
  );
}
