import type { Metadata } from "next";
import { Suspense } from "react";
import { PantallaAuth } from "@/components/auth/PantallaAuth";
import { FormularioIngreso } from "@/components/auth/FormularioIngreso";
import { errores } from "@/content/auth";

export const metadata: Metadata = { title: "Creá tu perfil — Nexo Derecho × Nueva Abogacía" };

const MENSAJES: Record<string, string> = {
  google: errores.google,
  enlace: errores.generico,
};

/**
 * Donde empieza el recorrido: «Empezar gratis» trae acá.
 *
 * Es la misma pantalla que /ingresar, abierta en alta en vez de en ingreso.
 * Son dos puertas al mismo lugar porque son dos intenciones distintas —crear
 * una cuenta o volver a la tuya— y el botón de la portada dice «Empezar
 * gratis», no «Ingresar». Quien ya tiene cuenta alterna con un clic.
 */
export default async function CrearPerfil({
  searchParams,
}: {
  searchParams: Promise<{ volver?: string; error?: string }>;
}) {
  const { volver, error } = await searchParams;
  const volverA = volver?.startsWith("/") && !volver.startsWith("//") ? volver : undefined;

  return (
    <PantallaAuth>
      <Suspense>
        <FormularioIngreso
          modoInicial="registro"
          volverA={volverA}
          errorInicial={error ? MENSAJES[error] : undefined}
        />
      </Suspense>
    </PantallaAuth>
  );
}
