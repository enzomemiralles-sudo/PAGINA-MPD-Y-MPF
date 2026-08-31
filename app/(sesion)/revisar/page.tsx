import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { esRevisor, traerCola } from "@/lib/revision/datos";
import { Revisor } from "@/components/revision/Revisor";

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
 */
export default async function Revisar() {
  if (!(await esRevisor())) notFound();

  return (
    <main className="env app-cuerpo rev">
      <Revisor inicial={await traerCola()} />
    </main>
  );
}
