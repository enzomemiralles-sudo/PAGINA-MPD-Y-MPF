// TEMPORAL — se borra.
// Monta la home de puerta con datos inventados para poder verla en el
// navegador sin sesión. Los tres estados del bloque de retención se eligen
// con ?e=retomar|seguimos|primera y la piel con ?m=nexo|na.
import { Retencion } from "@/components/app/Retencion";
import { ColumnasHome } from "@/components/app/ColumnasHome";
import { FondoPuerta } from "@/components/app/FondoPuerta";
import type { EstadoHome } from "@/lib/simulador/home";
import type { Examen } from "@/lib/simulador/datos";
import type { Marca } from "@/lib/marca/tokens";
import { AplicarPiel } from "@/components/marca/AplicarPiel";

export const dynamic = "force-dynamic";

const EXAMEN: Examen = {
  id: "x",
  organismo: "mpf",
  instancia: "teorico",
  modalidad: "multiple_choice",
  titulo: "MPF · Teórico · Multiple choice",
  duracionMinutos: 30,
  cantidadPreguntas: 20,
  reglas: { puntosCorrecta: 1, puntosIncorrecta: 0, puntosBlanco: 0, puntajeInicial: 0, puntajeMinimo: 0 },
  hayPreguntas: true,
};

const ESTADOS: Record<string, EstadoHome> = {
  retomar: {
    retomar: { intentoId: "abc", examen: EXAMEN, respondidas: 13, total: 20, segundos: 754 },
    temas: [
      { tema: "Ley 27.148", correctas: 7, total: 9, porcentaje: 78 },
      { tema: "Constitución Nacional", correctas: 5, total: 10, porcentaje: 50 },
      { tema: "Ética y transparencia", correctas: 4, total: 5, porcentaje: 80 },
    ],
    terminados: 3,
  },
  seguimos: {
    retomar: null,
    temas: [
      { tema: "Ley 27.148", correctas: 7, total: 9, porcentaje: 78 },
      { tema: "Constitución Nacional", correctas: 5, total: 10, porcentaje: 50 },
    ],
    terminados: 2,
  },
  primera: { retomar: null, temas: [], terminados: 0 },
};

export default async function P({ searchParams }: { searchParams: Promise<{ e?: string; m?: string }> }) {
  const q = await searchParams;
  const marca = (q.m === "na" ? "na" : "nexo") as Marca;
  const estado = ESTADOS[q.e ?? "retomar"] ?? ESTADOS["retomar"]!;

  return (
    <main className="portal">
      <AplicarPiel marca={marca} />
      <FondoPuerta marca={marca} />
      <div className="env portal-medio">
        <Retencion nombre="Enzo" estado={estado} />
      </div>
      <div className="env">
        <ColumnasHome marca={marca} />
      </div>
    </main>
  );
}
