import type { Metadata } from "next";
import { contacto as t } from "@/content/contacto";
import { PaginaTexto } from "@/components/landing/PaginaTexto";
import { FormularioContacto } from "@/components/landing/FormularioContacto";

export const metadata: Metadata = { title: `${t.titulo} — Nexo Derecho × Nueva Abogacía` };

export default function Contacto() {
  return (
    <PaginaTexto titulo={t.encabezado}>
      <p className="contacto-destacado">{t.destacado}</p>
      <p>{t.bajada}</p>

      <section>
        <h2>{t.escribinos}</h2>
        <ul className="contacto-correos">
          {t.correos.map((c) => (
            <li key={c.mail}>
              <span className="organizacion">{c.organizacion}</span>
              <a href={`mailto:${c.mail}`}>{c.mail}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t.redes}</h2>
        <p>{t.redesTexto}</p>
        <div className="contacto-redes">
          {t.instagram.map((r) => (
            <a
              key={r.arroba}
              className="btn btn-s"
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {r.arroba}
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2>{t.formulario.titulo}</h2>
        <FormularioContacto />
      </section>
    </PaginaTexto>
  );
}
