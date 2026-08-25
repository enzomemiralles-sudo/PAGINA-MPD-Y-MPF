# material/

El contenido que la página publica. Cada archivo tiene una procedencia distinta
y se actualiza distinto, así que conviene tenerlo anotado.

| Archivo | Qué es | De dónde sale |
|---|---|---|
| `mpffaq.md` | 87 preguntas frecuentes del MPF | generado — copia de `output/mpf-faq.md` |
| `mpd-preguntas.md` | Manual de dudas frecuentes del MPD | Drive: *6 · Manual de dudas frecuentes (FAQ)* |
| `mpd-inscripcion.md` | Guía de inscripción y examen del MPD | Drive: *NEXO - Guia de como inscribirte y rendir el examen de ingreso al MPD* |

## mpffaq.md se regenera, no se edita

Sale del pipeline de este repo (fase 3). Si hay que corregir una respuesta, se
corrige en `curacion/mpf-*.json` y se vuelve a correr la fase, no se toca esta
copia:

```bash
python3 scripts/fase3_entregables.py --organismo MPF
cp output/mpf-faq.md material/mpffaq.md
```

Es una copia y no un symlink a propósito: `material/` es la foto del contenido
que se publicó, y tiene que poder quedar fija aunque el pipeline siga corriendo.

## Los dos del MPD sí se editan a mano

No hay pipeline detrás: son documentos escritos por Nexo. Acá están exportados a
markdown desde los Google Docs originales, que siguen siendo la fuente de verdad
del equipo. Dos cosas a tener en cuenta:

- Ambos tienen **huecos marcados** (`[HUECO — CONVOCATORIA]`, `[AC — a confirmar]`)
  con datos que dependen de la convocatoria vigente. Al 25/8/2026 no hay
  convocatoria del MPD abierta. Esos huecos no se completan a ojo.
- Si alguien edita el Doc en Drive, este archivo queda viejo. La copia de acá es
  la que se publica, así que el cambio hay que traerlo.
