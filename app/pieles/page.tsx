import type { Metadata } from "next";
import { pieles as t } from "@/content/pieles";
import { MARCAS, DONDE, type Marca } from "@/lib/marca/tokens";

export const metadata: Metadata = { title: "Las dos pieles — control" };

/**
 * La página de control de pieles.
 *
 * Existe para mirar, no para navegar: pone las cuatro pieles una al lado de la
 * otra con las mismas piezas, y si un token queda mal se ve acá antes que en
 * una pantalla de verdad.
 *
 * Cada bloque declara su `data-marca` en un div, no en <html>. Es la misma
 * mecánica que usa el resto del sitio: los tokens no dependen de estar en la
 * raíz, así que una pantalla puede traer su piel puesta desde el servidor.
 *
 * La zona de corrección está a propósito: es donde el acento de marca queda
 * prohibido, y verlo en las cuatro pieles es la forma de comprobar que el
 * verde de «correcta» no se confunde nunca con el verde de Nexo.
 */
function Muestra({ marca }: { marca: Marca }) {
  const m = t.muestras;
  return (
    <section className="piel" data-marca={marca}>
      <header className="piel-cabeza">
        <span className="piel-marca mono">{marca}</span>
        <span className="piel-donde">{DONDE[marca]}</span>
      </header>

      <div className="piel-cuerpo">
        <div className="piel-bloque">
          <p className="piel-rotulo mono">{m.tipografia.titulo}</p>
          <p className="piel-titulo">{m.tipografia.texto}</p>
        </div>

        <div className="piel-bloque">
          <p className="piel-rotulo mono">{m.boton.titulo}</p>
          <div className="piel-botones">
            <span className="btn btn-p">{m.boton.principal}</span>
            <span className="btn btn-a">{m.boton.marca}</span>
            <span className="btn btn-s">{m.boton.secundario}</span>
          </div>
        </div>

        <div className="piel-bloque">
          <p className="piel-rotulo mono">{m.enlace.titulo}</p>
          <p className="piel-parrafo">
            {m.enlace.texto} <a href="#">{m.enlace.enlace}</a> {m.enlace.cola}
          </p>
        </div>

        <div className="piel-bloque">
          <p className="piel-rotulo mono">{m.tarjeta.titulo}</p>
          <div className="piel-tarjeta tarjeta-app">
            <span className="piel-tarjeta-rotulo mono">{m.tarjeta.rotulo}</span>
            <p className="piel-tarjeta-cabeza">{m.tarjeta.cabeza}</p>
            <p className="piel-parrafo">{m.tarjeta.cuerpo}</p>
          </div>
        </div>

        <div className="piel-bloque">
          <p className="piel-rotulo mono">{m.divisor.titulo}</p>
          <hr className="piel-divisor" />
        </div>

        {/* Zona de corrección: sin color de marca, por regla. */}
        <div className="piel-bloque">
          <p className="piel-rotulo mono">{m.respuestas.titulo}</p>
          <ul className="piel-opciones">
            <li className="piel-op">
              <span className="piel-op-clave mono">A</span>
              <span>{m.respuestas.sinResponder}</span>
            </li>
            <li className="piel-op" data-estado="correcta">
              <span className="piel-op-clave mono">B</span>
              <span>{m.respuestas.correcta}</span>
              <span className="piel-op-marca" aria-hidden="true">✓</span>
              <span className="sr-only">{m.respuestas.rotuloCorrecta}</span>
            </li>
            <li className="piel-op" data-estado="incorrecta">
              <span className="piel-op-clave mono">C</span>
              <span>{m.respuestas.incorrecta}</span>
              <span className="piel-op-marca" aria-hidden="true">✕</span>
              <span className="sr-only">{m.respuestas.rotuloIncorrecta}</span>
            </li>
          </ul>
          <p className="piel-nota">{m.respuestas.nota}</p>
        </div>
      </div>
    </section>
  );
}

export default function Pieles() {
  return (
    <main className="env app-cuerpo pieles">
      <header className="pieles-cabeza">
        <h1>{t.titulo}</h1>
        <p className="pieles-bajada">{t.bajada}</p>
        <p className="pieles-nota">{t.nota}</p>
      </header>

      <div className="pieles-grilla">
        {MARCAS.map((m) => (
          <Muestra key={m} marca={m} />
        ))}
      </div>
    </main>
  );
}
