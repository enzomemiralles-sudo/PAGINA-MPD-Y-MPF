"use client";

import { useEffect } from "react";

/**
 * El ícono de la pestaña del navegador, uno por agrupación.
 *
 * `app/icon.svg` —la balanza sobre el papel— sigue siendo el de la plataforma
 * y es el que se ve en la portada pública y en el ingreso: ahí todavía no hay
 * dueño, y poner el logotipo de una de las dos sería elegir por la persona.
 * Con sesión iniciada sí hay dueño, y la pestaña lo dice.
 *
 * El de Nexo es la «o» de su logotipo —el círculo con la balanza— recortada y
 * puesta sobre el verde de la marca: el logotipo entero es una palabra ancha y
 * a 16 píxeles no se lee ninguna letra. El de Nueva Abogacía es su logotipo tal
 * cual, que ya es un disco.
 */
const ICONOS: Record<string, string> = {
  nexo: "/logos/nexo-icono.png",
  na: "/logos/nueva-abogacia.png",
};

/**
 * Mira `data-marca` en el <html> y cambia el ícono cuando cambia.
 *
 * Va con un observador y no colgado de la marca que tenga React, porque la
 * marca se fija desde tres lugares distintos —el script del <head> en la carga
 * inicial, <AplicarPiel> en las navegaciones con sesión y <MarcaProvider> en
 * la portada— y los tres terminan escribiendo ese mismo atributo. Escuchándolo
 * a él, esto anda para los tres sin enterarse de ninguno.
 *
 * El ícono no se cambia editando el `href` del <link> que ya está: varios
 * navegadores ignoran esa mutación y siguen mostrando el ícono viejo. Lo que
 * sí toman es que el nodo desaparezca y aparezca otro, así que los de Next se
 * sacan del <head> mientras hay uno de agrupación y se devuelven a su lugar
 * cuando se vuelve a una pantalla sin dueño.
 */
export function IconoDeMarca() {
  useEffect(() => {
    const html = document.documentElement;

    // Los <link> que puso Next a partir de app/icon.svg, con su lugar exacto
    // en el <head> para poder devolverlos donde estaban.
    const deLaPlataforma = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')].map(
      (nodo) => ({ nodo, padre: nodo.parentNode, siguiente: nodo.nextSibling }),
    );
    const propios: HTMLLinkElement[] = [];

    const aplicar = () => {
      const icono = ICONOS[html.getAttribute("data-marca") ?? ""];

      // Lo puesto por este componente se descarta siempre: si la marca cambió,
      // el ícono anterior ya no corresponde.
      for (const viejo of propios.splice(0)) viejo.remove();

      if (icono) {
        for (const { nodo } of deLaPlataforma) nodo.remove();
        const nuevo = document.createElement("link");
        nuevo.rel = "icon";
        nuevo.type = "image/png";
        nuevo.href = icono;
        document.head.appendChild(nuevo);
        propios.push(nuevo);
        return;
      }

      for (const { nodo, padre, siguiente } of deLaPlataforma) {
        if (!nodo.isConnected && padre) padre.insertBefore(nodo, siguiente);
      }
    };

    aplicar();
    const observador = new MutationObserver(aplicar);
    observador.observe(html, { attributes: true, attributeFilter: ["data-marca"] });

    return () => {
      observador.disconnect();
      for (const viejo of propios.splice(0)) viejo.remove();
      for (const { nodo, padre, siguiente } of deLaPlataforma) {
        if (!nodo.isConnected && padre) padre.insertBefore(nodo, siguiente);
      }
    };
  }, []);

  return null;
}
