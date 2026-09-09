import type { Metadata } from "next";
import { caja, encabezado } from "@/content/asistente";
import { Marco } from "@/components/asistente/estado";
import { Selector } from "@/components/asistente/Selector";
import { Chips } from "@/components/asistente/Chips";
import { Caja } from "@/components/asistente/Caja";
import { Catalogo } from "@/components/asistente/Catalogo";
import { Normativa } from "@/components/asistente/Normativa";
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
    <main className="env app-cuerpo instructivo-mpd-claro asis-pantalla">
      <VolverAlPerfil />
      {/* El envoltorio ya no es una tarjeta: la lleva cada sección, para que
          se vea dónde termina una y empieza la otra. Esta clase queda como
          gancho del CSS de los títulos. */}
      <div className="asis-tarjeta"><Marco>
        <header className="instructivo-mpd-tarjeta asis-encabezado">
          <h1>{encabezado.titulo}</h1>
          <p className="asis-bajada-fuerte">{encabezado.bajada}</p>
          <ol className="asis-pasos">
            {encabezado.pasos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <p className="asis-parrafo">{encabezado.parrafo}</p>
        </header>

        {/* Los tres van juntos bajo un solo encabezado: elegir organismo,
            los atajos y la caja son un mismo gesto —preguntar— y sin título
            se leían como piezas sueltas entre dos secciones que sí lo
            tienen. */}
        <section className="instructivo-mpd-tarjeta asis-preguntar" id={caja.ancla}>
          <h2 className="asis-titulo">{caja.titulo}</h2>
          <Selector />
          <Chips />
          <Caja />
        </section>
        {/* Estos dos traen su propia <section> como raíz, así que la tarjeta
            va en un envoltorio en vez de en su className. */}
        <div className="instructivo-mpd-tarjeta">
          <Catalogo />
        </div>
        <div className="instructivo-mpd-tarjeta asis-caja-normativa">
          <Normativa />
        </div>

      </Marco></div>
    </main>
  );
}
