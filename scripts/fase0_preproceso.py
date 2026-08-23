#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FASE 0 - Preproceso del export de WhatsApp.

    python3 scripts/fase0_preproceso.py --organismo MPF
    python3 scripts/fase0_preproceso.py --organismo MPD

Hace, en este orden:
  1. Parsea el/los .txt exportados a mensajes estructurados.
  2. Anonimiza: autor -> autor_hash estable (A0001...), y borra del texto
     telefonos, DNI/CUIL, mails, menciones y nombres de participantes.
     El mapeo real queda en private/ (fuera del output y del control de version).
  3. Descarta ruido: mensajes de sistema, multimedia sin texto, cortesias,
     solo-emoji, duplicados inmediatos.
  4. Emite el reporte de la fase.

Salidas:
  data/<prefijo>/mensajes.jsonl      {id, timestamp, autor_hash, texto, es_respuesta_a}
  data/<prefijo>/descartados.jsonl   idem + motivo (auditoria)
  data/<prefijo>/reporte-fase0.json  metricas
  private/<prefijo>/mapeo-autores.json
"""
from __future__ import annotations

import argparse
import collections
import json
import os
import re
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wa_lib as W  # noqa: E402

VENTANA_RESPUESTA_MIN = 120
VENTANA_DUPLICADO_SEG = 300


def ts(valor: str) -> datetime:
    return datetime.fromisoformat(valor)


def main() -> None:
    ap = argparse.ArgumentParser(description="Fase 0: preproceso del export de WhatsApp")
    ap.add_argument("--organismo", required=True, help="codigo en scripts/organismos.json (MPF, MPD)")
    ap.add_argument("--sin-reporte-md", action="store_true")
    args = ap.parse_args()

    org = W.cargar_organismo(args.organismo)
    prefijo = org["prefijo_id"]
    rutas = W.archivos_entrada(org)

    # --- 1. parseo -------------------------------------------------------
    crudos: list[dict] = []
    por_archivo: dict[str, int] = {}
    for idx, ruta in enumerate(rutas, start=1):
        ms = W.parsear_export(ruta)
        por_archivo[os.path.basename(ruta)] = len(ms)
        for m in ms:
            m["fuente"] = idx
            m["archivo"] = os.path.basename(ruta)
        crudos.extend(ms)
    crudos.sort(key=lambda m: (m["timestamp"], m["fuente"]))

    if not crudos:
        raise SystemExit("No se parseo ningun mensaje: revisar el formato del export.")

    # --- 2. registro de autores + anonimizacion --------------------------
    anon = W.Anonimizador()
    for m in crudos:
        if m["autor"]:
            anon.clave(m["autor"])
    anon.compilar_nombres()

    # --- 3. clasificacion y limpieza -------------------------------------
    conservados: list[dict] = []
    descartados: list[dict] = []
    motivos = collections.Counter()
    ultimo_por_autor: dict[str, tuple[str, datetime]] = {}
    ultimos_textos: dict[str, tuple[str, datetime]] = {}
    con_respuesta = 0
    seq = collections.Counter()

    for m in crudos:
        autor_hash = anon.clave(m["autor"]) if m["autor"] else "SISTEMA"
        texto_crudo = m["texto"]
        motivo = W.clasificar_ruido(texto_crudo, m["autor"])

        # duplicado inmediato del mismo autor (doble envio)
        if motivo is None:
            previo = ultimos_textos.get(autor_hash)
            if previo and previo[0] == texto_crudo.strip():
                if (ts(m["timestamp"]) - previo[1]).total_seconds() <= VENTANA_DUPLICADO_SEG:
                    motivo = "duplicado"
            ultimos_textos[autor_hash] = (texto_crudo.strip(), ts(m["timestamp"]))

        seq[m["fuente"]] += 1
        mid = f"{prefijo}-g{m['fuente']}-{seq[m['fuente']]:05d}"

        # respuesta explicita: mencion a un participante o cita ">"
        es_respuesta_a = None
        if motivo is None:
            objetivo = None
            for men in W.RX_MENCION.finditer(W.limpiar_invisibles(texto_crudo)):
                cand = W.normalizar(men.group(1))
                destino = getattr(anon, "_destino", {}).get(cand)
                if destino and destino != autor_hash:
                    objetivo = destino
                    break
            if objetivo and objetivo in ultimo_por_autor:
                pid, pts = ultimo_por_autor[objetivo]
                if (ts(m["timestamp"]) - pts).total_seconds() <= VENTANA_RESPUESTA_MIN * 60:
                    es_respuesta_a = pid
                    con_respuesta += 1

        texto = anon.limpiar_texto(W.limpiar_para_salida(texto_crudo))
        texto = re.sub(r"\s+\n", "\n", texto).strip()

        fila = {
            "id": mid,
            "timestamp": m["timestamp"],
            "autor_hash": autor_hash,
            "texto": texto,
            "es_respuesta_a": es_respuesta_a,
        }
        if motivo is None and not texto:
            motivo = "vacio_tras_limpieza"
        if motivo is None:
            conservados.append(fila)
            ultimo_por_autor[autor_hash] = (mid, ts(m["timestamp"]))
        else:
            motivos[motivo] += 1
            descartados.append({**fila, "motivo": motivo})

    # --- 4. salidas ------------------------------------------------------
    dir_datos = os.path.join(W.RAIZ, "data", prefijo)
    dir_priv = os.path.join(W.RAIZ, "private", prefijo)
    W.escribir_jsonl(os.path.join(dir_datos, "mensajes.jsonl"), conservados)
    W.escribir_jsonl(os.path.join(dir_datos, "descartados.jsonl"), descartados)
    os.makedirs(dir_priv, exist_ok=True)
    with open(os.path.join(dir_priv, "mapeo-autores.json"), "w", encoding="utf-8") as fh:
        json.dump(anon.mapeo(), fh, ensure_ascii=False, indent=2)

    autores_utiles = collections.Counter(f["autor_hash"] for f in conservados)
    por_dia = collections.Counter(f["timestamp"][:10] for f in conservados)
    preguntas_aprox = sum(1 for f in conservados if "?" in f["texto"])

    reporte = {
        "organismo": org["codigo"],
        "nombre_organismo": org["nombre"],
        "generado": datetime.now().isoformat(timespec="seconds"),
        "archivos": por_archivo,
        "total_mensajes_parseados": len(crudos),
        "rango_fechas": {
            "desde": crudos[0]["timestamp"],
            "hasta": crudos[-1]["timestamp"],
            "dias": len({m["timestamp"][:10] for m in crudos}),
        },
        "conservados": len(conservados),
        "descartados": len(descartados),
        "descartados_por_motivo": dict(motivos.most_common()),
        "autores_totales": len(anon.por_autor),
        "autores_con_mensajes_utiles": len(autores_utiles),
        "top_autores": autores_utiles.most_common(15),
        "mensajes_por_dia": dict(sorted(por_dia.items())),
        "con_signo_pregunta": preguntas_aprox,
        "es_respuesta_a_resueltos": con_respuesta,
        "datos_personales_removidos": anon.contadores,
    }
    with open(os.path.join(dir_datos, "reporte-fase0.json"), "w", encoding="utf-8") as fh:
        json.dump(reporte, fh, ensure_ascii=False, indent=2)

    imprimir_reporte(reporte)


def imprimir_reporte(r: dict) -> None:
    ancho = 66
    print("=" * ancho)
    print(f"FASE 0 - PREPROCESO  |  {r['organismo']} ({r['nombre_organismo']})")
    print("=" * ancho)
    print("\nArchivos procesados")
    for a, n in r["archivos"].items():
        print(f"  - {a}: {n} mensajes")
    print(f"\nTotal de mensajes parseados : {r['total_mensajes_parseados']}")
    rf = r["rango_fechas"]
    print(f"Rango de fechas             : {rf['desde'][:16].replace('T',' ')}"
          f"  ->  {rf['hasta'][:16].replace('T',' ')}  ({rf['dias']} dias)")
    print(f"Conservados (utiles)        : {r['conservados']}"
          f"  ({r['conservados']*100//r['total_mensajes_parseados']}%)")
    print(f"Descartados como ruido      : {r['descartados']}")
    for motivo, n in r["descartados_por_motivo"].items():
        print(f"    {motivo:22s} {n:6d}")
    print(f"\nAutores en el export        : {r['autores_totales']}")
    print(f"Autores con mensajes utiles : {r['autores_con_mensajes_utiles']}")
    print(f"Mensajes con '?'            : {r['con_signo_pregunta']}  (candidatos a duda)")
    print(f"es_respuesta_a resueltos    : {r['es_respuesta_a_resueltos']}"
          f"  (el export de iOS no trae metadato de cita)")
    print("\nDatos personales removidos del texto")
    for k, v in r["datos_personales_removidos"].items():
        print(f"    {k:22s} {v:6d}")
    print("\nTop autores (por volumen util)")
    for h, n in r["top_autores"]:
        print(f"    {h}  {n:5d}")
    print("\nMensajes utiles por dia")
    for d, n in r["mensajes_por_dia"].items():
        barra = "#" * max(1, n // 20)
        print(f"    {d}  {n:5d}  {barra}")
    print()


if __name__ == "__main__":
    main()
