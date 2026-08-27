import type { Metadata } from "next";
import { PantallaAuth } from "@/components/auth/PantallaAuth";
import { SeleccionPerfil } from "@/components/auth/SeleccionPerfil";

export const metadata: Metadata = { title: "Elegí tu perfil — Nexo Derecho × Nueva Abogacía" };
export const dynamic = "force-dynamic";

/** Sigue siendo neutra: es el momento en que la persona define qué interfaz usa. */
export default function ElegirPerfil() {
  return (
    <>
      <PantallaAuth ancha>
        <SeleccionPerfil />
      </PantallaAuth>
    </>
  );
}
