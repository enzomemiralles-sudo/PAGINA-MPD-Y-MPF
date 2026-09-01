import { trampas as t } from "@/content/inscripcion/textos";
import { trampas as sacarTrampas } from "@/lib/inscripcion/tipos";
import type { Guia } from "@/lib/inscripcion/tipos";

/**
 * Las trampas del trámite, juntas y arriba de todo.
 *
 * Es lo que más valor tiene de la guía: cosas que no están en ningún
 * instructivo oficial y que se aprenden perdiendo el turno. Van repetidas —
 * también aparecen en el paso donde corresponden — a propósito: quien llega
 * con cinco minutos se lleva esto, y quien va a hacer el trámite las
 * encuentra de nuevo en el momento en que importan.
 *
 * No se escriben acá: se sacan de los avisos marcados como trampa en los
 * pasos y las secciones. Así no hay forma de que la lista y los pasos digan
 * cosas distintas.
 */
export function Trampas({ guia }: { guia: Guia }) {
  const lista = sacarTrampas(guia);
  if (lista.length === 0) return null;

  return (
    <section className="ins-trampas">
      <h2 className="ins-titulo">{t.titulo}</h2>
      <p className="ins-bajada">{t.bajada}</p>

      <ol className="ins-trampas-lista">
        {lista.map(({ aviso, paso, ancla }) => (
          <li key={aviso.titulo} className="ins-trampa">
            <p className="ins-trampa-titulo">{aviso.titulo}</p>
            <p className="ins-trampa-texto">{aviso.texto}</p>
            <a className="ins-trampa-ir" href={`#${guia.organismo}-${ancla}`}>
              {paso === null ? t.irALaSeccion : t.irAlPaso(paso)} →
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
