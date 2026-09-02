import { traerVideos } from "@/lib/inscripcion/datos";
import { concursosConGuia, loQueHay } from "@/lib/inscripcion/muestra";
import { Fondo } from "@/components/landing/Fondo";
import { EscenaFrontal } from "@/components/landing/EscenaFrontal";
import { Cabecera } from "@/components/landing/Cabecera";
import { Hero } from "@/components/landing/Hero";
import { SeccionSimulador } from "@/components/landing/SeccionSimulador";
import { SeccionAsistente, SeccionInscripcion } from "@/components/landing/Secciones";

/**
 * La pestaña de muestra.
 *
 * Quedó en cuatro bloques: el hero, y las tres cosas que la plataforma hace.
 * Se retiraron la franja de métricas, las tres tarjetas de acceso, el párrafo
 * de «¿por qué es gratis?» y el bloque de lista de espera; el detalle de cada
 * uno está en la tanda 9 de CAMBIOS.md.
 *
 * El camino a cada puerta queda en el encabezado —«Empezar gratis» lleva a
 * crear el perfil, y ahí se elige agrupación— que es donde estaba antes de que
 * las tarjetas lo duplicaran.
 */
export default async function Landing() {
  const videos = await traerVideos();

  return (
    <>
      <Fondo />
      <EscenaFrontal />
      <Cabecera />
      <main>
        <Hero />
        <SeccionSimulador />
        <SeccionAsistente />
        <SeccionInscripcion hay={loQueHay(videos)} concursos={concursosConGuia()} />
      </main>
    </>
  );
}
