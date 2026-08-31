# Textos del práctico de tipeo

Los textos que el simulador da para copiar en la instancia de tipeo del MPD.

**Ninguno es oficial.** El examen real no publica sus textos, así que estos
están escritos para esto, con el registro y el largo de lo que se usa en un
examen administrativo: acentos, puntuación, punto y coma, mayúsculas, números
y nombres de normas, que es exactamente lo que la corrección mira.

Cuando llegue un texto real —o la metodología completa, que es el pendiente
B-02— se reemplaza `textos.json` y se vuelve a correr:

    python3 scripts/preguntas_a_sql.py

y el `.sql` que sale se aplica a la base. No hay que tocar código: el largo
del texto es el largo del texto, y el resto de los parámetros (tiempo,
descuento, mínimo) ya salen de la fila de `exams`.

## Qué tiene que cumplir un texto nuevo

- Registro administrativo o jurídico, que es el del examen.
- Acentuación completa, incluidas mayúsculas acentuadas.
- Punto y coma, comillas, paréntesis y números con puntos de mil: son los
  caracteres donde más se pierde puntaje.
- Sin negritas ni cursivas por ahora: la comparación de formato todavía no
  está implementada, y prometerla sería mentir. Ver PLAN-SIMULADOR.md §6.
