import { secciones } from "@/content/asistente";
import { FUENTES } from "@/content/asistente/fuentes";
import { respuesta as t } from "@/content/asistente";

/**
 * Los documentos con los que se arman las respuestas verdes.
 *
 * Es a donde lleva el «Ver normativa» del estado rojo (A-07): cuando no
 * tenemos la respuesta, lo menos que corresponde es dejar a mano las fuentes
 * para que la persona la busque por su cuenta, en vez de dejarla en la nada.
 */
export function Normativa() {
  return (
    <section className="asis-normativa" id={secciones.normativa.ancla}>
      <h2 className="asis-titulo">{secciones.normativa.titulo}</h2>
      <p className="asis-bajada">{secciones.normativa.bajada}</p>

      <ul className="asis-fuentes">
        {FUENTES.map((f) => (
          <li key={f.id} className="asis-fuente-item" data-para={f.organismo}>
            <p className="asis-org-etiqueta">
              {f.organismo === "ambos" ? "MPD · MPF" : f.organismo.toUpperCase()}
            </p>
            <p className="asis-fuente-nombre">{f.nombre}</p>
            <p className="asis-fuente-que">{f.que}</p>
            <a href={f.url} target="_blank" rel="noopener noreferrer">
              {t.verFuente}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
