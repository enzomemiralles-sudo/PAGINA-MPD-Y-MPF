import { traerMetricas } from "@/lib/datos";
import { Fondo } from "@/components/landing/Fondo";
import { Cinta } from "@/components/landing/Cinta";
import { Cabecera } from "@/components/landing/Cabecera";
import { Hero } from "@/components/landing/Hero";
import { MaquetaSimulador } from "@/components/landing/MaquetaSimulador";
import { Numeros } from "@/components/landing/Numeros";
import { Cierre } from "@/components/landing/Cierre";
import {
  SeccionAsistente,
  SeccionInscripcion,
  SeccionGratis,
} from "@/components/landing/Secciones";

export default async function Landing() {
  const metricas = await traerMetricas();

  return (
    <>
      <Fondo />
      <Cinta />
      <Cabecera />
      <main>
        <Hero />
        <MaquetaSimulador />
        <SeccionAsistente dudasMpf={metricas.dudasMpf} />
        <SeccionInscripcion />
        <Numeros metricas={metricas} />
        <SeccionGratis />
        <Cierre />
      </main>
    </>
  );
}
