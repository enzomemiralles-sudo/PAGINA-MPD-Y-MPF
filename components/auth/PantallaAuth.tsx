import { LogoNexo } from "@/components/marca/LogoNexo";
import { Tarjeta } from "@/components/marca/Tarjeta";
import { CintaFondo } from "@/components/marca/CintaFondo";
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
      <CintaFondo />
      <main className="auth-pantalla">
        <Tarjeta className={`auth-caja${ancha ? " perfil-caja" : ""}`}>{children}</Tarjeta>

        <div className="auth-firma" aria-label={pieLogos.ayuda}>
          <LogoNexo alto={16} />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia conCartel={false} />
        </div>
      </main>
    </>
  );
}
