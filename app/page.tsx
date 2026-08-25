import { traerConcursos, traerMetricas } from "@/lib/datos";
import { Fondo } from "@/components/landing/Fondo";
import { Cinta } from "@/components/landing/Cinta";
import { Cabecera } from "@/components/landing/Cabecera";
import { Hero } from "@/components/landing/Hero";
import { PreguntaFirma } from "@/components/landing/PreguntaFirma";
import { FranjaEstado } from "@/components/landing/FranjaEstado";
import { MaquetaSimulador } from "@/components/landing/MaquetaSimulador";
import { Numeros } from "@/components/landing/Numeros";
import { Cierre } from "@/components/landing/Cierre";
import {
  SeccionPuntaje,
  SeccionNorma,
  SeccionAsistente,
  SeccionInscripcion,
  SeccionGratis,
} from "@/components/landing/Secciones";

export default async function Landing() {
  const [concursos, metricas] = await Promise.all([traerConcursos(), traerMetricas()]);

  return (
    <>
      <Fondo />
      <Cinta />
      <Cabecera />
      <main>
        <Hero />
        <PreguntaFirma preguntasRestantes={Math.max(metricas.preguntasMpd - 1, 0)} />
        <FranjaEstado concursos={concursos} />
        <MaquetaSimulador />
        <SeccionPuntaje />
        <SeccionNorma />
        <SeccionAsistente dudasMpf={metricas.dudasMpf} />
        <SeccionInscripcion />
        <Numeros metricas={metricas} />
        <SeccionGratis />
        <Cierre />
      </main>
    </>
  );
}
