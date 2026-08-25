/**
 * MARCADOR PROVISORIO.
 *
 * Nueva Abogacía todavía no tiene logotipo vectorial. Todo lo provisorio vive
 * acá y nada más que acá: cuando llegue el archivo se reemplaza el cuerpo de
 * este componente por un <Image> y se borra el cartelito, sin tocar nada más.
 */
export function LogoNuevaAbogacia({ conCartel = true }: { conCartel?: boolean }) {
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
