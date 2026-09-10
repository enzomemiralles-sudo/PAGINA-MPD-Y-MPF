import { AplicarPiel } from "@/components/marca/AplicarPiel";
import { LogoNexo } from "@/components/marca/LogoNexo";
import { Tarjeta } from "@/components/marca/Tarjeta";
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
    // aunque el script del head no haya corrido. El marco pinta el fondo y el
    // contenido va arriba.
    <div className="auth-marco" data-marca="neutro">
      <AplicarPiel marca="neutro" />
      <main className="auth-pantalla">
        <Tarjeta className={`auth-caja${ancha ? " perfil-caja" : ""}`}>{children}</Tarjeta>

        {/* Los dos logotipos, un 30% más grandes que antes: 16→21px el de
            Nexo y 26→34px el de Nueva Abogacía. Los altos van por prop y no
            por CSS porque los dos componentes los escriben inline —uno como
            `--logo-alto`, el otro como `height`— y el estilo inline le gana a
            cualquier regla de la hoja. */}
        <div className="auth-firma" aria-label={pieLogos.ayuda}>
          <LogoNexo alto={21} />
          <span className="sep-v" aria-hidden="true" />
          <LogoNuevaAbogacia alto={34} />
        </div>
      </main>
    </div>
  );
}
