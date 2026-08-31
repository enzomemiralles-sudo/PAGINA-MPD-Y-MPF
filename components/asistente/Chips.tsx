"use client";

import Link from "next/link";
import { categorias as t } from "@/content/asistente";
import { useAsistente } from "@/components/asistente/estado";

/**
 * A-03. Los accesos rápidos.
 *
 * Dos de ellos acotan el catálogo a una categoría en vez de llevarte a otra
 * parte: son las dos categorías que el corpus ya trae —contenidos y
 * modalidad—, así que el mapeo es dato del material y no un reparto hecho a
 * mano. Los demás son enlaces de verdad.
 *
 * Con el JavaScript todavía cargando, los que filtran igual llevan al
 * catálogo completo: se ve todo en vez de no pasar nada.
 */
const FILTRAN: Record<string, string> = {
  "#contenidos": "Temario y material de estudio",
  "#modalidad": "Formato y modalidad del examen",
};

export function Chips() {
  const { porCategoria } = useAsistente();

  return (
    <nav className="asis-chips" aria-label={t.rotulo}>
      {t.items.map((c) => {
        const categoria = FILTRAN[c.destino];

        if (categoria) {
          return (
            <a
              key={c.destino}
              className="asis-chip"
              href="#frecuentes"
              onClick={() => porCategoria(categoria)}
            >
              {c.texto}
            </a>
          );
        }

        if (c.destino.startsWith("/")) {
          return (
            <Link key={c.destino} className="asis-chip" href={c.destino}>
              {c.texto}
            </Link>
          );
        }

        return (
          <a
            key={c.destino}
            className="asis-chip"
            href={c.destino}
            onClick={() => porCategoria(null)}
          >
            {c.texto}
          </a>
        );
      })}
    </nav>
  );
}
