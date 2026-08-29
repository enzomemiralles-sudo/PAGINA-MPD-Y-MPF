import type { Metadata } from "next";
import Link from "next/link";
import {
  cierre,
  eleccion,
  encabezado,
  organismos,
  retomar,
} from "@/content/simulador";
import { traerIntentoEnCurso } from "@/lib/simulador/datos";
import { TarjetaOrganismo } from "@/components/simulador/TarjetaOrganismo";
import { ComoFunciona } from "@/components/simulador/ComoFunciona";
import { AvisoOrientativo } from "@/components/simulador/AvisoOrientativo";

export const metadata: Metadata = {
  title: "Simulador de Exámenes — Nexo Derecho × Nueva Abogacía",
};
export const dynamic = "force-dynamic";

/**
 * El hub del simulador.
 *
 * El orden es el del recorrido: qué es, empezá, cómo funciona, qué no es.
 * Nada entre el encabezado y las dos tarjetas, porque lo que la persona vino a
 * hacer es elegir un examen y arrancar.
 *
 * Si dejó un examen a medias, eso va arriba de todo: retomarlo es más urgente
 * que empezar otro.
 */
export default async function Simulador() {
  const enCurso = await traerIntentoEnCurso();

  return (
    <main className="env app-cuerpo sim">
      <header className="sim-encabezado">
        <h1>{encabezado.titulo}</h1>
        <p className="sim-bajada">{encabezado.bajada}</p>
        <p className="sim-parrafo">{encabezado.parrafo}</p>
        <a className="btn btn-p" href={`#${encabezado.ancla}`}>
          {encabezado.cta}
        </a>
      </header>

      {enCurso ? (
        <aside className="sim-retomar tarjeta-app">
          <div>
            <p className="sim-retomar-titulo">{retomar.titulo}</p>
            <p className="sim-retomar-texto">{retomar.texto}</p>
          </div>
          <Link className="btn btn-p" href={`/simulador/rendir/${enCurso.id}`}>
            {retomar.cta}
          </Link>
        </aside>
      ) : null}

      <section id={encabezado.ancla} className="sim-eleccion">
        <h2 className="sim-titulo">{eleccion.titulo}</h2>
        <p className="sim-subbajada">{eleccion.bajada}</p>
        <div className="sim-organismos">
          {organismos.map((o) => (
            <TarjetaOrganismo key={o.clave} org={o} />
          ))}
        </div>
      </section>

      <ComoFunciona />
      <AvisoOrientativo />

      <section className="sim-cierre">
        <h2 className="sim-cierre-titulo">{cierre.titulo}</h2>
        <p className="sim-bajada">{cierre.bajada}</p>
        <p className="sim-gratis mono">{cierre.gratis}</p>
        <a className="btn btn-p" href={`#${encabezado.ancla}`}>
          {cierre.cta}
        </a>
      </section>
    </main>
  );
}
