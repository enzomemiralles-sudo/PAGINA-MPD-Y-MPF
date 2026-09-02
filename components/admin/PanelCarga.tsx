"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { admin as t, EJEMPLO } from "@/content/admin";
import { cargarPreguntas, type ResultadoCarga } from "@/lib/acciones/admin";

/**
 * El panel de carga.
 *
 * Un textarea y un botón, a propósito. La alternativa —un formulario campo
 * por campo— obliga a cargar de a una y a mano; con JSON se pega un lote
 * entero, y se lo puede armar con un modelo a partir del PDF del examen.
 *
 * Los errores se muestran completos y con la ruta adentro del JSON
 * («preguntas.3.respuesta»), que es lo único que sirve cuando el lote tiene
 * cien preguntas y una está mal.
 */
export function PanelCarga() {
  const [json, setJson] = useState("");
  const [r, setR] = useState<ResultadoCarga | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [cargando, empezar] = useTransition();

  function cargar() {
    if (json.trim() === "") {
      setR({ ok: false, motivo: "json", detalle: t.errores.vacio, problemas: [] });
      return;
    }
    setR(null);
    empezar(async () => setR(await cargarPreguntas({ json })));
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(EJEMPLO);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles el ejemplo igual está a la vista.
    }
  }

  return (
    <div className="adm">
      <p className="adm-aviso">{t.aviso}</p>

      <div className="adm-campo">
        <label className="adm-et" htmlFor="adm-json">
          {t.etiquetaJson}
        </label>
        <textarea
          id="adm-json"
          className="adm-area mono"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder={t.marcador}
          spellCheck={false}
          rows={16}
        />
      </div>

      <div className="adm-botones">
        <button type="button" className="btn btn-a" onClick={cargar} disabled={cargando}>
          {cargando ? t.cargando : t.cargar}
        </button>
        <button
          type="button"
          className="btn btn-s"
          onClick={() => {
            setJson("");
            setR(null);
          }}
          disabled={cargando || json === ""}
        >
          {t.limpiar}
        </button>
      </div>

      {r?.ok ? (
        <div className="adm-bien" role="status">
          <p>
            <b>
              {r.cargadas > 0
                ? t.resultado.ok(r.cargadas, r.examen)
                : t.resultado.ninguna(r.examen)}
            </b>
          </p>
          {r.repetidas > 0 ? <p>{t.resultado.repetidas(r.repetidas)}</p> : null}
          {r.cargadas > 0 ? (
            <p>
              {t.resultado.sinRevisar}{" "}
              <Link href="/revisar">{t.irARevisar}</Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {r && !r.ok ? (
        <div className="adm-mal" role="alert">
          <p>
            <b>{t.errores.titulo}.</b> {r.detalle}
          </p>
          {r.problemas.length > 0 ? (
            <>
              <p className="adm-mal-rotulo">{t.errores.problemas}</p>
              <ul className="adm-problemas">
                {r.problemas.map((p, i) => (
                  <li key={`${p.donde}-${i}`}>
                    <code className="mono">{p.donde}</code> {p.que}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}

      <section className="adm-formato">
        <h2 className="adm-formato-titulo">{t.formato.titulo}</h2>
        <p className="adm-formato-bajada">{t.formato.bajada}</p>

        <dl className="adm-campos">
          {t.campos.map((c) => (
            <div key={c.campo}>
              <dt className="mono">{c.campo}</dt>
              <dd>{c.que}</dd>
            </div>
          ))}
        </dl>

        <div className="adm-ejemplo">
          <button type="button" className="btn btn-s" onClick={copiar}>
            {copiado ? t.formato.copiado : t.formato.copiar}
          </button>
          <pre className="mono">{EJEMPLO}</pre>
        </div>
      </section>
    </div>
  );
}
