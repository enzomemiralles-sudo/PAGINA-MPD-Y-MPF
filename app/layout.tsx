import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { meta } from "@/content/legales";
import { MarcaProvider } from "@/components/marca/MarcaProvider";
import { CromoGlobal } from "@/components/marca/CromoGlobal";
import { PieLegal } from "@/components/landing/PieLegal";
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
    <html lang="es-AR" data-marca="dual" data-superficie="oscura" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <MarcaProvider>
          {children}
          <CromoGlobal pie={<PieLegal />} />
        </MarcaProvider>
      </body>
    </html>
  );
}
