"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

export function MarcaProvider({ children }: { children: React.ReactNode }) {
  const [marca, setMarca] = useState<Marca>("dual");

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
    document.documentElement.setAttribute("data-marca", marca);
  }, [marca]);

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
