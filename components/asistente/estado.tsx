"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Ambito } from "@/lib/asistente/buscar";

/**
 * El estado compartido de la pestaña: qué concurso se eligió y qué se está
 * filtrando en el catálogo.
 *
 * Está en un contexto y no en props porque las tres piezas que lo usan —el
 * selector, los accesos rápidos y el buscador— están separadas por contenido
 * que se arma en el servidor. Pasarlo a mano obligaría a volver cliente todo
 * lo que hay en el medio, que es justamente el catálogo entero.
 */
type Estado = {
  ambito: Ambito;
  elegir: (a: Ambito) => void;
  /** Texto del buscador del catálogo (A-10). */
  filtro: string;
  filtrar: (t: string) => void;
  /** Categoría a la que apuntó un acceso rápido, o null si están todas. */
  categoria: string | null;
  porCategoria: (c: string | null) => void;
};

const Ctx = createContext<Estado | null>(null);

export function useAsistente(): Estado {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAsistente fuera de <Marco>");
  return ctx;
}

/**
 * A-02: el concurso elegido se aplica a toda la pantalla, no sólo al chat.
 *
 * Viaja como atributo en el envoltorio para que el catálogo —que se arma en
 * el servidor con los dos organismos— pueda esconder el que no corresponde
 * sin volver a pedirle nada al servidor y sin mandar el corpus al navegador.
 */
export function Marco({ children }: { children: React.ReactNode }) {
  const [ambito, setAmbito] = useState<Ambito>("mpd");
  const [filtro, setFiltro] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);

  const elegir = useCallback((a: Ambito) => setAmbito(a), []);
  const filtrar = useCallback((t: string) => setFiltro(t), []);
  const porCategoria = useCallback((c: string | null) => {
    setCategoria(c);
    setFiltro("");
  }, []);

  const valor = useMemo(
    () => ({ ambito, elegir, filtro, filtrar, categoria, porCategoria }),
    [ambito, elegir, filtro, filtrar, categoria, porCategoria],
  );

  return (
    <Ctx.Provider value={valor}>
      <div className="asis" data-org={ambito}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
