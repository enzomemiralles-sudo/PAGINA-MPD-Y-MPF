"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Organismo } from "@/lib/inscripcion/tipos";

/**
 * Qué concurso se está mirando.
 *
 * Igual que en el asistente: viaja como atributo en el envoltorio para que las
 * guías —que se arman en el servidor— puedan esconder la que no corresponde
 * sin volver cliente a nada del contenido.
 */
const Ctx = createContext<{ org: Organismo; elegir: (o: Organismo) => void } | null>(null);

export function useInscripcion() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useInscripcion fuera de <Marco>");
  return ctx;
}

export function Marco({
  inicial,
  children,
}: {
  inicial: Organismo;
  children: React.ReactNode;
}) {
  const [org, setOrg] = useState<Organismo>(inicial);
  const elegir = useCallback((o: Organismo) => setOrg(o), []);
  const valor = useMemo(() => ({ org, elegir }), [org, elegir]);

  return (
    <Ctx.Provider value={valor}>
      <div className="ins" data-org={org}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
