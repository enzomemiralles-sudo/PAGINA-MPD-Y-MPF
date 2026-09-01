import Link from "next/link";
import { pie } from "@/content/legales";
import { configDe, laOtra } from "@/lib/marca/marcas";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import type { Marca } from "@/lib/marca/tokens";

/**
 * El pie. El aviso de no oficialidad va en todas las vistas.
 *
 * Dos piezas vienen de los previews y dependen de la puerta:
 *
 * - El logotipo gigante. En la pestaña pública dice qué es el sitio; en la
 *   home de cada puerta, el nombre de la agrupación. Es un degradé recortado
 *   sobre el texto, así que se desvanece hacia abajo en lugar de cortarse.
 * - La línea de coorganización. En sesión el encabezado lleva un solo logo,
 *   el de la agrupación del perfil; el de la otra aparece acá, chico, para
 *   que se siga viendo que el sitio es de las dos.
 */
/**
 * El logotipo gigante del pie.
 *
 * El preview lo fija en `clamp(2.1rem, 10.4vw, 8.4rem)`, y ese número sirve
 * para una sola palabra: con «INGRESO DEMOCRÁTICO», que tiene diecinueve
 * caracteres, se corta a la mitad. El tamaño se calcula del largo del texto
 * para que las tres versiones —el nombre del sitio y el de cada agrupación—
 * ocupen el ancho sin desbordar.
 *
 * Sigue sangrando 6vw a cada lado, como en el preview: la idea es que toque
 * los bordes, no que quepa con margen.
 */
function Gigante({ texto }: { texto: string }) {
  return (
    <p
      className="gigante"
      aria-hidden="true"
      style={{ "--gigante-largo": texto.length } as React.CSSProperties}
    >
      {texto}
    </p>
  );
}

export function PieLegal({ marca = "dual" }: { marca?: Marca }) {
  const propia = configDe(marca);
  const otra = laOtra(marca);

  return (
    <footer className="pie">
      <div className="env">
        <p className="aviso">{pie.aviso}</p>

        <div className="pie-links">
          {pie.links.map((l) =>
            "externo" in l && l.externo ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.texto}
              </a>
            ) : (
              <Link key={l.href} href={l.href}>
                {l.texto}
              </Link>
            ),
          )}
        </div>

        {otra ? (
          <p className="pie-coorg">
            <span className="mono">{pie.coorganizacion}</span>
            {otra.id === "nexo" ? <LogoNexo alto={14} /> : <LogoNuevaAbogacia alto={16} />}
          </p>
        ) : null}

        <div className="nota-prov">
          <b>{pie.notaProvisoriaTitulo}</b>
          {pie.notaProvisoriaTexto}
        </div>
      </div>

      <Gigante texto={propia ? propia.gigante : pie.gigantePublica} />
    </footer>
  );
}
