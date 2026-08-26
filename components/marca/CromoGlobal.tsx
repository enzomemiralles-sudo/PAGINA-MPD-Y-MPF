"use client";

import { usePathname } from "next/navigation";
import { ConmutadorPuerta } from "./ConmutadorPuerta";

/**
 * El cromo que envuelve a la landing pública.
 *
 * El conmutador de puertas no va en el ingreso ni adentro de la app: en el
 * ingreso la persona todavía no eligió marca —elegirla ahí contradiría el
 * flujo— y adentro la marca sale del perfil, no de un botón.
 *
 * El aviso de no oficialidad sí va en todas las vistas de contenido. En el
 * ingreso no, porque ahí no se muestra información del examen y la pantalla
 * pide sobriedad: abajo van los dos logos como firma y nada más.
 */
const SIN_CONMUTADOR = ["/ingresar", "/app", "/mi-perfil"];
const SIN_PIE = ["/ingresar"];

export function CromoGlobal({ pie }: { pie: React.ReactNode }) {
  const ruta = usePathname() ?? "";
  const conmutador = !SIN_CONMUTADOR.some((r) => ruta.startsWith(r));
  const conPie = !SIN_PIE.some((r) => ruta.startsWith(r));

  return (
    <>
      {conmutador ? <ConmutadorPuerta /> : null}
      {conPie ? pie : null}
    </>
  );
}
