import Image from "next/image";
import { Fondo } from "@/components/landing/Fondo";
import { Vidrio } from "@/components/marca/Vidrio";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import { pieLogos } from "@/content/auth";

/**
 * Envoltorio de las pantallas de ingreso. Neutro a propósito: el
 * data-marca="neutro" lo pone el layout de /ingresar.
 */
export function PantallaAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Fondo />
      <main className="auth-pantalla">
        <Vidrio className="auth-caja">{children}</Vidrio>

        <div className="auth-firma" aria-label={pieLogos.ayuda}>
          <Image src="/logos/nexo.png" alt="Nexo Derecho" width={560} height={137} priority />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia conCartel={false} />
        </div>
      </main>
    </>
  );
}
