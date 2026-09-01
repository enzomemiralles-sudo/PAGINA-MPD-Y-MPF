import { AplicarPiel } from "@/components/marca/AplicarPiel";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { Tarjeta } from "@/components/marca/Tarjeta";
import { CintaFondo } from "@/components/marca/CintaFondo";
import { LogoNuevaAbogacia } from "@/components/marca/LogoNuevaAbogacia";
import { pieLogos } from "@/content/auth";

/**
 * Envoltorio de las pantallas de ingreso. Neutro a propósito: antes de elegir
 * perfil el sitio todavía no tiene dueño.
 *
 * La piel se declara en dos lugares y los dos hacen falta. <AplicarPiel> la
 * fija en el <html>, que es lo que pinta el fondo de la página y lo que hace
 * que <MarcaProvider> se aparte en vez de pisarla con la dual. El data-marca
 * del marco es el respaldo: si el script del head no corrió, la tarjeta igual
 * se ve neutra en lugar de heredar la puerta anterior.
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
    <div className="auth-marco" data-marca="neutro">
      <AplicarPiel marca="neutro" />
      <CintaFondo />
      <main className="auth-pantalla">
        <Tarjeta className={`auth-caja${ancha ? " perfil-caja" : ""}`}>{children}</Tarjeta>

        <div className="auth-firma" aria-label={pieLogos.ayuda}>
          <LogoNexo alto={16} />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia />
        </div>
      </main>
    </div>
  );
}
