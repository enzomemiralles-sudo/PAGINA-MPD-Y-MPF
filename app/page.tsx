import { traerMetricas } from "@/lib/datos";
import { traerVideos } from "@/lib/inscripcion/datos";
import { concursosConGuia, loQueHay } from "@/lib/inscripcion/muestra";
import { Fondo } from "@/components/landing/Fondo";
import { EscenaFrontal } from "@/components/landing/EscenaFrontal";
import { Cabecera } from "@/components/landing/Cabecera";
import { Hero } from "@/components/landing/Hero";
import { SeccionSimulador } from "@/components/landing/SeccionSimulador";
import { Numeros } from "@/components/landing/Numeros";
import { Cierre } from "@/components/landing/Cierre";
import {
  SeccionAsistente,
  SeccionInscripcion,
  SeccionGratis,
} from "@/components/landing/Secciones";

export default async function Landing() {
  const [metricas, videos] = await Promise.all([traerMetricas(), traerVideos()]);

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
        <Numeros metricas={metricas} />
        <SeccionGratis />
        <Cierre />
      </main>
    </>
  );
}
