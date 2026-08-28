import type { Metadata } from "next";
import { terminos as t } from "@/content/legales.generado";
import { PaginaTexto, DocumentoLegal } from "@/components/landing/PaginaTexto";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Nexo Derecho × Nueva Abogacía",
};

export default function TerminosYCondiciones() {
  return (
    <PaginaTexto titulo={t.titulo} bajada={t.actualizado}>
      <DocumentoLegal entradilla={t.entradilla} bloques={t.bloques} firma={t.firma} />
    </PaginaTexto>
  );
}
