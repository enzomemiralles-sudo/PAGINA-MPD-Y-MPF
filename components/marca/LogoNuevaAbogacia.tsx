import Image from "next/image";

/**
 * El logotipo de Nueva Abogacía.
 *
 * Es el definitivo: el disco con el degradado y las letras en blanco, con el
 * fondo recortado. Ya no hay marcador provisorio ni detección del archivo en
 * disco, porque el archivo existe y no va a cambiar.
 */
export function LogoNuevaAbogacia({ alto = 26 }: { alto?: number }) {
  return (
    <Image
      src="/logos/nueva-abogacia.png"
      alt="Nueva Abogacía"
      width={512}
      height={512}
      priority
      style={{ height: alto, width: alto }}
    />
  );
}
