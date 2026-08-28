"use client";

import { usePathname } from "next/navigation";

/**
 * El cromo que envuelve a la landing pública.
 *
 * El aviso de no oficialidad va en todas las vistas de contenido. En las
 * pantallas de entrada no —ingresar, crear perfil, elegir perfil—: ahí no se
 * muestra información del examen y la pantalla pide sobriedad, con los dos
 * logos abajo como firma y nada más.
 *
 * El conmutador de puertas ya no existe. El sistema de pieles sigue en pie
 * —tokens.css, MarcaProvider, AplicarPiel— pero la marca sale del perfil de
 * cada persona, no de un botón que cualquiera puede tocar.
 */
const SIN_PIE = ["/ingresar", "/crear-perfil", "/elegir-perfil"];

export function CromoGlobal({ pie }: { pie: React.ReactNode }) {
  const ruta = usePathname() ?? "";
  const conPie = !SIN_PIE.some((r) => ruta.startsWith(r));

  return <>{conPie ? pie : null}</>;
}
