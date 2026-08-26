import type { Metadata } from "next";
import { Suspense } from "react";
import { PantallaAuth } from "@/components/auth/PantallaAuth";
import { FormularioIngreso } from "@/components/auth/FormularioIngreso";
import { errores } from "@/content/auth";

export const metadata: Metadata = { title: "Ingresar — Nexo Derecho × Nueva Abogacía" };

const MENSAJES: Record<string, string> = {
  google: errores.google,
  enlace: errores.generico,
};

export default async function Ingresar({
  searchParams,
}: {
  searchParams: Promise<{ volver?: string; error?: string }>;
}) {
  const { volver, error } = await searchParams;
  const volverA = volver?.startsWith("/") && !volver.startsWith("//") ? volver : undefined;

  return (
    <PantallaAuth>
      <Suspense>
        <FormularioIngreso volverA={volverA} errorInicial={error ? MENSAJES[error] : undefined} />
      </Suspense>
    </PantallaAuth>
  );
}
