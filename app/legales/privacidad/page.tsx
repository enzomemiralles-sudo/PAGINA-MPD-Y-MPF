import type { Metadata } from "next";
import { privacidad as t } from "@/content/paginas";
import { PaginaTexto, BloquesTexto } from "@/components/landing/PaginaTexto";

export const metadata: Metadata = { title: `${t.titulo} — Nexo Derecho × Nueva Abogacía` };

export default function Privacidad() {
  return (
    <PaginaTexto titulo={t.titulo} bajada={t.actualizado}>
      <BloquesTexto bloques={t.bloques} />
    </PaginaTexto>
  );
}
