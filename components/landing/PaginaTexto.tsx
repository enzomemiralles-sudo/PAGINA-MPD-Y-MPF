import { Fondo } from "@/components/landing/Fondo";
import { Cabecera } from "@/components/landing/Cabecera";

/**
 * Envoltorio de las páginas de sólo texto: legales y contacto.
 *
 * El ancho de la prosa se mide en `ch`, no en `rem`: la regla es de 68
 * caracteres por renglón, y en `rem` ese número cambia con cada ajuste de
 * tipografía. En `ch` se cumple sola.
 */
export function PaginaTexto({
  titulo,
  bajada,
  children,
}: {
  titulo: string;
  bajada?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Fondo />
      <Cabecera />
      <main className="env sec pagina-texto">
        <h1>{titulo}</h1>
        {bajada ? <p className="pagina-texto-fecha">{bajada}</p> : null}
        {children}
      </main>
    </>
  );
}

type Bloque = {
  readonly h: string;
  readonly p: readonly string[];
  readonly lista?: readonly string[];
};

/**
 * El cuerpo de un documento legal, tal como sale de content/legales.generado.ts.
 *
 * Las claves son las que produce scripts/legales_a_ts.py y el orden de acá es
 * el orden del documento: entradilla, secciones, firma.
 */
export function DocumentoLegal({
  entradilla,
  bloques,
  firma,
}: {
  entradilla: readonly string[];
  bloques: readonly Bloque[];
  firma: readonly string[];
}) {
  return (
    <>
      {entradilla.map((t) => (
        <p key={t}>{t}</p>
      ))}

      {bloques.map((b) => (
        <section key={b.h}>
          <h2>{b.h}</h2>
          {b.p.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {b.lista ? (
            <ul>
              {b.lista.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {firma.length ? (
        <p className="pagina-texto-firma">
          {firma.map((t, i) => (
            <span key={t}>
              {i === 0 ? <b>{t}</b> : t}
              {i < firma.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ) : null}
    </>
  );
}
