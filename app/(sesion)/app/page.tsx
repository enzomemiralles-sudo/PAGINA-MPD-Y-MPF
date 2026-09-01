import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { traerPerfil } from "@/lib/perfil";
import { traerEstadoHome } from "@/lib/simulador/home";
import { ModalDatos } from "@/components/app/ModalDatos";
import { Retencion } from "@/components/app/Retencion";
import { ColumnasHome } from "@/components/app/ColumnasHome";
import { FondoPuerta } from "@/components/app/FondoPuerta";
import { textosDe } from "@/lib/marca/marcas";

export const metadata: Metadata = { title: "Tu cuenta — Nexo Derecho × Nueva Abogacía" };
export const dynamic = "force-dynamic";

/**
 * La home de cada puerta.
 *
 * Portada de `referencia/home-puerta-preview.html`. El orden es el del
 * preview: la fotografía de la facultad en perspectiva de fondo, el bloque de
 * retención sobre la zona oscura de la izquierda, y las tres columnas abajo.
 *
 * El bloque de retención no es decoración: es lo que hace que alguien vuelva.
 * Sale de datos reales del último intento y nunca se esconde — si no hay
 * ninguno, invita a empezar el primero en lugar de dejar la home como un menú
 * suelto.
 */
export default async function App() {
  const perfil = await traerPerfil();
  if (!perfil) redirect("/ingresar");
  if (!perfil.marca) redirect("/elegir-perfil");

  const [estado, textos] = [await traerEstadoHome(), textosDe(perfil.marca)];

  return (
    <main className="portal">
      <FondoPuerta marca={perfil.marca} />

      {/* La primera vez se abre solo. Se puede cerrar y completar después. */}
      {perfil.tipo_perfil && !perfil.onboarding_completado ? (
        <ModalDatos
          tipo={perfil.tipo_perfil}
          org={textos.corto}
          legal={textos.legalGuarda}
          bajada={textos.modalBajada}
        />
      ) : null}

      <div className="env portal-medio">
        <Retencion nombre={perfil.nombre} estado={estado} />
      </div>

      <div className="env">
        <ColumnasHome marca={perfil.marca} />
      </div>
    </main>
  );
}
