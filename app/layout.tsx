import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
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
    <html lang="es-AR" data-marca="dual" className={`${archivo.variable} ${mono.variable}`}>
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