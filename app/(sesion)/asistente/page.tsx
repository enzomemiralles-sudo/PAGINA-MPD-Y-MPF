import type { Metadata } from "next";
import { encabezado, sinRespuesta } from "@/content/asistente";
import { Marco } from "@/components/asistente/estado";
import { Selector } from "@/components/asistente/Selector";
import { Chips } from "@/components/asistente/Chips";
import { Caja } from "@/components/asistente/Caja";
import { Catalogo } from "@/components/asistente/Catalogo";
import { Normativa } from "@/components/asistente/Normativa";
import { DejarConsulta } from "@/components/asistente/DejarConsulta";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";

export const metadata: Metadata = {
  title: "Asistente de Ingreso Democrático — Nexo Derecho × Nueva Abogacía",
};

/**
 * El asistente.
 *
 * Lo que distingue esta pantalla no es que conteste bien: es que distingue lo
 * que sabe de lo que no. Cada respuesta sale con uno de tres sellos —verde si
 * hay un documento oficial que se puede abrir desde acá, amarillo si sale de
 * la memoria de quienes rindieron, rojo si no hay con qué respaldarla— y el
 * rojo es una respuesta válida, no una falla.
 *
 * El orden de la página está pensado para que el chat no sea el único camino:
 * arriba el concurso, que filtra todo; después la caja de preguntas; y en
 * seguida el catálogo completo de lo ya respondido, que para mucha gente es
 * más rápido y más tranquilo que escribirle a una máquina.
 *
 * El catálogo se arma en el servidor, con los dos organismos, y el selector
 * esconde el que no corresponde. Así el corpus —35 KB comprimidos, la mitad
 * en las citas del chat que hacen andar la búsqueda— nunca viaja al teléfono.
 */
export default function Asistente() {
  return (
    <main className="env app-cuerpo">
      <VolverAlPerfil />
      <Marco>
        <header className="asis-encabezado">
          <p className="asis-posicionamiento">{encabezado.posicionamiento}</p>
          <h1>{encabezado.titulo}</h1>
          <p className="asis-bajada-fuerte">{encabezado.bajada}</p>
          <ol className="asis-pasos">
            {encabezado.pasos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p className="asis-parrafo">{encabezado.parrafo}</p>
        </header>

        <Selector />
        <Chips />
        <Caja />
        <Catalogo />
        <Normativa />

        <section className="asis-dejar-seccion" id={sinRespuesta.ancla}>
          <DejarConsulta origen="formulario" />
        </section>
      </Marco>
    </main>
  );
}
