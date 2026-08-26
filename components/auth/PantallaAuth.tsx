import Image from "next/image";
import { Tarjeta } from "@/components/marca/Tarjeta";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import { pieLogos } from "@/content/auth";

/**
 * Envoltorio de las pantallas de ingreso. Neutro a propósito: el
 * data-marca="neutro" lo pone el layout de /ingresar.
 */
export function PantallaAuth({
  children,
  ancha = false,
}: {
  children: React.ReactNode;
  ancha?: boolean;
}) {
  return (
    <>
      <main className="auth-pantalla">
        <Tarjeta className={`auth-caja${ancha ? " perfil-caja" : ""}`}>{children}</Tarjeta>

        <div className="auth-firma" aria-label={pieLogos.ayuda}>
          <Image src="/logos/nexo.png" alt="Nexo Derecho" width={560} height={137} priority />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia conCartel={false} />
        </div>
      </main>
    </>
  );
}
