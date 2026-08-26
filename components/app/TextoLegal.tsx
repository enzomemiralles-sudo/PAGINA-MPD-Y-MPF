import { MAIL_CONTACTO } from "@/lib/marca/marcas";
import { modal as t } from "@/content/onboarding";

/**
 * El texto legal del pie del modal. El nombre de la organización cambia según
 * la marca; «escribiéndonos» es un enlace al mail de contacto.
 */
export function TextoLegal({ texto }: { texto: string }) {
  return (
    <p className="legal-modal">
      {texto}{" "}
      <a href={`mailto:${MAIL_CONTACTO}`}>{t.escribiendonos}</a>.
    </p>
  );
}
