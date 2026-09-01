import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { traerPerfil } from "@/lib/perfil";
import { PIELES } from "@/lib/marca/tokens";
import { AplicarPiel } from "@/components/marca/AplicarPiel";
import { CabeceraApp } from "@/components/app/CabeceraApp";
import { PieLegal } from "@/components/landing/PieLegal";

export const dynamic = "force-dynamic";

/**
 * El cromo del navegador también toma la piel.
 *
 * `theme-color` es lo que pinta la barra de estado del teléfono: sin esto, la
 * puerta de Nexo es verde hasta donde llega la página y arriba sigue el negro
 * de la portada. Sale del mismo token que el fondo, así que no puede quedar
 * desfasado.
 */
export async function generateViewport(): Promise<Viewport> {
  const perfil = await traerPerfil();
  const marca = perfil?.marca ?? "neutro";
  return { themeColor: PIELES[marca].fondo };
}

/**
 * Y la pestaña. Es la misma balanza del icono general —que es de la
 * plataforma, no de una de las dos agrupaciones— pero en la piel del perfil,
 * para que quien tenga varias pestañas abiertas reconozca la suya.
 */
export async function generateMetadata(): Promise<Metadata> {
  const perfil = await traerPerfil();
  const marca = perfil?.marca;
  // La piel neutra —el perfil «otro»— no tiene agrupación, así que se queda
  // con el icono general, que es el de la plataforma. Inventarle un color
  // sería darle una pertenencia que esa persona dijo que no tiene.
  if (marca !== "nexo" && marca !== "na") return {};
  return { icons: { icon: `/icono-${marca}.svg` } };
}

/**
 * El marco de todo lo que se ve con sesión iniciada.
 *
 * La cabecera —con «Mi perfil» siempre a la vista— y la piel de la marca viven
 * acá y no en cada página: son lo mismo en todas, y repetirlas garantizaba que
 * tarde o temprano una pantalla nueva se olvidara de ponerlas.
 *
 * Los dos cortes también son de acá: sin sesión no se entra, y con sesión pero
 * sin marca elegida se va a elegirla. El middleware ya hace ambos, pero un
 * layout que asume una marca que puede no existir se rompe solo, así que lo
 * comprueba de nuevo. `traerPerfil` está memoizado por request: esta consulta
 * y la de la página son una sola.
 */
export default async function LayoutSesion({ children }: { children: React.ReactNode }) {
  const perfil = await traerPerfil();
  if (!perfil) redirect("/ingresar");
  if (!perfil.marca) redirect("/elegir-perfil");

  return (
    <>
      <AplicarPiel marca={perfil.marca} />
      <CabeceraApp marca={perfil.marca} revisor={perfil.rol === "revisor"} />
      {children}
      {/* El pie va acá y no en el layout raíz: el logotipo gigante lleva el
          nombre de la agrupación, y sólo este layout sabe cuál es. */}
      <PieLegal marca={perfil.marca} />
    </>
  );
}
