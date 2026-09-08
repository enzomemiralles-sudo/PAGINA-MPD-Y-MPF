import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Outfit, Poppins } from "next/font/google";
import { meta } from "@/content/legales";
import { MarcaProvider } from "@/components/marca/MarcaProvider";
import { CromoGlobal } from "@/components/marca/CromoGlobal";
import { PieLegal } from "@/components/landing/PieLegal";
import { PIEL_INICIAL } from "@/components/marca/pielInicial";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--fuente-archivo",
});

/**
 * Poppins, para el menú de Nueva Abogacía.
 *
 * Va con pesos declarados y no con ejes: Poppins no es variable, así que el
 * `font-variation-settings: "wght"` que usa el resto del sitio no la mueve.
 * Los cuatro pesos son los que el menú realmente pide —400 el cuerpo, 500 los
 * rótulos, 600 títulos y botones, 700 el saludo—; pedir más es descargar
 * archivos que nadie ve.
 */
/**
 * Outfit, para la puerta de Nexo.
 *
 * Es la tipografía de nexoderecho.com.ar, así que la plataforma y el sitio de
 * la agrupación dejan de ser dos cosas distintas.
 *
 * Va sin `weight`: Outfit es variable en el eje de peso, así que el
 * `font-variation-settings: "wght"` que usa todo el sistema del sitio la
 * mueve sola y no hay que traducir nada. Lo que no tiene es eje de ancho ni
 * itálica —de ahí que la condensada en bastardilla de los títulos de Nexo se
 * pierda—, que es la contrapartida de acercarse al sitio real.
 */
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-outfit",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--fuente-poppins",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--fuente-mono",
});

export const metadata: Metadata = {
  title: meta.titulo,
  description: meta.descripcion,
};

export const viewport: Viewport = {
  themeColor: "#08090A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" data-marca="dual" className={`${archivo.variable} ${mono.variable} ${poppins.variable} ${outfit.variable}`}>
      {/* Antes del <body>, adentro del <head>: corre antes del primer
          pintado, así no hay salto de oscuro a claro al entrar al ingreso.
          Un <script> como hijo directo de <html> (sin <head> de por medio)
          no es HTML válido, y React lo marca como error de hidratación —de
          ahí que a veces la pantalla quedara sin responder a los clics: la
          hidratación se cortaba antes de conectar los botones. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: PIEL_INICIAL }} />
      </head>
      <body>
        <MarcaProvider>
          {children}
          <CromoGlobal pie={<PieLegal />} />
        </MarcaProvider>
      </body>
    </html>
  );
}