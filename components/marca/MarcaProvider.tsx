"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MARCAS, type Marca } from "@/lib/marca/tokens";
import { ATRIBUTO_SERVIDOR } from "./AplicarPiel";

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
  // La ruta entra sólo como disparador: al navegar hay que volver a mirar
  // quién manda, porque la pantalla nueva puede traer piel propia o no.
  const ruta = usePathname() ?? "";

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

  // Donde la piel la fija el servidor —las pantallas con sesión, y las neutras
  // de ingreso— el proveedor se aparta. Lo sabe porque <AplicarPiel> deja su
  // marca en el <html>, no por una lista de rutas: así una pantalla nueva no
  // puede olvidarse de anotarse y quedar con la piel pisada.
  useEffect(() => {
    const html = document.documentElement;
    if (html.hasAttribute(ATRIBUTO_SERVIDOR)) return;
    html.setAttribute("data-marca", marca);
  }, [marca, ruta]);

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
