import Link from "next/link";
import { GraduationCap, Bot, ClipboardList, BookOpen } from "lucide-react";
import { herramientasHome as t } from "@/content/app";

const ICONOS = {
  simulador: GraduationCap,
  asistente: Bot,
  guia: ClipboardList,
  insumos: BookOpen,
} as const;

/**
 * Las tres herramientas principales de la app, como tarjetas — no como texto
 * plano en el pie. Van justo debajo del bloque de retención, así son lo
 * primero que se ve después del saludo, no algo que hay que bajar a buscar.
 */
export function HerramientasHome() {
  return (
    <div className="herramientas-home">
      {t.items.map((h) => {
        const Icono = ICONOS[h.id];
        return (
          <Link key={h.destino} href={h.destino} className="herramienta-card">
            <Icono className="herramienta-icono" aria-hidden="true" />
            <span className="herramienta-titulo">{h.titulo}</span>
            <span className="herramienta-texto">{h.texto}</span>
          </Link>
        );
      })}
    </div>
  );
}
