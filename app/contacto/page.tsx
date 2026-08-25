import type { Metadata } from "next";
import { contacto as t } from "@/content/paginas";
import { PaginaTexto } from "@/components/landing/PaginaTexto";
import { Vidrio } from "@/components/marca/Vidrio";

export const metadata: Metadata = { title: `${t.titulo} — Nexo Derecho × Nueva Abogacía` };

export default function Contacto() {
  return (
    <PaginaTexto titulo={t.titulo} bajada={t.bajada}>
      <ul className="lista" style={{ marginTop: "2rem" }}>
        {t.vias.map((v) => (
          <li key={v.que}>
            <span className="n">·</span>
            <span>
              <b>{v.que}</b> {v.como} —{" "}
              <a href={v.href} target="_blank" rel="noopener noreferrer">
                {v.texto}
              </a>
            </span>
          </li>
        ))}
      </ul>
      <Vidrio className="tarjeta" as="aside">
        <p style={{ fontSize: ".9rem", lineHeight: 1.6 }}>{t.errata}</p>
      </Vidrio>
    </PaginaTexto>
  );
}
