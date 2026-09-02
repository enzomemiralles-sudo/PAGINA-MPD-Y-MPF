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
 *
 * En sesión el pie lo pone el layout del grupo (sesion), que es el único que
 * sabe de qué agrupación es la persona.
 */
const SIN_PIE = ["/ingresar", "/crear-perfil", "/elegir-perfil"];

/**
 * Rutas donde el pie lo pone el layout del grupo (sesion), porque ahí el
 * logotipo gigante lleva el nombre de la agrupación del perfil y esa
 * información sólo la tiene ese layout. Si se pusiera acá también, saldrían
 * dos pies.
 */
const PIE_DE_OTRO_LAYOUT = [
  "/app", "/mi-perfil", "/simulador", "/asistente", "/inscripcion", "/revisar",
];

export function CromoGlobal({ pie }: { pie: React.ReactNode }) {
  const ruta = usePathname() ?? "";
  const conPie =
    !SIN_PIE.some((r) => ruta.startsWith(r)) &&
    !PIE_DE_OTRO_LAYOUT.some((r) => ruta.startsWith(r));

  return <>{conPie ? pie : null}</>;
}
