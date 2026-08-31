import type { Aviso as Dato } from "@/lib/inscripcion/tipos";

/**
 * Un aviso dentro de un paso.
 *
 * Los tres tonos no son decoración. `trampa` es lo que hace perder el turno y
 * tiene el peso visual más fuerte de la página, por encima del texto del paso:
 * quien sólo mira por encima tiene que llevarse eso. `ojo` es una advertencia
 * común y `dato` es información que tranquiliza.
 */
export function Aviso({ aviso }: { aviso: Dato }) {
  return (
    <aside className="ins-aviso" data-tono={aviso.tono}>
      <p className="ins-aviso-titulo">{aviso.titulo}</p>
      <p className="ins-aviso-texto">{aviso.texto}</p>
    </aside>
  );
}
