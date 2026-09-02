import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { esRevisor, traerCola } from "@/lib/revision/datos";
import { Revisor } from "@/components/revision/Revisor";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";

export const metadata: Metadata = { title: "Revisión de preguntas" };
export const dynamic = "force-dynamic";

/**
 * La pantalla de revisión.
 *
 * Existe por una regla: ninguna pregunta se publica sin que alguien la haya
 * mirado. Con 259 esperando, esa regla necesitaba una herramienta o iba a
 * quedar en buena intención.
 *
 * Devuelve 404 y no un «no tenés permiso» a quien no es revisor: para el
 * resto del mundo esta ruta no existe, y decir «existe pero no podés» es
 * contar de más.
 *
 * El contenedor se llama `revision` y no `rev`: `.rev` es la clase del sistema
 * de movimiento de la portada, que arranca en `opacity: 0` y sólo se ve cuando
 * el observador de scroll le agrega `.on`. Reusarla dejaba esta página
 * renderizada entera, devolviendo 200, y completamente invisible.
 */
export default async function Revisar() {
  if (!(await esRevisor())) notFound();

  return (
    <main className="env app-cuerpo revision">
      <VolverAlPerfil />
      <Revisor inicial={await traerCola()} />
    </main>
  );
}
