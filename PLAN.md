# PLAN — acoplar el brief a lo que ya está construido

Estado: **esperando tu visto bueno.** No toco código hasta que apruebes esto.

El brief está escrito para arrancar de cero y el proyecto va por la tanda 7,
con todo mergeado y en producción. Así que esto no es un plan de construcción:
es el diff entre lo que el brief pide y lo que hay, con el orden para cerrarlo.

Leídos completos: los dos previews de `referencia/`, `CAMBIOS.md`, los tres
archivos de `material/` y `content/legales/`.

---

## 1. Dónde estamos

Siete tandas cerradas y publicadas. 79 de 85 ítems de `CAMBIOS.md` tildados.
287 tests en verde.

| Ruta | Qué hay |
|---|---|
| `/` | Portada con hero, simulador, asistente, inscripción, números y cierre |
| `/simulador` | Cuatro instancias reales, cronómetro, corrección y resultados |
| `/asistente` | 115 entradas, tres estados de certeza, catálogo y buscador |
| `/inscripcion` | Guía del MPD en cuatro pasos, con las ocho trampas del trámite |
| `/revisar` | Herramienta de revisión de preguntas, con rol |
| Legales y contacto | Los tres textos completos, con formulario |

Lo que falta de `CAMBIOS.md` son dos ítems y ninguno depende de código:
**I-04** espera capturas y videos, **S-04** espera los dos ejemplos del práctico.

---

## 2. Lo que el brief ya encuentra hecho

No lo vuelvo a construir. Queda anotado para que se pueda auditar.

- **Un código, dos pieles.** `data-marca` en `<html>`, todo por variables CSS.
  Ningún componente pregunta por la marca.
- **Sin destello.** La piel se resuelve en el servidor y se escribe en `<html>`
  antes del primer pintado, con un script en el `<head>` (`pielInicial.ts`).
  No hay `useEffect` decidiendo color.
- **Test de contraste.** `tests/contraste.test.ts` recorre los pares
  texto/fondo de las seis combinaciones y falla por debajo de 4,5:1. 153 casos.
- **El asistente.** Los tres estados, el selector que filtra duro, y las
  contradicciones mostradas como contradicciones.
- **El simulador.** Duración, cantidad y puntajes salen de `exams`. El tiempo
  restante se calcula desde `iniciado_en` en el servidor. Las respuestas
  correctas no viajan al cliente: están cortadas por permiso de columna en la
  base, no por código. El puntaje en vivo, no la cantidad de aciertos.
- **Textos en `content/`**, secciones vacías que no se renderizan, ninguna
  pregunta publicada sin revisar, aviso de no oficialidad en todos los pies,
  consentimientos separados y sin tildar.
- **Movimiento.** Curvas `--sal` y `--suave`, `IntersectionObserver` al 15 %,
  una sola vez, y `prefers-reduced-motion` apagando todo.

---

## 3. Divergencias de tokens

Los previews mandan y no coinciden con `styles/tokens.css`. Además **los dos
previews no coinciden entre sí** en `--acento-texto`: la pública dice `#53B384`
y `#00B9AE`, la home de puerta dice `#7FD6A4` y `#2FD3C8`. El brief cita los de
la home, así que gana la home y la pública se actualiza.

| Token | Hoy | Previews | Nota |
|---|---|---|---|
| `--acento-texto` nexo | `#53b384` | `#7FD6A4` | Más claro, más contraste |
| `--acento-texto` na | `#00b9ae` | `#2FD3C8` | Ídem |
| `--acento-2` nexo | `#16a85b` verde | **`#F58220` naranja** | Es la regla de diferenciación: el naranja es sólo de Nexo |
| `--error` | `#E64D52` / `#B3261E` | `#E5484D` | |
| `--fondo` | `#08090A` compartido | `#04150D` nexo · `#03141F` na | El fondo pasa a ser de marca |
| `--fondo-bajo` | no existe | `#020B07` · `#010A11` | |
| `--glow-a` / `--glow-b` | no existen | por marca | Los halos de la home |
| `--tinta-alta` | no existe | `#101216` | |
| `--ancho-h` | `--ancho-titulo` 76 | 78 | Nombre y valor |
| `--ital` | `--ital-h2` | 1 nexo · 0 na | Nombre |

Y una que va a doler si no se arregla ahora: hoy el token se llama
**`--papel-débil`, con tilde**, y los previews lo escriben `--papel-debil`. Son
veinte usos. Si se porta CSS de los previews tal cual, no matchea y falla en
silencio. Se renombra en el mismo movimiento.

---

## 4. Lo que falta construir

Ordenado por lo que cuesta y lo que desbloquea.

**Fase A · la piel** (base de todo lo demás)
1. Actualizar `styles/tokens.css` y su espejo `lib/marca/tokens.ts` con los
   valores de arriba, y renombrar `--papel-débil`.
2. Extender el test de contraste a los pares nuevos, incluida la comprobación
   explícita de que `#059249` nunca pinta texto —da 4,6:1 y sólo alcanza para
   títulos y botones— y de que `#0059BA` nunca pinta texto.
3. `/pieles`: la página de control con las dos pieles sobre un botón, un
   enlace, una tarjeta, una opción correcta, una incorrecta y un divisor.

**Fase B · los cinco conflictos**
4. Prohibir `--acento` en la zona de respuestas del simulador, con un test que
   falle si aparece. Hoy no aparece, pero nada lo impide.
5. La corrección deja de comunicarse sólo por color: tilde o cruz más cambio
   de grosor de borde.
6. Encabezado en sesión con un solo logo, el de la agrupación del perfil, y el
   de la otra al pie en la línea de coorganización.
7. Los lemas arriba a la derecha.
8. El logotipo gigante del pie, con el nombre de la agrupación en la home de
   puerta y «INGRESO DEMOCRÁTICO» en la pública.

**Fase C · la home de puerta** — hecha
9. ✅ Portar `home-puerta-preview.html`: el bloque de retención —saludo, retomar
   donde quedaste, barras de progreso por tema— sobre datos reales del último
   intento, y la invitación al primer simulacro cuando no hay intento previo.
10. ✅ Las tres columnas: menú, recursos y sociales. El `[PENDIENTE]` no quedó
    en el mail de Nueva Abogacía —ése llegó con B-04— sino donde de verdad
    falta el dato: el grupo de WhatsApp y el canal de YouTube de las dos.
11. ✅ Conectar las fotos de perspectiva, con `next/image`, AVIF con respaldo
    WebP y `sizes` correcto.

**Fase D · la pestaña pública** — hecha
12. ✅ Portar el hero nuevo de `landing-preview.html`: la foto frontal
    reemplaza a la cinta. El preview cruza las dos capas por `data-marca` y no
    contempla `dual`, que es el estado en que está siempre la pestaña pública;
    ahí se muestran las dos partidas sobre el eje de simetría de la fachada.
13. ✅ Quitar la cinta argentina: `Cinta.tsx`, `CintaFondo.tsx` y su uso en
    `PantallaAuth`. Los tokens `--cinta-op` y `--cinta-img` ya no existían: se
    fueron con la reescritura de la fase A.

**Fase E · accesibilidad y datos**
14. Las opciones pasan a ser radios reales dentro de `fieldset` con `legend`.
    Hoy son botones con `aria-pressed`.
15. Perfil `otro` → piel neutra, como constante.
16. `theme-color`, favicon y los correos de Resend tomando la piel del perfil.
17. `/admin` para cargar preguntas pegando JSON. Hoy existe `/revisar`, que
    revisa lo cargado pero no carga.

---

## 5. Lo que el brief destraba

**El práctico del MPF son tres consignas, no diez.** `exams` carga 10 con un
supuesto anotado en la migración 0005. El corpus decía 3 y yo lo había dejado
marcado en B-06 para confirmar; el brief lo confirma. Se arregla con un
`update`, sin tocar código:

```sql
update exams set cantidad_preguntas = 3
where instancia = 'practico' and modalidad = 'investigacion';
```

**La ventana total del MPF es de una hora.** El corpus registraba dos versiones
incompatibles —45 minutos del correo de citación y una hora de plataforma— y el
asistente las muestra como contradictorias. Con el brief, la de una hora es la
buena. Queda decidir si el asistente sigue mostrando la contradicción o pasa a
responder con el dato confirmado.

Los demás datos de examen del brief ya coinciden con lo cargado.

---

## 6. Lo que necesito que decidas

1. **La piel de la sesión es oscura.** Hoy todo lo que está detrás del login usa
   superficie clara. El brief da `--fondo` oscuro por marca, y los previews son
   oscuros. Eso repinta simulador, asistente, inscripción, perfil y resultados:
   es el cambio más grande de la lista y toca todo el CSS de la app. Lo doy por
   hecho salvo que me digas lo contrario.
2. **Los recortes de celular no existen.** El brief los pide; los previews
   resuelven el móvil moviendo el encuadre —`background-position` pasa a
   `70% 58%` por debajo de 820 px— y sólo traen cuatro fotos. Propongo seguir a
   los previews, que el propio brief declara fuente de verdad. Si querés los
   ocho archivos, hay que producir los recortes.
3. **«La franja de estado de concursos» quedó cancelada.** Quiero confirmar que
   eso no incluye la franja de estado del trámite de `/inscripcion`, que lee
   `concursos.estado` y hoy avisa que no hay inscripción abierta. Me parece que
   la cancelada es otra, la de la portada, pero no lo voy a asumir.
4. **`CAMBIOS.md` ya está ejecutado.** El brief dice que son 60 ítems y que no
   ejecute nada. Son 85 y están hechos salvo dos. Doy por vigente el estado
   actual del archivo, no la instrucción de no ejecutar.

---

## 7. Riesgos

- La fase A cambia colores en todo el sitio. El test de contraste cubre los
  pares, pero no cubre que el resultado se vea bien: eso lo verifico en el
  navegador a 375 y 1440 antes de tildar nada.
- La fase D toca la portada, que es lo único que ve alguien sin cuenta. Va con
  su propio commit y su propia verificación.
- El brief pide Lighthouse mobile ≥ 90 y LCP < 2,5 s en 4G. Puedo medir el
  peso y el orden de carga, pero **no puedo correr Lighthouse ni simular 4G
  desde acá**: el navegador de este entorno no tiene salida a internet. Esa
  medición la vas a tener que hacer vos sobre el deploy, o la dejamos como
  criterio verificado a ojo.
