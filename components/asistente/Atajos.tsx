"use client";

import { useEffect } from "react";

/**
 * Hace que «las más preguntadas» abran la pregunta del catálogo.
 *
 * Un enlace a #ficha-mpf-052 lleva hasta el <details> pero lo deja cerrado, y
 * quien tocó una pregunta espera ver la respuesta. Con un solo escuchador
 * delegado alcanza: las fichas y la lista las arma el servidor, así que esto
 * no vuelve cliente a nada más.
 */
export function Atajos() {
  useEffect(() => {
    function alTocar(e: MouseEvent) {
      const boton = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-abre]");
      if (!boton) return;
      const ficha = document.getElementById(boton.dataset.abre ?? "");
      if (!(ficha instanceof HTMLDetailsElement)) return;
      ficha.open = true;
      ficha.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    document.addEventListener("click", alTocar);
    return () => document.removeEventListener("click", alTocar);
  }, []);

  return null;
}
