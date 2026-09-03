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

- [x] **F-01** Al completar el perfil, redirigir **directo a la pestaña principal**. Eliminar la pantalla intermedia de "Bienvenido, este es tu perfil".
- [x] **F-02** "Mi perfil" pasa al **encabezado, siempre visible**, en todas las pantallas con sesión iniciada.
- [x] **F-03** La pestaña de muestra es pública y no cambia según el perfil. La personalización arranca recién después de crear el perfil.
- [x] **P-01** Texto de la pantalla de crear perfil: cambiar "Todo el material de ingreso democrático, en un solo lugar" por **"Prepará tu examen de ingreso democrático en un solo lugar"**.
- [x] **P-02** **"Continuar con Google" no funciona.** Dos caminos: configurar el proveedor de Google en Supabase Auth (requiere credenciales de Google Cloud Console) o quitar el botón por ahora. **Recomendación: quitarlo.** El magic link alcanza para lanzar y el OAuth de Google agrega una dependencia externa que no necesitamos el día 1. Si se quita, dejarlo comentado con una nota para reactivarlo después.
- [x] **P-03** Quitar la frase "Elegís una vez. Después lo podés cambiar desde mi perfil".
- [x] **P-04** En la opción **Estudiantes de derecho**, el subtítulo dice **"Para estudiantes"**.
- [x] **P-05** En la opción **Otro perfil**, el subtítulo dice **"Para otra ocupación"** (hoy dice "para abogados y abogadas", que es incorrecto).
- [x] **P-06** Sacar el marcador provisorio del pie de esa pantalla.

---

## TANDA 3 · Legales y contacto
> Es pegar contenido. Rápido y sin riesgo. Los textos completos están en `content/legales/`.

- [x] **L-01** Renombrar el enlace "Términos" a **"Términos y Condiciones"**. Ruta `/terminos-y-condiciones`.
- [x] **L-02** Reemplazar el contenido por el texto completo provisto. Fecha de última actualización visible arriba.
- [x] **L-03** Renombrar "Privacidad" a **"Política de Privacidad"**. Ruta `/politica-de-privacidad`.
- [x] **L-04** Reemplazar el contenido por el texto completo provisto.
- [x] **L-05** Rehacer la página **Contacto** con el contenido nuevo: encabezado, mails de las dos organizaciones, Instagram como botones visuales (`@nexoderecho` y `@nueva.abogacia`, nunca URLs largas) y formulario.
- [x] **L-06** Formulario de contacto: nombre y apellido, correo, motivo (Información general / Ingreso Democrático / Simulador de examen / Material de estudio / Problemas técnicos / Otra consulta), mensaje. Guarda en tabla `consultas` y manda aviso por Resend.
- [x] **L-07** Falta el mail de Nueva Abogacía. Dejar `[PENDIENTE]` visible en el código, no inventar una dirección. → llegó: `abogacianueva@gmail.com`, ya no hay marcador.
- [x] **L-08** Las tres páginas legales usan la piel `dual`, tipografía de lectura cómoda y ancho máximo de 68 caracteres por línea.

---

## TANDA 4 · Pestaña Simulador de Exámenes  `/simulador`
> Página nueva. **Es el producto.** Directa, funcional, simple, rápida: el usuario entra, elige organismo, elige modalidad y arranca.

### Estructura de las dos evaluaciones
| | **MPF** | **MPD** |
|---|---|---|
| Teórico | Opción múltiple | Opción múltiple |
| Práctico | Consignas de búsqueda e investigación, respondidas por opción múltiple | **Tipeo** |

- [x] **S-01** Encabezado: "Simulador de Exámenes" / "Prepará tu ingreso. Practicá. Medí tu nivel." + párrafo de presentación + botón "Comenzar a practicar".
- [x] **S-02** Bloque "Elegí tu examen" con dos tarjetas grandes y claramente diferenciadas: MPF y MPD. Cada una lista sus dos instancias y tiene su botón "Comenzar MPF" / "Comenzar MPD".
- [x] **S-03** MPF · Examen teórico: opción múltiple sobre los contenidos evaluables.
- [ ] **S-04** MPF · Examen práctico: ejercicios basados en los recursos e insumos de la instancia práctica. → *La instancia está construida y anda; lo que falta es B-01. Cuántos ejercicios trae el práctico ya no es un supuesto: son **3**, confirmados con el brief y corregidos en la migración 0009.*
- [x] **S-05** MPD · Examen teórico: opción múltiple.
- [x] **S-06** MPD · Examen práctico de **tipeo**: instancia específica, con su propia metodología. **Requiere componente nuevo** (medición de velocidad y precisión). → *Hecho con la metodología oficial (B-02, arts. 25-29 del Reglamento de Ingreso). Los textos de práctica son propios —el examen real no publica los suyos— y tienen las 130 palabras que fija el artículo 27. Lo único que falta es comparar el formato: el reglamento lo cuenta como error y todavía no se mide, y la pantalla lo dice.*
- [x] **S-07** Sección "¿Cómo funciona?" en cuatro pasos: 01 Elegí tu examen · 02 Elegí qué querés practicar · 03 Resolvé · 04 Revisá tu desempeño.
- [x] **S-08** Sección "Una herramienta para practicar, no para adivinar el examen", con el aviso de que los resultados son orientativos y no representan resultados oficiales.
- [x] **S-09** **Nunca publicar la cantidad exacta de preguntas.** Usar "amplia base de preguntas", "contenido en constante actualización", "múltiples instancias de práctica". La base cambia todo el tiempo y un número fijo envejece mal.
- [x] **S-10** Cierre: "Tu preparación empieza acá." / "Practicá. Detectá tus errores. Volvé a intentarlo." / "El acceso al simulador es gratuito." + botón.
- [x] **S-11** El simulador es gratuito y se puede usar las veces que se quiera. Sin límite de intentos.
- [x] **S-12** Pantalla de resultados: correctas, incorrectas, porcentaje de aciertos, tiempo utilizado y desempeño por tema.
- [x] **S-13** Los puntajes, la duración y la cantidad de preguntas salen de la tabla `exams`. Nunca fijos en el código: MPD y MPF puntúan distinto.
- [x] **S-14** Reubicar acá, reformulado, el contenido sobre criterio de evaluación que se saca de la muestra (M-12). Va dentro del flujo del examen del MPD, no como sección de venta.
- [x] **S-15** El modelo de datos necesita distinguir instancia teórica de práctica: agregar `instancia('teorico'|'practico')` y `modalidad('multiple_choice'|'investigacion'|'tipeo')` a `exams`.

---

## TANDA 5 · Pestaña Asistente  `/asistente`
> Página nueva. Formato chat, pero cerrado y controlado. **La confianza importa más que la estética.**

- [x] **A-01** Encabezado: "Asistente de Ingreso Democrático" / "Resolvé tus dudas sobre el examen de ingreso al MPD y al MPF." + párrafo breve.
- [x] **A-02** **Selector de organismo arriba de todo**, obligatorio: `MPD | MPF | No estoy seguro`. Una vez elegido, el asistente prioriza exclusivamente ese corpus, salvo que la pregunta pida comparar los dos.
- [x] **A-03** Categorías de acceso rápido: Contenidos del examen · Normativa · Modalidad y evaluación · Examen y simuladores · Dudas frecuentes · Hacer una pregunta.
- [x] **A-04** Aclaración visible: "¿No sabés cómo formular tu pregunta? No hay problema. Escribí tu duda con tus propias palabras."
- [x] **A-05** Caja de preguntas con ejemplos debajo, que le enseñan al usuario qué puede preguntar: "¿Qué temas entran en el examen del MPF?", "¿Cuántas preguntas tiene el examen?", "¿Qué normativa tengo que estudiar para el MPD?", "¿Cómo se computan las respuestas incorrectas?".
- [x] **A-06** **Estructura fija de respuesta**, nunca un párrafo suelto de IA: Respuesta → Fuente (con enlace "Ver fuente →") → Consulta relacionada, si la hay.
- [x] **A-07** **Tres niveles de certeza, visualmente distintos. Esto es lo más importante de la pestaña.**
  - 🟢 **Respuesta respaldada** — hay fuente oficial o normativa clara.
  - 🟡 **Información orientativa** — proviene de experiencias de quienes rindieron, sin confirmación oficial. Texto: "Según experiencias de personas que ya rindieron, este tema apareció en distintas oportunidades. Sin embargo, recomendamos verificar siempre la convocatoria y normativa vigente."
  - 🔴 **No encontramos una respuesta** — "No encontramos una respuesta suficientemente respaldada para esta consulta. Te recomendamos revisar la normativa oficial o reformular la pregunta." + botón "Ver normativa".
- [x] **A-08** El asistente **nunca inventa**. Si no hay respaldo en el corpus, devuelve el estado rojo. Sin excepciones.
- [x] **A-09** Botón "🔗 ¿De dónde sale esta respuesta?" que despliega la fuente utilizada y las consultas de referencia que la respaldan.
- [x] **A-10** **Buscador de preguntas ya respondidas**, independiente del chat, con las frecuentes listadas: ¿Cómo es el examen? · ¿Qué normativa debo estudiar? · ¿Cuántas preguntas tiene? · ¿Cómo es el sistema de evaluación? · ¿Qué pasa si respondo mal? · ¿Qué documentación necesito? · ¿Cuándo se publican los resultados? · ¿Qué diferencias hay entre MPD y MPF? Nadie debería tener que conversar con una IA para todo. → Hecho, con una diferencia: en vez de esos ocho rótulos genéricos la lista muestra **las preguntas más hechas de verdad**, con su texto real y cuántas consultas tuvo cada una (88, 76, 70…). Probados los ocho contra el corpus, varios no corresponden a una sola respuesta —«¿Cómo es el sistema de evaluación?» no la tiene, y «¿Cuántas preguntas tiene?» depende del organismo y de la parte—, así que como rótulos prometían algo que abajo no estaba. El buscador acepta igual cualquiera de las ocho. Si los querés literales, decímelo.
- [x] **A-11** Al final de cada respuesta, siguiente paso: Practicar con un simulador · Ver normativa · Ver preguntas frecuentes · Hacer otra pregunta.
- [x] **A-12** Bloque **"¿No encontramos la respuesta?"**: formulario para dejar la consulta. Aparece automáticamente después de una respuesta insuficiente y además está siempre disponible debajo del asistente. Guarda en tabla `consultas_sin_respuesta` (migración `0007_asistente.sql`: **hay que correrla en Supabase**, ver PENDIENTES §0). Texto de cierre: "Entre todos hacemos un asistente cada vez mejor para preparar el ingreso."
- [x] **A-13** Posicionamiento: no se vende como "hablás con una IA". Se vende como **"Tu asistente para el Ingreso Democrático — Preguntá. Encontrá la respuesta. Verificá la fuente."**
- [x] **A-14** Bloque del asistente en la pestaña de muestra, con estos textos exactos:
  > **Ahora, el asistente**
  > Preguntá cualquier duda que tengas sobre el concurso. Desde la inscripción hasta la entrevista posterior al sorteo.
  > Este asistente fue construido a partir de consultas reales de personas que ya rindieron los exámenes de Ingreso Democrático al Ministerio Público de la Defensa (MPD) y al Ministerio Público Fiscal (MPF).
  > Podés hacerle tus preguntas y recibir respuestas fundamentadas y con cita de la fuente correspondiente, para que puedas verificar la información y seguir estudiando por tu cuenta.
  > Y si no encontramos una respuesta, te lo vamos a decir en lugar de inventarla. Además, podés dejarnos tu consulta para que la revisemos y nos ayudes a seguir mejorando el asistente.

  Acompañado de una caja de ejemplo ("¿En qué podemos ayudarte?" / "Escribí tu pregunta…" / "Ej.: ¿Qué pasa después del sorteo?" / botón "Preguntar") y tres sellos: 📚 Respuestas basadas en consultas reales · 🔎 Fuentes para verificar la información · ⚠️ Si no sabemos, te lo decimos.

---

## TANDA 6 · Pestaña Inscripción  `/inscripcion`
> Página nueva. El manual del MPD es la base: se traduce a una experiencia web más clara. Después se replica la misma estructura para el MPF.

- [x] **I-01** Hero de inscripción.
- [x] **I-02** Selector MPD / MPF.
- [x] **I-03** Checklist previa (qué necesitás antes de empezar).
- [ ] **I-04** Guía completa paso a paso. Cada paso con texto en lenguaje sencillo, capturas, advertencias y video. → **El texto y las advertencias están hechos y verificados; las capturas y los videos no, porque no existen** (ver B-07 y B-08). El hueco está armado en cada paso y no se dibuja mientras esté vacío. Queda sin tildar hasta que llegue el material.
  - Los pasos quedaron los cuatro del manual, no los cuatro de acá: **1 · Instalar la aplicación CONCURSOS** (la trampa de la PC con Windows, que esta lista se salteaba) · **2 · Registrarte** · **3 · Cargar el CV** (nueve páginas) · **4 · Inscribirte al examen y confirmar**.
  - No hay paso de adjuntar documentación: el manual dice textual que «no se sube ningún documento, en ningún formato digital». Esa sorpresa está en Errores frecuentes, como «No encuentro dónde subir los documentos».
- [x] **I-05** Sección **Errores frecuentes**: "No me llega el mail de confirmación" · "No puedo adjuntar un archivo" · "Completé todo, ¿cómo sé si terminé?". Alimentable desde el asistente. → El segundo cambió de nombre a «No encuentro dónde subir los documentos»: no es que no se pueda adjuntar, es que no se adjunta nada. Dejarlo como estaba mandaba a buscar la solución de un problema que no existe.
- [x] **I-06** **Biblioteca de videos**: sección propia, con videos cortos por momento del trámite. Nada de un video de 20 minutos.
- [x] **I-07** Cierre "¿Te trabaste en algún paso?" con acceso directo al asistente.
- [x] **I-08** La estructura visual del MPD y la del MPF son idénticas, para que se sientan parte del mismo sitio.
- [x] **I-09** Bloque de inscripción en la pestaña de muestra, encabezado por la frase fuerte **"Inscribite sin perderte."** / "Todo lo que necesitás para completar tu inscripción al MPD o al MPF, explicado paso a paso." Con las dos tarjetas de concurso, los cuatro destacados (📋 Guías detalladas · 🖥️ Capturas de pantalla · 🎥 Videos explicativos · ⚠️ Errores frecuentes) → **se muestran sólo los que hoy son ciertos**, que son guías y errores: anunciar capturas y videos que no existen es el placeholder que las reglas prohíben. Cada destacado dice de qué depende y aparecen solos cuando se carguen. Lo mismo con las tarjetas de concurso: una por guía cargada, hoy la del MPD y el cierre "¿Te quedó alguna duda?" hacia el asistente.

---

## TANDA 7 · Bloque del simulador en la pestaña de muestra
> **Va última a propósito.** Esta sección muestra capturas reales del simulador, así que no se puede construir antes de que el simulador exista.
> Las capturas se tomaron de las pantallas de verdad corriendo con preguntas de verdad del banco, contra el build de producción. Están en `public/muestra/`. Reemplazó a la maqueta dibujada que había en la portada.

Criterio: la muestra es **visual, dinámica, atractiva, demostrativa**. Menos texto, más capturas. El usuario tiene que recorrerla y pensar "quiero probar esto".

- [x] **V-01** Encabezado: "Conocé el simulador" / "Así podés prepararte para tu examen de ingreso." + botón "Probar el simulador".
- [x] **V-02** Captura grande y protagonista del simulador, con frases cortas alrededor: Preguntas de opción múltiple · Practicá las veces que quieras · Poné a prueba tus conocimientos · Conocé tu resultado · Volvé a intentarlo.
- [x] **V-03** Sección MPF: teoría + práctica, con captura de pregunta y captura de ejercicio práctico.
- [x] **V-04** Sección MPD: teoría + tipeo, con captura de pregunta y captura del simulador de tipeo.
- [x] **V-05** Sección Resultados: "¿Cómo te fue?" con captura de la pantalla de resultados.
- [x] **V-06** Sección "Una herramienta que podés volver a usar" + botón.
- [x] **V-07** Cierre limpio: "Ahora que ya lo conocés, probalo." + "Comenzar a practicar".
- [x] **V-08** Orden interno del apartado: Presentación → Así se ve el simulador → MPF → MPD → Resultados → Características → Llamada a la acción.

---

## TANDA 8 · El brief de diseño  *(acoplado sobre lo ya construido)*

No estaba en la lista original: entró con el brief del proyecto y se ejecutó
entero. El detalle de qué se encontró ya hecho, qué divergía y qué faltaba está
en `PLAN.md`.

**Fase A · la piel**
- [x] **D-01** Un solo eje de tokens: `data-marca` en `<html>`, cuatro pieles, todo oscuro. Cada puerta trae su propio fondo, no sólo su acento.
- [x] **D-02** El contraste se calcula, no se afirma: `lib/marca/contraste.ts` mide cada par y el test falla por debajo de 4,5:1. Las cuatro correcciones sobre los valores del preview van marcadas en `styles/tokens.css` con el motivo.
- [x] **D-03** `/pieles`, la página de control: las cuatro pieles sobre un botón, un enlace, una tarjeta, una opción correcta, una incorrecta y un divisor.

**Fase B · los cinco conflictos del brief**
- [x] **D-04** El acento de marca queda prohibido en la zona de respuestas, con un test que falla si aparece. El verde de Nexo no puede significar «correcta».
- [x] **D-05** La corrección no se comunica sólo por color: cambia el grosor del borde y hay ícono.
- [x] **D-06** En sesión el encabezado lleva un solo logo, el de la agrupación del perfil; la otra va al pie en la línea de coorganización.
- [x] **D-07** Los lemas arriba a la derecha, y el logotipo gigante al pie.

**Fase C · la home de puerta**
- [x] **D-08** El bloque de retención sobre datos reales del último intento: saludo, «retomar donde quedaste» y barras por tema. Tres estados, y ninguno esconde el bloque.
- [x] **D-09** Las tres columnas: menú, recursos y sociales. El `[PENDIENTE]` quedó donde de verdad falta el dato —el grupo de WhatsApp y el canal de YouTube de las dos— y no en el mail de Nueva Abogacía, que llegó con B-04.
- [x] **D-10** Las fotos de la facultad en perspectiva, con `next/image`.

**Fase D · la pestaña pública**
- [x] **D-11** La foto frontal reemplaza a la cinta argentina en el hero. En `dual` —que es el estado en que la pestaña pública está siempre— se muestran las dos partidas sobre el eje de simetría de la fachada.
- [x] **D-12** La cinta argentina se retiró entera: componentes, CSS y archivo.

**Fase E · accesibilidad y datos**
- [x] **D-13** Las opciones del simulador pasan a ser radios reales dentro de `fieldset` con `legend`. Se ganan las flechas y el «opción 2 de 4» del lector de pantalla.
- [x] **D-14** El perfil «otro» va a la piel neutra, como constante y con test. Antes iba a Nueva Abogacía.
- [x] **D-15** `theme-color` y favicon toman la piel del perfil. El correo de Resend no tiene piel que ponerse —es texto plano y va para adentro— pero dice de qué puerta viene quien escribe.
- [x] **D-16** `/admin`: cargar preguntas pegando JSON. Valida el lote entero antes de escribir, no duplica si se vuelve a pegar, y **no tiene manera de pedir que una pregunta entre ya revisada**.

---

## TANDA 9 · Vaciar la muestra, ordenar el perfil, reescribir la guía

Los prefijos son los de siempre: **M** la pestaña de muestra, **P** el perfil,
**I** la inscripción.

### Eliminaciones en la muestra
- [x] **M-15** Sacar la franja de métricas (69 preguntas, 0 dudas, 20.000 colegas, 100% gratis). Se fueron también el componente `Numeros`, la consulta `traerMetricas` y el tipo `Metricas`: no los usaba nadie más.
- [x] **M-16** Sacar las tres tarjetas de acceso —Nexo, Nueva Abogacía y Recursos abiertos— con sus bajadas, listas y botones. **El camino a cada puerta sigue existiendo:** «Empezar gratis» en el encabezado lleva a crear el perfil, y ahí se elige agrupación. Las tarjetas lo duplicaban.
- [x] **M-17** Sacar el párrafo «¿Por qué es gratis?».
- [x] **M-18** Sacar el bloque de cierre con la lista de espera: titular, párrafo, campo de mail, botón, los dos consentimientos y «Practicar ahora». **La infraestructura queda entera** —tabla `alertas`, su política RLS, la acción `suscribirAlerta` y el envío— y `<CapturaEmail>` queda exportado y **huérfano**, documentado como tal en el propio componente, a la espera de una ubicación nueva.
- [x] **M-19** Sacar el recuadro «Cómo se cargan las preguntas». Salió del pie, así que se fue de la muestra y del perfil de una vez. **La regla de producto sigue vigente:** nada se publica con `revisada = false` y no se tocó una línea de esa lógica.

### El perfil
- [x] **P-07** «Contanos un poco más» se veía translúcido. **La causa no era la que parecía:** el título mide 15,9:1 y ningún ancestro aporta opacidad ni filtro. Lo que se veía translúcido era la tarjeta entera —`--tarjeta` es papel al 4% y la fotografía de la facultad se veía a través de todo el formulario—. Se agregó el token `--tarjeta-solida`, opaco y propio de cada piel, para las superficies que pueden quedar sobre la foto.
- [x] **P-08** El saludo decía «Hola, null». La migración 0003 hizo `nombre` nullable, nada en el código lo escribe nunca, y el tipo declaraba `string` con un `as Perfil` que tapaba la diferencia. Ahora el tipo dice la verdad y **sin nombre no hay saludo**: no hay «Hola, usuario» ni «Hola, » a secas.
- [x] **P-09** Sacar «Grupos de WhatsApp» de Recursos, en las dos puertas.
- [x] **P-10** Sacar «Biblioteca de videos» como recurso suelto. Los videos viven embebidos dentro de la guía de inscripción, que es donde sirven.
- [x] **P-11** Los canales de YouTube, corregidos y centralizados en `lib/marca/marcas.ts` junto con el resto de lo que depende de la marca: `@nexoderecho4917` y `@nuevaabogacia`.
- [x] **P-12** `<VolverAlPerfil />`, en las nueve herramientas que se abren desde el perfil. Dentro del flujo y arriba a la izquierda, con flecha y no ícono de casa. **En el simulacro en curso pregunta antes**, porque salir abandona el intento.
- [x] **P-13** «Insumos de estudio» reemplaza a «Manuales y normativa»: selector de organismo primero, después la lista agrupada por eje. Un eje sin material no se renderiza.
- [x] **P-16** Los archivos salen de las carpetas de Drive de cada agrupación, no de Storage: cada eje enlaza a su carpeta y un material nuevo aparece con sólo subirlo, sin tocar código. El listado de cada eje es el programa del examen, no un índice del Drive, así que sigue siendo cierto aunque un archivo no esté. El eje del MPD va sin botón porque su carpeta está vacía.
- [x] **P-17** El grupo de WhatsApp vuelve, pero por examen y no por agrupación: quien estudia para el MPF quiere el grupo del MPF, no el de Nexo.
- [x] **P-14** «Conocé Nueva Abogacía» llevaba al contacto. Ahora lleva a `/na/quienes-somos`, con el texto que mandaron, sin resumir.
- [x] **P-15** Recurso nuevo «Página web» en las dos puertas: `/nexo/pagina-web` con las cinco herramientas del sitio, y `/na/pagina-web` con misión, visión y objetivo.

### La guía de inscripción
- [x] **I-10** Reescrita entera en `/guia-inscripcion`, con pantalla previa para elegir organismo. Cada tarjeta muestra el estado real del concurso reutilizando el componente que ya lo resolvía, no una copia de esa lógica.
- [x] **I-11** Una sola plantilla parametrizada, dos archivos de contenido. La estructura ① a ⑨ vive en el tipo, así que las dos guías no pueden divergir sin que deje de compilar.
- [x] **I-12** El contenido del MPF, verificado contra las cuatro páginas oficiales que se citan al pie.
- [x] **I-13** El del MPD **se deriva** del material que ya estaba en el repositorio, no se transcribe: 383 líneas de prosa copiadas a mano se desincronizan el día que alguien corrija el original.
- [x] **I-14** La experiencia: barra de progreso, pasos en acordeón con el pendiente abierto, check «Ya lo hice» que persiste en `localStorage` por organismo, y checklist final que es el reflejo de lo marcado. El orden dentro de cada paso lo impone la plantilla: explicación → captura → video → advertencia.
- [x] **I-15** `<Advertencia>` con peso visual propio: marco, rótulo y signo, no un párrafo en negrita. El estado no se comunica sólo por color.
- [x] **I-16** `<Captura>` y `<VideoSlot>`: con contenido renderizan; sin contenido y en preview muestran el hueco con su id; **sin contenido y en producción no renderizan nada**. Lo controla `NEXT_PUBLIC_MOSTRAR_PLACEHOLDERS`, que por defecto está apagada.

---

## PENDIENTES BLOQUEANTES
> No son tareas de Claude Code. Son cosas que faltan de mi lado y frenan ítems concretos.

- [ ] **B-01** Los **dos ejemplos de parte práctica y parte teórica** mencionados no llegaron. Bloquean S-04. (Ya no bloquean S-06: la metodología del tipeo salió del Reglamento, B-02.)
- [x] **B-02** **Metodología completa del examen de tipeo del MPD**. → Está en el **Reglamento para el Ingreso de Personal al MPD** (t.o. Res. DGN 1124/15), arts. 25 a 29: **130 palabras**, la unidad de error es **la palabra** (no el carácter), −5 por palabra mal escrita y −5 por palabra no escrita, mínimo 60, y los **30 minutos son para las dos instancias juntas**. Cargado en `lib/simulador/tipeo.ts` y citado en `material/metodologia/mpd-formato-examen.md`.
- [x] **B-03** **Manual y preguntero del MPF**. → Llegaron y ya están usados: `material/preguntas/crudo/mpf-modelos-manual.pdf` y `mpf-preguntero-nexo.pdf`. De ahí salieron las 176 preguntas del teórico del MPF y los 14 ejercicios del práctico que hoy están en `supabase/preguntas.sql`. S-03 quedó tildado con eso.
- [x] **B-04** **Mail de Nueva Abogacía**. Bloquea L-07. → `abogacianueva@gmail.com`
- [x] **B-05** **Capturas reales del simulador** para la muestra. → Resueltas. Salieron de las pantallas del propio simulador corriendo con preguntas reales del banco, tomadas contra el build de producción: teórico del MPF, práctico del MPF, teórico del MPD, tipeo del MPD y resultados. Están en `public/muestra/`. No hacía falta pedirlas: el simulador es nuestro y corre en local.
- [x] **B-07** **Las capturas del sistema de inscripción del MPD: llegaron.** Nueve, sacadas a mano en una PC con Windows, que era el único camino posible. Están conectadas a los pasos 1, 2 y 3 de la guía del MPD. Lo que sigue abajo queda como el registro de por qué no se podían sacar de la web.
  - **B-07 (histórico)** No es que falte buscarlas: **no existen en la web y no se pueden sacar de ahí.** `concursos.mpd.gov.ar` sirve una aplicación **Adobe Flex/Flash** (`SURH - MPD`, pide Flash Player 10.1) cuyo propio código tiene `var timelimit = new Date('2020-12-24')` y desde esa fecha expulsa a todo navegador que no sea Windows XP, Chromium 68 o IE. Por eso el manual hace instalar el `.msi`: es el envoltorio de escritorio de esa misma app. Las pantallas de los pasos 2, 3 y 4 sólo pueden salir de alguien que haga el trámite en una PC con Windows y saque las capturas a mano. Bloquea la parte de capturas de I-04.
  - Mientras tanto cada paso tiene un **esquema** dibujado a partir del manual, rotulado como esquema y no como captura. No lo reemplaza: el esquema ubica —dónde cae «Título Principal» entre nueve páginas, cuál es el camino de menús— y la captura muestra. Cuando lleguen, conviven.
  - Para sumarlas: los archivos van en `public/` y se agregan a `capturas` en `content/inscripcion/mpd.ts`, cada una con su `alt` y su `pie`.
- [ ] **B-08** **Los videos cortos del trámite.** La biblioteca (I-06) está armada y lee de la tabla `videos`; hoy está vacía. Con insertar filas con `publicado = true` aparece sola, sin tocar código.
- [x] **B-06** Tiempos y criterios de evaluación de ambos exámenes, cargados en `exams`. Los del MPD salieron del Reglamento (B-02) y los del MPF llegaron confirmados con el brief.
  - **Cuántas consignas trae el práctico del MPF: 3, en 15 minutos.** Era el único punto que quedaba abierto. `exams` cargaba 10 con el supuesto anotado en la migración 0005 —el simulador servía más del triple de ejercicios que el examen real— y lo corrige la migración `0009_mpf_practico_tres.sql`. Las diez preguntas cargadas siguen en el banco: `cantidad_preguntas` es cuántas trae el intento, no el tamaño del banco.
  - La ventana total del MPF también quedó confirmada en **una hora** para las dos partes, que era una de las dos versiones que el corpus registraba. La otra —45 minutos, del correo de citación— sigue mostrándose como contradicción en el asistente, que es lo que corresponde: es lo que dicen las fuentes, y no bloquea nada.

---

## REGLAS QUE SIGUEN VIGENTES EN TODOS LOS CAMBIOS
- Ninguna pregunta se publica con `revisada = false`.
- Toda sección sin datos no se renderiza. Nada de "próximamente" ni placeholders visibles.
- El aviso de no oficialidad va en el pie de todas las páginas.
- Contraste AA en todo texto. El azul `#0059BA` nunca se usa para texto.
- Español rioplatense, "vos", sin adjetivos con género en la interfaz.
- Todos los textos en `content/`, ningún string suelto en componentes.
