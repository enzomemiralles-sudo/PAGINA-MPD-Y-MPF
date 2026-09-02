import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { organismos, reglas as t, vacio } from "@/content/simulador";
import { traerInstancias } from "@/lib/simulador/datos";
import { ReglasDePuntaje } from "@/components/simulador/ReglasDePuntaje";
import { BotonComenzar } from "@/components/simulador/BotonComenzar";
import { VolverAlPerfil } from "@/components/app/VolverAlPerfil";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ organismo: string }> };

function buscar(clave: string) {
  return organismos.find((o) => o.clave === clave);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const org = buscar((await params).organismo);
  return { title: `${org?.sigla ?? "Simulador"} — Simulador de Exámenes` };
}

/**
 * Las dos instancias de un organismo, con sus reglas de corrección.
 *
 * Es la pantalla donde se decide qué practicar, así que las reglas van acá y
 * no antes: enterarse de que errar descuenta diez puntos cuando ya empezaste
 * el examen es enterarse tarde.
 *
 * Una instancia sin preguntas publicadas no muestra un botón que no lleva a
 * ningún lado: dice qué pasa. Hoy es el caso de todas las de opción múltiple,
 * porque las preguntas están sin revisar y la política de la base no las deja
 * salir hasta que alguien las mire.
 */
export default async function Organismo({ params }: Props) {
  const clave = (await params).organismo;
  const org = buscar(clave);
  if (!org) notFound();

  const instancias = await traerInstancias(org.clave);

  return (
    <main className="env app-cuerpo sim">
      <VolverAlPerfil />
      <header className="sim-encabezado sim-encabezado-org">
        <span className="sim-org-sigla mono">{org.sigla}</span>
        <h1>{org.nombre}</h1>
      </header>

      <div className="sim-instancias">
        {instancias.map((examen) => {
          const texto = org.instancias.find((i) => i.instancia === examen.instancia);
          return (
            <section key={examen.id} className="sim-instancia tarjeta-app">
              <h2 className="sim-instancia-titulo">{texto?.titulo ?? examen.titulo}</h2>
              {texto ? <p className="sim-instancia-detalle">{texto.detalle}</p> : null}

              <ReglasDePuntaje examen={examen} />

              <div className="sim-instancia-pie">
                {examen.hayPreguntas ? (
                  <BotonComenzar examenId={examen.id} />
                ) : (
                  <p className="sim-vacio">
                    <strong>{vacio.titulo}</strong>
                    <span>{vacio.texto}</span>
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <Link className="btn btn-s sim-volver" href="/simulador">
        {t.volver}
      </Link>
    </main>
  );
}
