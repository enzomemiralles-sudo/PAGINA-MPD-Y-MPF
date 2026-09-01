import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { esRevisor } from "@/lib/revision/datos";
import { traerPerfil } from "@/lib/perfil";
import { AplicarPiel } from "@/components/marca/AplicarPiel";
import { PanelCarga } from "@/components/admin/PanelCarga";
import { admin as t } from "@/content/admin";

export const metadata: Metadata = { title: "Cargar preguntas — Panel" };
export const dynamic = "force-dynamic";

/**
 * El panel de carga.
 *
 * Va fuera del grupo (sesion) y con piel neutra: no es una pantalla de
 * ninguna de las dos puertas, es la trastienda. Quien entra acá está
 * trabajando sobre el contenido de las dos.
 *
 * El corte es doble, como en /revisar: sin sesión se va al ingreso, y con
 * sesión pero sin el rol, a la app. El rol se otorga a mano en la base; no
 * hay manera de pedirlo desde la interfaz.
 */
export default async function Admin() {
  const perfil = await traerPerfil();
  if (!perfil) redirect("/ingresar");
  if (!(await esRevisor())) redirect("/app");

  return (
    <main className="env app-cuerpo adm-pantalla">
      <AplicarPiel marca="neutro" />
      <h1>{t.titulo}</h1>
      <p className="adm-bajada">{t.bajada}</p>
      <PanelCarga />
    </main>
  );
}
