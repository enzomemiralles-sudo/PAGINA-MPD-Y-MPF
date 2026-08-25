import Image from "next/image";

/**
 * La cinta argentina del hero. mix-blend-mode: screen sobre el fondo negro,
 * más la viñeta que mantiene legible el titular.
 *
 * priority={false} a propósito: no debe competir con el LCP, que es el titular.
 * El destello va como capa aparte porque necesita la cinta como máscara, y una
 * máscara CSS pide una URL — no se puede enmascarar con un <Image>.
 */
export function Cinta() {
  return (
    <div className="cinta-wrap" aria-hidden="true">
      <div className="cinta">
        <Image
          src="/marca/cinta-argentina.jpg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          quality={82}
        />
      </div>
      <div className="cinta-glint" />
    </div>
  );
}
