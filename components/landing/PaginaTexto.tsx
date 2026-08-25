import { Fondo } from "@/components/landing/Fondo";
import { Cabecera } from "@/components/landing/Cabecera";

/** Envoltorio de las páginas de sólo texto: legales y contacto. */
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
      <main className="env sec" style={{ maxWidth: "44rem" }}>
        <h1 style={{ fontSize: "clamp(2rem,6vw,3.2rem)" }}>{titulo}</h1>
        {bajada ? <p style={{ marginTop: "1.4rem", fontSize: ".97rem" }}>{bajada}</p> : null}
        {children}
      </main>
    </>
  );
}

export function BloquesTexto({
  bloques,
}: {
  bloques: readonly { readonly h: string; readonly p: readonly string[] }[];
}) {
  return (
    <>
      {bloques.map((b) => (
        <section key={b.h} style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.3rem" }}>{b.h}</h2>
          {b.p.map((t) => (
            <p key={t} style={{ marginTop: ".9rem", fontSize: ".95rem", lineHeight: 1.65 }}>
              {t}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}
