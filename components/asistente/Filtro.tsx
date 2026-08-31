"use client";

import { useEffect, useId, useRef, useState } from "react";
import { frecuentes as t } from "@/content/asistente";
import { normalizar } from "@/lib/asistente/texto";
import { useAsistente } from "@/components/asistente/estado";

/**
 * El buscador del catálogo (A-10).
 *
 * Filtra el HTML que ya está en la página en vez de preguntarle al servidor:
 * no hay espera, no hay estado de carga y funciona escribiendo. Es a propósito
 * distinto de la caja de preguntas —esa entiende una pregunta entera y devuelve
 * una respuesta con su respaldo; esto acota una lista— y por eso busca por
 * pedazo de palabra, que es lo que uno espera de un filtro.
 *
 * Toca el DOM directamente porque las fichas las armó el servidor y React no
 * las vuelve a dibujar: el `children` del catálogo es siempre el mismo árbol.
 * La alternativa era mandar las 115 entradas también como datos, además del
 * HTML, para poder esconderlas desde React.
 */
export function Filtro() {
  const { filtro, filtrar, categoria, porCategoria, ambito } = useAsistente();
  const id = useId();
  const caja = useRef<HTMLDivElement>(null);
  const [cuantas, setCuantas] = useState<number | null>(null);

  useEffect(() => {
    const raiz = caja.current?.closest(".asis-catalogo");
    if (!raiz) return;

    const buscadas = normalizar(filtro).split(" ").filter(Boolean);
    let visibles = 0;

    for (const org of raiz.querySelectorAll<HTMLElement>(".asis-cat-org")) {
      const suyo = ambito === "ambos" || org.dataset.para === ambito;

      for (const ficha of org.querySelectorAll<HTMLElement>(".asis-ficha")) {
        const claves = ficha.dataset.claves ?? "";
        const entra =
          buscadas.every((p) => claves.includes(p)) &&
          (categoria === null || ficha.dataset.categoria === categoria);
        ficha.hidden = !entra;
        if (entra && suyo) visibles += 1;
      }

      // Un título de categoría sin ninguna pregunta debajo es ruido.
      for (const grupo of org.querySelectorAll<HTMLElement>(".asis-cat-grupo")) {
        const quedaAlguna = grupo.querySelector<HTMLElement>(".asis-ficha:not([hidden])");
        grupo.hidden = quedaAlguna === null;
      }
      org.dataset.vacio = String(org.querySelector(".asis-cat-grupo:not([hidden])") === null);
    }

    const vacio = raiz.querySelector<HTMLElement>(".asis-cat-vacio");
    if (vacio) vacio.hidden = visibles > 0;

    setCuantas(buscadas.length > 0 || categoria !== null ? visibles : null);
  }, [filtro, categoria, ambito]);

  const limpiar = () => {
    filtrar("");
    porCategoria(null);
  };

  return (
    <div className="asis-filtro" ref={caja}>
      <label className="asis-rotulo" htmlFor={`${id}-f`}>
        {t.buscador.rotulo}
      </label>
      <div className="asis-filtro-linea">
        <input
          id={`${id}-f`}
          type="search"
          value={filtro}
          placeholder={t.buscador.marcador}
          onChange={(e) => filtrar(e.target.value)}
        />
        {filtro !== "" || categoria !== null ? (
          <button type="button" className="btn btn-s" onClick={limpiar}>
            {t.buscador.limpiar}
          </button>
        ) : null}
      </div>

      <p className="asis-filtro-cuenta" aria-live="polite">
        {categoria !== null ? <span className="asis-filtro-cat">{categoria}</span> : null}
        {cuantas !== null ? t.buscador.resultados(cuantas) : null}
      </p>
    </div>
  );
}
