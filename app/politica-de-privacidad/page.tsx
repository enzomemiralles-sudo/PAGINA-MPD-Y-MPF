import type { Metadata } from "next";
import { privacidad as t } from "@/content/legales.generado";
import { PaginaTexto, DocumentoLegal } from "@/components/landing/PaginaTexto";

export const metadata: Metadata = {
  title: "Política de Privacidad — Nexo Derecho × Nueva Abogacía",
};

export default function PoliticaDePrivacidad() {
  return (
    <PaginaTexto titulo={t.titulo} bajada={t.actualizado}>
      <DocumentoLegal entradilla={t.entradilla} bloques={t.bloques} firma={t.firma} />
    </PaginaTexto>
  );
}
