# Extracción de FAQs — Ingreso Democrático (MPF / MPD)

Pipeline que convierte un export de WhatsApp de la mesa de ayuda del examen de
ingreso democrático en una base de preguntas frecuentes lista para publicar.

Todo está **parametrizado por organismo**: el mismo código corre para el MPF y
para el MPD cambiando únicamente `--organismo`.

## Uso

```bash
# 1. Dejar el/los .txt exportados en input/<prefijo>/
#    (input/ está en .gitignore: son datos personales sin anonimizar)
cp "WhatsApp Chat - ....txt" input/mpd/

# 2. Fase 0 — preproceso, anonimización y filtrado de ruido
python3 scripts/fase0_preproceso.py --organismo MPD
```

Los organismos se definen en `scripts/organismos.json`. Para agregar uno nuevo
alcanza con sumar una entrada con su `prefijo_id`, `entradas` y `convocatoria`.

## Estructura

```
input/<prefijo>/      exports crudos            (gitignored, con datos personales)
private/<prefijo>/    mapeo autor -> autor_hash (gitignored)
data/<prefijo>/       intermedios anonimizados
output/               entregables publicables
scripts/              el pipeline
```

## Fases

| Fase | Script | Salida |
|---|---|---|
| 0 — preproceso | `scripts/fase0_preproceso.py` | `data/<prefijo>/mensajes.jsonl`, `descartados.jsonl`, `reporte-fase0.json` |

## Anonimización

- Cada autor recibe un identificador estable `A0001`, `A0002`… asignado por
  orden de aparición. El mapeo real queda en `private/` y nunca sale al output.
- Del texto se borran mails, teléfonos, DNI/CUIL, menciones `@` y los nombres de
  participantes escritos dentro de los mensajes (se reemplazan por su hash).
- `scripts/palabras_comunes_es.txt` evita que un alias de WhatsApp que coincide
  con una palabra corriente del castellano (por ejemplo "solo", "alguna",
  "abril") destroce el texto al anonimizar.
- Las URLs se preservan: son material de estudio y sitios oficiales.

## Notas sobre el formato

El parser acepta el formato de iOS (`[14/12/25, 14:34:58] Autor: texto`) y el de
Android (`14/12/25, 14:34 - Autor: texto`), con día y mes de uno o dos dígitos y
horarios de 12 o 24 horas. Los exports de iOS **no incluyen el metadato de cita**,
así que `es_respuesta_a` solo se completa cuando hay una mención explícita a otro
participante; el resto de los hilos se reconstruye por proximidad temporal en la
fase de clustering.
