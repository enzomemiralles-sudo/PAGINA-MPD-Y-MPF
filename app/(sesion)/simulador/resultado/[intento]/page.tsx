import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { traerIntento } from "@/lib/simulador/datos";
import { PantallaResultado } from "@/components/simulador/PantallaResultado";

export const metadata: Metadata = { title: "Resultados — Simulador de Exámenes" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ intento: string }> };

/**
 * La página de resultados es sólo el cargador: trae el intento y decide si
 * corresponde mostrarlo. Lo que se ve está en <PantallaResultado>.
 *
 * Volver atrás en el navegador después de entregar no tiene que dejar
 * responder de nuevo, y un intento todavía en curso va a rendir, no acá.
 */
export default async function Resultado({ params }: Props) {
  const { intento: id } = await params;
  const intento = await traerIntento(id);
  if (!intento) notFound();
  if (intento.estado === "en_curso") redirect(`/simulador/rendir/${id}`);

  return <PantallaResultado intento={intento} />;
}
