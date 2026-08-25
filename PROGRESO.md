# PROGRESO

## Hecho

- Estructura del proyecto: `referencia/`, `material/`, `marca/`.
- `material/` completo y leído: `mpffaq.md` (87 entradas), `mpd-preguntas.md`,
  `mpd-inscripcion.md`.
- `PLAN.md` escrito. **Esperando visto bueno.**

## Bloqueado

- `referencia/landing-preview.html` — no está en el repo. Bloquea el porte de la
  landing (Bloque 1). Sin el archivo no se pueden extraer tokens, curvas ni
  duraciones sin reinterpretar el diseño, que es justo lo que el brief prohíbe.
- `marca/cinta-argentina.jpg` y `marca/nexo-logotipo-blanco.png` — no están en el
  repo. Llegaron como adjuntos del chat, no como archivos. Bloquean el hero.

## Pendiente

Todo el Bloque 1. Lo que puede arrancar sin el preview: proyecto en Vercel,
esquema de Supabase con RLS, fuentes, andamiaje de `content/`, test de contraste.

## Decisiones

Las cinco de `PLAN.md` §4, ninguna confirmada todavía:

1. `questions_public` como vista sin `respuesta_correcta` ni `explicacion`; la
   tabla cruda queda sin acceso público.
2. `attempt_answers.marcada` agregada al modelo, para el contrafáctico de
   resultados.
3. El simulador del MPF es la teórica (20 preguntas / 30 min). Las 3 consignas de
   la práctica van a biblioteca sin puntaje: corregir desarrollo está fuera de
   alcance.
4. El tipeo del MPD entra como `exams` con una `questions` de `tipo = 'tipeo'`.
   Motor de corrección propio, Bloque 4.
5. `concursos.estado` decide qué secciones de la landing existen. Con el MPD en
   `sin_convocatoria`, la sección de fechas no se renderiza y el alta a alertas
   es el llamado principal.

## Supuestos

Ninguno todavía. Los que aparezcan van como `// SUPUESTO:` en el código y se
listan acá.
