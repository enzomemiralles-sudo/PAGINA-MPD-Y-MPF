import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { segundosRestantes, traerIntento } from "@/lib/simulador/datos";
import { MotorPreguntas } from "@/components/simulador/MotorPreguntas";
import { MotorTipeo } from "@/components/simulador/MotorTipeo";

export const metadata: Metadata = { title: "Rindiendo — Simulador de Exámenes" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ intento: string }> };

/**
 * Rendir.
 *
 * Una sola ruta para las cuatro instancias: la pantalla la elige la
 * `modalidad` del examen, no la URL. Un examen que se responde por opción
 * múltiple se responde igual sea del MPF o del MPD, y el tipeo es otra cosa
 * enteramente.
 *
 * El tiempo restante lo calcula el servidor desde `iniciado_en`: recargar la
 * página no regala minutos.
 *
 * Si el intento ya está cerrado se va a los resultados. Volver atrás en el
 * navegador después de entregar no tiene que dejar responder de nuevo.
 */
export default async function Rendir({ params }: Props) {
  const { intento: id } = await params;
  const intento = await traerIntento(id);
  if (!intento) notFound();
  if (intento.estado !== "en_curso") redirect(`/simulador/resultado/${id}`);

  const segundos = segundosRestantes(intento);

  return (
    <main className="env app-cuerpo">
      {intento.examen.modalidad === "tipeo" ? (
        <MotorTipeo intento={intento} segundos={segundos} />
      ) : (
        <MotorPreguntas intento={intento} segundos={segundos} />
      )}
    </main>
  );
}
