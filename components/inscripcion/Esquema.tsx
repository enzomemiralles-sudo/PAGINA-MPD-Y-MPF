import { esquemas as t } from "@/content/inscripcion/textos";
import type { Esquema as Dato } from "@/lib/inscripcion/tipos";

/**
 * Los esquemas de los pasos.
 *
 * No son capturas y se rotulan como lo que son. Existen porque el sistema de
 * inscripción del MPD es una aplicación Flex que se instala en Windows: sus
 * pantallas no están en la web y sólo pueden salir de alguien que haga el
 * trámite. Mientras tanto, lo que el texto explica mal —dónde cae un campo
 * entre nueve páginas, cuál es el camino de menús— se puede dibujar.
 *
 * Están hechos de marcado y no de imágenes. Reflowean a 375px sin achicar la
 * letra hasta lo ilegible, se leen en voz alta, y siguen los colores de la
 * marca en lugar de traerlos quemados.
 */

/** Una caja del diagrama. `estado` marca la que hay que mirar. */
function Caja({
  rotulo,
  texto,
  estado,
}: {
  rotulo?: string;
  texto: string;
  estado?: "mira" | "ojo";
}) {
  return (
    <div className="esq-caja" data-estado={estado}>
      {rotulo ? <span className="esq-caja-rotulo">{rotulo}</span> : null}
      <span className="esq-caja-texto">{texto}</span>
    </div>
  );
}

function Flecha() {
  return (
    <span className="esq-flecha" aria-hidden="true">
      →
    </span>
  );
}

function Instalar() {
  return (
    <div className="esq-flujo">
      <Caja rotulo="1" texto="concursos.mpd.gov.ar, desde una PC con Windows" />
      <Flecha />
      <Caja rotulo="2" texto="Se baja concursos-prod.msi y se instala" />
      <Flecha />
      <Caja rotulo="3" texto="Queda el acceso directo azul CONCURSOS en el escritorio" estado="mira" />
    </div>
  );
}

function Registro() {
  return (
    <div className="esq-columna">
      <div className="esq-formulario">
        <p className="esq-formulario-titulo">Registrarse por primera vez</p>
        <dl className="esq-campos">
          <div>
            <dt>CUIL</dt>
            <dd>sin guiones ni puntos</dd>
          </div>
          <div>
            <dt>Correo electrónico</dt>
            <dd>uno que revises</dd>
          </div>
          <div>
            <dt>Contraseña</dt>
            <dd>
              <ul className="esq-requisitos">
                <li>8 caracteres</li>
                <li>un número</li>
                <li>una minúscula</li>
                <li>una MAYÚSCULA</li>
                <li>un símbolo ($)</li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
      <Flecha />
      <Caja
        rotulo="Llega por mail"
        texto="Un enlace de validación. Abrilo desde la misma PC donde instalaste la aplicación"
        estado="mira"
      />
    </div>
  );
}

/** Las nueve páginas del CV. Lo que el texto explica peor es dónde cae cada cosa. */
const PAGINAS: { n: number; que: string; estado?: "mira" | "ojo" }[] = [
  { n: 1, que: "Datos personales" },
  { n: 2, que: "Domicilio y Estudios · «Título Principal»", estado: "mira" },
  { n: 3, que: "No se adjunta nada", estado: "ojo" },
  { n: 4, que: "Antecedentes" },
  { n: 5, que: "Antecedentes" },
  { n: 6, que: "Antecedentes" },
  { n: 7, que: "Antecedentes" },
  { n: 8, que: "Antecedentes" },
  { n: 9, que: "Antecedentes" },
];

function Cv() {
  return (
    <div className="esq-columna">
      <ol className="esq-paginas">
        {PAGINAS.map((p) => (
          <li key={p.n} className="esq-pagina" data-estado={p.estado}>
            <span className="esq-pagina-n">{p.n}</span>
            <span className="esq-pagina-que">{p.que}</span>
          </li>
        ))}
      </ol>
      <p className="esq-nota">
        Se avanza con «Siguiente», que va guardando. Se cierra con «Guardar».
      </p>
    </div>
  );
}

function Inscribirse() {
  return (
    <div className="esq-columna">
      <ol className="esq-camino">
        <li>Menú Principal</li>
        <li>Técnico Administrativo</li>
        <li>El examen de tu jurisdicción</li>
        <li>Siguiente, revisando los datos del CV</li>
        <li>Guardar</li>
      </ol>
      <Caja
        rotulo="La única confirmación"
        texto="«Mis Inscripciones», dentro de la aplicación. No llega ningún mail ni número de inscripción"
        estado="mira"
      />
    </div>
  );
}

const DIBUJOS = {
  instalar: Instalar,
  registro: Registro,
  cv: Cv,
  inscribirse: Inscribirse,
} as const;

export function Esquema({ esquema }: { esquema: Dato }) {
  const Dibujo = DIBUJOS[esquema.clave];

  return (
    <figure className="ins-esquema">
      <p className="esq-rotulo">{t.rotulo}</p>
      <Dibujo />
      <figcaption>{esquema.pie}</figcaption>
    </figure>
  );
}
