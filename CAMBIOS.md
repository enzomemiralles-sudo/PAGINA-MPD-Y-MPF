# CAMBIOS PENDIENTES
### Archivo de control. Claude Code tilda acá a medida que avanza. Nada se da por hecho si no está tildado.

**Regla:** ningún ítem se marca `[x]` sin haberlo visto funcionando en el navegador, en 375px y en 1440px.

---

## TANDA 1 · Limpieza de la pestaña de muestra
> Todo esto es sacar y reemplazar. No requiere diseño nuevo. Debería salir en una sola sesión.

- [x] **M-01** Sacar la barra flotante inferior de puertas (Ambas / Nexo / Nueva Abogacía / "Puerta"). El conmutador de marca desaparece de la interfaz; el sistema de pieles queda en el código pero no se expone al usuario.
- [x] **M-02** Sacar la etiqueta "provisorio" al lado del logo de Nueva Abogacía. El logo actual es el definitivo.
- [x] **M-03** El logotipo de Nexo del encabezado va en **verde Nexo `#059249`**, no en blanco.
- [x] **M-04** Titular nuevo: **"Todo lo que necesitás para preparar tu ingreso al Ministerio Público"**. El efecto de gradiente animado se mantiene solo sobre "Ministerio Público".
- [x] **M-05** El titular tiene que quedar **visualmente equilibrado**: los renglones de largo parejo, sin líneas huérfanas de una sola palabra. Usar `text-wrap: balance` y ajustar los saltos manualmente si hace falta.
- [x] **M-06** Bajada nueva: **"Prepará tu examen con simuladores de exámenes, un asistente para responder todas tus dudas, la normativa ordenada y todo lo que necesitás saber para la inscripción en un solo lugar."**
- [x] **M-07** Sacar el botón "Ver los simulacros". Queda solo "Empezar gratis".
- [x] **M-08** "Empezar gratis" redirige a `/crear-perfil`.
- [x] **M-09** Sacar la línea "Sin costo · sin publicidad · Nexo Derecho + Nueva Abogacía".
- [x] **M-10** Sacar **toda** la tarjeta de la pregunta real ("La autonomía funcional y autarquía financiera…"), incluida su lógica de respuesta.
- [x] **M-11** Sacar **toda** la franja de estado de concursos (MPD sin convocatoria / MPF examen disponible).
- [x] **M-12** Sacar la sección "El puntaje del MPD castiga el error" y su tarjeta "Cómo se evalúa". El contenido no se pierde: se reformula dentro de la pestaña Simulador (ver S-14).
- [x] **M-13** Sacar la sección "Cada respuesta, con la norma al lado".
- [x] **M-14** Sacar del pie el botón de Instagram y el de WhatsApp.

---

## TANDA 2 · Flujo de ingreso y navegación
> Cambia el recorrido del usuario. Se hace después de la limpieza para no tocar dos veces los mismos archivos.

**Recorrido definitivo:**
`/` pestaña de muestra (pública, muestra las herramientas) → botón "Empezar gratis" → `/crear-perfil` → al terminar, **directo a la pestaña principal ya personalizada**.

- [ ] **F-01** Al completar el perfil, redirigir **directo a la pestaña principal**. Eliminar la pantalla intermedia de "Bienvenido, este es tu perfil".
- [ ] **F-02** "Mi perfil" pasa al **encabezado, siempre visible**, en todas las pantallas con sesión iniciada.
- [ ] **F-03** La pestaña de muestra es pública y no cambia según el perfil. La personalización arranca recién después de crear el perfil.
- [ ] **P-01** Texto de la pantalla de crear perfil: cambiar "Todo el material de ingreso democrático, en un solo lugar" por **"Prepará tu examen de ingreso democrático en un solo lugar"**.
- [ ] **P-02** **"Continuar con Google" no funciona.** Dos caminos: configurar el proveedor de Google en Supabase Auth (requiere credenciales de Google Cloud Console) o quitar el botón por ahora. **Recomendación: quitarlo.** El magic link alcanza para lanzar y el OAuth de Google agrega una dependencia externa que no necesitamos el día 1. Si se quita, dejarlo comentado con una nota para reactivarlo después.
- [ ] **P-03** Quitar la frase "Elegís una vez. Después lo podés cambiar desde mi perfil".
- [ ] **P-04** En la opción **Estudiantes de derecho**, el subtítulo dice **"Para estudiantes"**.
- [ ] **P-05** En la opción **Otro perfil**, el subtítulo dice **"Para otra ocupación"** (hoy dice "para abogados y abogadas", que es incorrecto).
- [ ] **P-06** Sacar el marcador provisorio del pie de esa pantalla.

---

## TANDA 3 · Legales y contacto
> Es pegar contenido. Rápido y sin riesgo. Los textos completos están en `content/legales/`.

- [ ] **L-01** Renombrar el enlace "Términos" a **"Términos y Condiciones"**. Ruta `/terminos-y-condiciones`.
- [ ] **L-02** Reemplazar el contenido por el texto completo provisto. Fecha de última actualización visible arriba.
- [ ] **L-03** Renombrar "Privacidad" a **"Política de Privacidad"**. Ruta `/politica-de-privacidad`.
- [ ] **L-04** Reemplazar el contenido por el texto completo provisto.
- [ ] **L-05** Rehacer la página **Contacto** con el contenido nuevo: encabezado, mails de las dos organizaciones, Instagram como botones visuales (`@nexoderecho` y `@nueva.abogacia`, nunca URLs largas) y formulario.
- [ ] **L-06** Formulario de contacto: nombre y apellido, correo, motivo (Información general / Ingreso Democrático / Simulador de examen / Material de estudio / Problemas técnicos / Otra consulta), mensaje. Guarda en tabla `consultas` y manda aviso por Resend.
- [ ] **L-07** Falta el mail de Nueva Abogacía. Dejar `[PENDIENTE]` visible en el código, no inventar una dirección.
- [ ] **L-08** Las tres páginas legales usan la piel `dual`, tipografía de lectura cómoda y ancho máximo de 68 caracteres por línea.

---

## TANDA 4 · Pestaña Simulador de Exámenes  `/simulador`
> Página nueva. **Es el producto.** Directa, funcional, simple, rápida: el usuario entra, elige organismo, elige modalidad y arranca.

### Estructura de las dos evaluaciones
| | **MPF** | **MPD** |
|---|---|---|
| Teórico | Opción múltiple | Opción múltiple |
| Práctico | Consignas de búsqueda e investigación, respondidas por opción múltiple | **Tipeo** |

- [ ] **S-01** Encabezado: "Simulador de Exámenes" / "Prepará tu ingreso. Practicá. Medí tu nivel." + párrafo de presentación + botón "Comenzar a practicar".
- [ ] **S-02** Bloque "Elegí tu examen" con dos tarjetas grandes y claramente diferenciadas: MPF y MPD. Cada una lista sus dos instancias y tiene su botón "Comenzar MPF" / "Comenzar MPD".
- [ ] **S-03** MPF · Examen teórico: opción múltiple sobre los contenidos evaluables.
- [ ] **S-04** MPF · Examen práctico: ejercicios basados en los recursos e insumos de la instancia práctica.
- [ ] **S-05** MPD · Examen teórico: opción múltiple.
- [ ] **S-06** MPD · Examen práctico de **tipeo**: instancia específica, con su propia metodología. **Requiere componente nuevo** (medición de velocidad y precisión). Ver bloque de pendientes al final.
- [ ] **S-07** Sección "¿Cómo funciona?" en cuatro pasos: 01 Elegí tu examen · 02 Elegí qué querés practicar · 03 Resolvé · 04 Revisá tu desempeño.
- [ ] **S-08** Sección "Una herramienta para practicar, no para adivinar el examen", con el aviso de que los resultados son orientativos y no representan resultados oficiales.
- [ ] **S-09** **Nunca publicar la cantidad exacta de preguntas.** Usar "amplia base de preguntas", "contenido en constante actualización", "múltiples instancias de práctica". La base cambia todo el tiempo y un número fijo envejece mal.
- [ ] **S-10** Cierre: "Tu preparación empieza acá." / "Practicá. Detectá tus errores. Volvé a intentarlo." / "El acceso al simulador es gratuito." + botón.
- [ ] **S-11** El simulador es gratuito y se puede usar las veces que se quiera. Sin límite de intentos.
- [ ] **S-12** Pantalla de resultados: correctas, incorrectas, porcentaje de aciertos, tiempo utilizado y desempeño por tema.
- [ ] **S-13** Los puntajes, la duración y la cantidad de preguntas salen de la tabla `exams`. Nunca fijos en el código: MPD y MPF puntúan distinto.
- [ ] **S-14** Reubicar acá, reformulado, el contenido sobre criterio de evaluación que se saca de la muestra (M-12). Va dentro del flujo del examen del MPD, no como sección de venta.
- [ ] **S-15** El modelo de datos necesita distinguir instancia teórica de práctica: agregar `instancia('teorico'|'practico')` y `modalidad('multiple_choice'|'investigacion'|'tipeo')` a `exams`.

---

## TANDA 5 · Pestaña Asistente  `/asistente`
> Página nueva. Formato chat, pero cerrado y controlado. **La confianza importa más que la estética.**

- [ ] **A-01** Encabezado: "Asistente de Ingreso Democrático" / "Resolvé tus dudas sobre el examen de ingreso al MPD y al MPF." + párrafo breve.
- [ ] **A-02** **Selector de organismo arriba de todo**, obligatorio: `MPD | MPF | No estoy seguro`. Una vez elegido, el asistente prioriza exclusivamente ese corpus, salvo que la pregunta pida comparar los dos.
- [ ] **A-03** Categorías de acceso rápido: Contenidos del examen · Normativa · Modalidad y evaluación · Examen y simuladores · Dudas frecuentes · Hacer una pregunta.
- [ ] **A-04** Aclaración visible: "¿No sabés cómo formular tu pregunta? No hay problema. Escribí tu duda con tus propias palabras."
- [ ] **A-05** Caja de preguntas con ejemplos debajo, que le enseñan al usuario qué puede preguntar: "¿Qué temas entran en el examen del MPF?", "¿Cuántas preguntas tiene el examen?", "¿Qué normativa tengo que estudiar para el MPD?", "¿Cómo se computan las respuestas incorrectas?".
- [ ] **A-06** **Estructura fija de respuesta**, nunca un párrafo suelto de IA: Respuesta → Fuente (con enlace "Ver fuente →") → Consulta relacionada, si la hay.
- [ ] **A-07** **Tres niveles de certeza, visualmente distintos. Esto es lo más importante de la pestaña.**
  - 🟢 **Respuesta respaldada** — hay fuente oficial o normativa clara.
  - 🟡 **Información orientativa** — proviene de experiencias de quienes rindieron, sin confirmación oficial. Texto: "Según experiencias de personas que ya rindieron, este tema apareció en distintas oportunidades. Sin embargo, recomendamos verificar siempre la convocatoria y normativa vigente."
  - 🔴 **No encontramos una respuesta** — "No encontramos una respuesta suficientemente respaldada para esta consulta. Te recomendamos revisar la normativa oficial o reformular la pregunta." + botón "Ver normativa".
- [ ] **A-08** El asistente **nunca inventa**. Si no hay respaldo en el corpus, devuelve el estado rojo. Sin excepciones.
- [ ] **A-09** Botón "🔗 ¿De dónde sale esta respuesta?" que despliega la fuente utilizada y las consultas de referencia que la respaldan.
- [ ] **A-10** **Buscador de preguntas ya respondidas**, independiente del chat, con las frecuentes listadas: ¿Cómo es el examen? · ¿Qué normativa debo estudiar? · ¿Cuántas preguntas tiene? · ¿Cómo es el sistema de evaluación? · ¿Qué pasa si respondo mal? · ¿Qué documentación necesito? · ¿Cuándo se publican los resultados? · ¿Qué diferencias hay entre MPD y MPF? Nadie debería tener que conversar con una IA para todo.
- [ ] **A-11** Al final de cada respuesta, siguiente paso: Practicar con un simulador · Ver normativa · Ver preguntas frecuentes · Hacer otra pregunta.
- [ ] **A-12** Bloque **"¿No encontramos la respuesta?"**: formulario para dejar la consulta. Aparece automáticamente después de una respuesta insuficiente y además está siempre disponible debajo del asistente. Guarda en tabla `consultas_sin_respuesta`. Texto de cierre: "Entre todos hacemos un asistente cada vez mejor para preparar el ingreso."
- [ ] **A-13** Posicionamiento: no se vende como "hablás con una IA". Se vende como **"Tu asistente para el Ingreso Democrático — Preguntá. Encontrá la respuesta. Verificá la fuente."**
- [ ] **A-14** Bloque del asistente en la pestaña de muestra, con estos textos exactos:
  > **Ahora, el asistente**
  > Preguntá cualquier duda que tengas sobre el concurso. Desde la inscripción hasta la entrevista posterior al sorteo.
  > Este asistente fue construido a partir de consultas reales de personas que ya rindieron los exámenes de Ingreso Democrático al Ministerio Público de la Defensa (MPD) y al Ministerio Público Fiscal (MPF).
  > Podés hacerle tus preguntas y recibir respuestas fundamentadas y con cita de la fuente correspondiente, para que puedas verificar la información y seguir estudiando por tu cuenta.
  > Y si no encontramos una respuesta, te lo vamos a decir en lugar de inventarla. Además, podés dejarnos tu consulta para que la revisemos y nos ayudes a seguir mejorando el asistente.

  Acompañado de una caja de ejemplo ("¿En qué podemos ayudarte?" / "Escribí tu pregunta…" / "Ej.: ¿Qué pasa después del sorteo?" / botón "Preguntar") y tres sellos: 📚 Respuestas basadas en consultas reales · 🔎 Fuentes para verificar la información · ⚠️ Si no sabemos, te lo decimos.

---

## TANDA 6 · Pestaña Inscripción  `/inscripcion`
> Página nueva. El manual del MPD es la base: se traduce a una experiencia web más clara. Después se replica la misma estructura para el MPF.

- [ ] **I-01** Hero de inscripción.
- [ ] **I-02** Selector MPD / MPF.
- [ ] **I-03** Checklist previa (qué necesitás antes de empezar).
- [ ] **I-04** Guía completa paso a paso. Cada paso con texto en lenguaje sencillo, capturas, advertencias y video.
  - Paso 2 · Crear o validar tu usuario — registro, contraseña y validación del correo.
  - Paso 3 · Completar tus datos personales — qué pide el formulario y cómo cargarlo.
  - Paso 4 · Adjuntar la documentación — formatos, errores frecuentes, cómo verificar que quedó cargada.
  - Paso 5 · Confirmar la inscripción — qué revisar antes de enviar y cómo comprobar que se realizó.
- [ ] **I-05** Sección **Errores frecuentes**: "No me llega el mail de confirmación" · "No puedo adjuntar un archivo" · "Completé todo, ¿cómo sé si terminé?". Alimentable desde el asistente.
- [ ] **I-06** **Biblioteca de videos**: sección propia, con videos cortos por momento del trámite. Nada de un video de 20 minutos.
- [ ] **I-07** Cierre "¿Te trabaste en algún paso?" con acceso directo al asistente.
- [ ] **I-08** La estructura visual del MPD y la del MPF son idénticas, para que se sientan parte del mismo sitio.
- [ ] **I-09** Bloque de inscripción en la pestaña de muestra, encabezado por la frase fuerte **"Inscribite sin perderte."** / "Todo lo que necesitás para completar tu inscripción al MPD o al MPF, explicado paso a paso." Con las dos tarjetas de concurso, los cuatro destacados (📋 Guías detalladas · 🖥️ Capturas de pantalla · 🎥 Videos explicativos · ⚠️ Errores frecuentes) y el cierre "¿Te quedó alguna duda?" hacia el asistente.

---

## TANDA 7 · Bloque del simulador en la pestaña de muestra
> **Va última a propósito.** Esta sección muestra capturas reales del simulador, así que no se puede construir antes de que el simulador exista.

Criterio: la muestra es **visual, dinámica, atractiva, demostrativa**. Menos texto, más capturas. El usuario tiene que recorrerla y pensar "quiero probar esto".

- [ ] **V-01** Encabezado: "Conocé el simulador" / "Así podés prepararte para tu examen de ingreso." + botón "Probar el simulador".
- [ ] **V-02** Captura grande y protagonista del simulador, con frases cortas alrededor: Preguntas de opción múltiple · Practicá las veces que quieras · Poné a prueba tus conocimientos · Conocé tu resultado · Volvé a intentarlo.
- [ ] **V-03** Sección MPF: teoría + práctica, con captura de pregunta y captura de ejercicio práctico.
- [ ] **V-04** Sección MPD: teoría + tipeo, con captura de pregunta y captura del simulador de tipeo.
- [ ] **V-05** Sección Resultados: "¿Cómo te fue?" con captura de la pantalla de resultados.
- [ ] **V-06** Sección "Una herramienta que podés volver a usar" + botón.
- [ ] **V-07** Cierre limpio: "Ahora que ya lo conocés, probalo." + "Comenzar a practicar".
- [ ] **V-08** Orden interno del apartado: Presentación → Así se ve el simulador → MPF → MPD → Resultados → Características → Llamada a la acción.

---

## PENDIENTES BLOQUEANTES
> No son tareas de Claude Code. Son cosas que faltan de mi lado y frenan ítems concretos.

- [ ] **B-01** Los **dos ejemplos de parte práctica y parte teórica** mencionados no llegaron. Bloquean S-04 y S-06.
- [ ] **B-02** **Metodología completa del examen de tipeo del MPD**: duración, cantidad de caracteres, criterio de error, umbral de aprobación. Bloquea S-06.
- [ ] **B-03** **Manual y preguntero del MPF**. Bloquea S-03 y la carga del simulador del MPF.
- [ ] **B-04** **Mail de Nueva Abogacía**. Bloquea L-07.
- [ ] **B-05** **Capturas reales del simulador** para la muestra. Bloquea toda la Tanda 7, y por eso va última.
- [ ] **B-06** Tiempos y criterios de evaluación de ambos exámenes, para cargar en `exams`.

---

## REGLAS QUE SIGUEN VIGENTES EN TODOS LOS CAMBIOS
- Ninguna pregunta se publica con `revisada = false`.
- Toda sección sin datos no se renderiza. Nada de "próximamente" ni placeholders visibles.
- El aviso de no oficialidad va en el pie de todas las páginas.
- Contraste AA en todo texto. El azul `#0059BA` nunca se usa para texto.
- Español rioplatense, "vos", sin adjetivos con género en la interfaz.
- Todos los textos en `content/`, ningún string suelto en componentes.
