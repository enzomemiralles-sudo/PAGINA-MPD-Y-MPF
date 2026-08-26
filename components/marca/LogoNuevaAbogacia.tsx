import { existsSync, openSync, readSync, closeSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

const ARCHIVO = "nueva-abogacia.png";
const RUTA_PUBLICA = `/logos/${ARCHIVO}`;
const RUTA_DISCO = join(process.cwd(), "public", "logos", ARCHIVO);

/** Lee el ancho y el alto del encabezado IHDR de un PNG, sin dependencias. */
function medirPng(ruta: string): { ancho: number; alto: number } | null {
  try {
    const fd = openSync(ruta, "r");
    const buf = Buffer.alloc(24);
    readSync(fd, buf, 0, 24, 0);
    closeSync(fd);
    // 89 50 4E 47 = firma PNG; el IHDR arranca en el byte 16.
    if (buf.readUInt32BE(0) !== 0x89504e47) return null;
    return { ancho: buf.readUInt32BE(16), alto: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

const medida = existsSync(RUTA_DISCO) ? medirPng(RUTA_DISCO) : null;

/**
 * El logotipo de Nueva Abogacía.
 *
 * Mientras el archivo no esté en public/logos/ se dibuja el marcador
 * provisorio. En cuanto aparezca, este componente lo usa solo: no hay que
 * tocar código en ningún otro lado. Todo lo provisorio vive acá.
 */
export function LogoNuevaAbogacia({
  conCartel = true,
  alto = 21,
}: {
  conCartel?: boolean;
  alto?: number;
}) {
  if (medida) {
    return (
      <Image
        src={RUTA_PUBLICA}
        alt="Nueva Abogacía"
        width={medida.ancho}
        height={medida.alto}
        priority
        style={{ height: alto, width: "auto" }}
      />
    );
  }

  return (
    <span className="na-mark">
      <span className="na-circ" aria-hidden="true">
        na
      </span>
      <span className="sr-only">Nueva Abogacía</span>
      {conCartel ? <span className="prov">provisorio</span> : null}
    </span>
  );
}
