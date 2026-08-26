import type { Metadata } from "next";
import { PantallaAuth } from "@/components/auth/PantallaAuth";
import { FormularioRecuperar } from "@/components/auth/FormularioRecuperar";

export const metadata: Metadata = { title: "Recuperar contraseña — Nexo Derecho × Nueva Abogacía" };

export default function Recuperar() {
  return (
    <PantallaAuth>
      <FormularioRecuperar />
    </PantallaAuth>
  );
}
