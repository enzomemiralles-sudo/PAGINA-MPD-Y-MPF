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
    // La piel va en este marco, no sólo en <html>: así el ingreso se ve bien
    // aunque el script del head no haya corrido. El marco pinta el fondo, la
    // cinta va encima y el contenido arriba de todo.
    <div className="auth-marco" data-superficie="clara" data-marca="neutro">
      <CintaFondo />
      <main className="auth-pantalla">
        <Tarjeta className={`auth-caja${ancha ? " perfil-caja" : ""}`}>{children}</Tarjeta>

        <div className="auth-firma" aria-label={pieLogos.ayuda}>
          <LogoNexo alto={16} />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia conCartel={false} />
        </div>
      </main>
    </div>
  );
}
