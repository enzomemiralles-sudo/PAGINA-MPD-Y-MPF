"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MARCAS, type Marca } from "@/lib/marca/tokens";

const CLAVE = "nexo-na:puerta";

type Ctx = { marca: Marca; cambiar: (m: Marca) => void };
const MarcaCtx = createContext<Ctx>({ marca: "dual", cambiar: () => {} });

export function useMarca() {
  return useContext(MarcaCtx);
}

function esMarca(v: string | null): v is Marca {
  return v !== null && (MARCAS as readonly string[]).includes(v);
}

/**
 * Rutas donde la piel la fija el servidor con <AplicarPiel>: o porque son
 * neutras por diseño, o porque la marca sale del perfil guardado. Acá el
 * proveedor no toca nada — si lo hiciera, pisaría el valor bueno.
 */
const PIEL_DEL_SERVIDOR = ["/ingresar", "/crear-perfil", "/elegir-perfil", "/app", "/mi-perfil"];

export function MarcaProvider({ children }: { children: React.ReactNode }) {
  const [marca, setMarca] = useState<Marca>("dual");
  const ruta = usePathname() ?? "";
  const laFijaElServidor = PIEL_DEL_SERVIDOR.some((r) => ruta.startsWith(r));

  // El valor guardado se lee después del primer render: el HTML del servidor
  // sale siempre en "dual" y así no hay desajuste de hidratación.
  useEffect(() => {
    try {
      const guardada = window.localStorage.getItem(CLAVE);
      if (esMarca(guardada)) setMarca(guardada);
    } catch {
      // Modo privado o storage bloqueado: se queda en dual.
    }
  }, []);

  useEffect(() => {
    if (laFijaElServidor) return;
    document.documentElement.setAttribute("data-marca", marca);
    // Lo público es siempre oscuro: la landing se diseñó así.
    document.documentElement.setAttribute("data-superficie", "oscura");
  }, [marca, laFijaElServidor]);

  const cambiar = useCallback((m: Marca) => {
    setMarca(m);
    try {
      window.localStorage.setItem(CLAVE, m);
    } catch {
      // Sin persistencia, pero la puerta igual cambia en esta sesión.
    }
  }, []);

  return <MarcaCtx.Provider value={{ marca, cambiar }}>{children}</MarcaCtx.Provider>;
}
