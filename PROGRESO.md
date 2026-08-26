# PROGRESO

## Bloque 1 — hecho

- **Proyecto Next.js 15** con App Router, TypeScript estricto (`noUncheckedIndexedAccess`,
  sin `any`), Tailwind y las fuentes por `next/font` (Archivo variable con eje
  `wdth` e itálica, JetBrains Mono).
- **Tokens del preview** en `styles/tokens.css`, expuestos a Tailwind en
  `tailwind.config.ts`. Cinco valores se apartan del preview y están marcados
  `CORRECCIÓN` en el CSS con su motivo.
- **Landing portada a React**, fiel al preview: cinta con `mix-blend-mode`,
  vidrio con borde enmascarado y luz que sigue al puntero, entradas escalonadas
  con IntersectionObserver, maqueta del simulador que cobra vida al verla,
  contadores de la franja de números.
- **Captura de mail andando**, con Server Action, Zod y los dos consentimientos
  separados y sin tildar. Sin Supabase configurado valida y responde igual.
- **Esquema completo** en `supabase/migrations/`, con RLS en todas las tablas.
- **Pie legal en todas las vistas** (está en el layout).
- **Páginas de texto**: privacidad, términos y contacto.
- **`.env.example`** documentado. El sitio arranca sin ninguna variable.
- **76 tests de contraste** pasando.

Verificado en Chromium: sin errores de consola, sin respuestas ≥400, sin
desbordamiento horizontal a 375px, y como máximo 6 `backdrop-filter` por
pantalla — justo en el presupuesto.

## Despliegue — EN VIVO

**https://peron-delta.vercel.app** sirve la landing desde el commit `c35214d`.

Verificado contra producción: las cuatro rutas responden 200 y una inexistente
da 404, cada ruta trae su contenido, los bundles de JS y CSS cargan, las dos
imágenes de `marca/` y el optimizador de `next/image` responden, las fuentes
autohospedadas por `next/font` cargan, y las cinco correcciones de contraste
están en el CSS servido.

La interactividad —conmutador de las tres puertas, la pregunta de muestra, la
Server Action de alertas con su consentimiento, y 375px sin desborde— se
verificó en local sobre el mismo commit: Chromium no puede tunelizar HTTPS por
el proxy de la sesión, así que contra producción sólo llega curl.

## Cómo se llegó

- Rama `main` creada desde la rama de trabajo. Es la que Vercel tiene que
  construir.
- Rama por defecto del repo: ya es `main`.
- **Falta un paso manual, y no es el de GitHub.** Cambiar la rama por defecto
  del repo NO cambia la Production Branch de Vercel: Vercel la guarda aparte,
  tomada en el momento del import. Hoy sigue apuntando a
  `claude/mpf-faq-extraction-8nqr6i`, así que todo push a `main` se despliega
  como Preview y producción quedó clavada en `55b7182`, el commit que sólo
  tiene Python. De ahí el 404 de peron-delta.vercel.app.
  Se arregla en Vercel → Settings → Git → Production Branch → `main`.
- El build en Vercel **funciona**: el commit `9ff4fc5` compiló con estado
  success. Lo que falta es promoverlo, no arreglarlo.
- **`vercel.json` fija el framework.** El proyecto de Vercel se importó cuando
  la rama por defecto sólo tenía el pipeline de Python: sin `package.json` a la
  vista, Vercel no detectó Next.js y guardó el preset "Other". Con ese preset el
  build termina en success pero no produce nada servible, y todas las URLs del
  deployment dan 404 — que es exactamente lo que pasaba. `vercel.json` tiene
  precedencia sobre los ajustes del panel, así que declara el framework, el
  install y el build sin depender de la UI.
- Ojo con las URLs: `peron.vercel.app` es de otra persona (un sitio sobre Juan
  Domingo Perón). El dominio del proyecto es `peron-delta.vercel.app`.
- Los Preview tienen Deployment Protection activa: responden 302 hacia
  `vercel.com/sso-api`. Se abren estando logueado en Vercel, pero no se pueden
  verificar desde afuera sin un bypass token.
- El build es determinista: 8 builds en frío seguidos en verde, entre local y
  clon limpio. Antes fallaba de manera intermitente, ver la nota de abajo.
- Falta el proyecto de Supabase. Las migraciones están listas para correr y
  `.env.example` dice qué va en cada variable. El sitio anda sin ninguna.

## Etapa (a) — auth y login: hecha

- `middleware.ts` refresca la sesión en cada request y protege las rutas. La
  landing, los legales y el contacto quedan **públicos a propósito**: la landing
  existe para captar el mail de gente que todavía no tiene cuenta.
- `/ingresar` con Google arriba, divisor «o», mail y contraseña, alternado a
  registro, y recuperación en `/ingresar/recuperar` + `/ingresar/nueva-clave`.
- Piel `neutro`: el ingreso no usa color de ninguna de las dos marcas. El
  conmutador de puertas no se muestra ahí ni dentro de la app.
- Errores traducidos: mail inválido, contraseña corta, claves que no coinciden,
  credenciales, usuario ya registrado, mail sin confirmar, demasiados intentos.
- 99 tests de contraste (la piel neutra sumó 23 pares).

**Sin probar contra Supabase:** no hay proyecto todavía. Lo verificado en
navegador es el ruteo del middleware, la pantalla y las validaciones que corren
antes de tocar Supabase. El viaje real —crear cuenta, entrar, el correo de
recuperación, Google— queda pendiente de que existan las variables.

## Etapa (b) — selección de perfil y temas: hecha

**La app logueada es clara; la landing sigue oscura.** Eso partió el sistema en
dos ejes independientes en `<html>`:

- `data-superficie` = `oscura` | `clara` → fondo, texto, bordes, tarjeta
- `data-marca` = `dual` | `neutro` | `nexo` | `na` → los acentos

Hacían falta los dos porque la misma marca necesita acentos distintos en cada
superficie: el verde `#065D3B` da 7,12:1 sobre papel y 2,50:1 sobre negro.

- `lib/marca/marcas.ts`: un solo archivo con nombre, logo, para quién es y los
  textos que nombran a la organización. Ningún componente pregunta de qué marca
  se trata.
- `/elegir-perfil`: tres tarjetas, neutra, guarda `tipo_perfil` y `marca` y
  cambia la piel antes de navegar, para que no sea un salto seco.
- Migración `0003`: extiende `profiles` con `tipo_perfil`, los campos del modal,
  `fecha_aceptacion` y `onboarding_completado`. `perfil` se renombra a `marca`,
  y `nombre`/`apellido` pasan a nullable porque la fila nace en la selección de
  perfil, antes del modal.
- El middleware manda a `/elegir-perfil` a quien tiene sesión y no eligió marca.
- 118 tests de contraste, cubriendo las seis combinaciones de superficie y marca.

Tres colores se corrigieron por números, no por gusto:

1. **El degradé del botón de Nueva Abogacía.** Con `#00B894` en la punta, la
   letra blanca daba 2,54:1 sobre ese extremo. El degradé del botón termina en
   `#00846B` (4,65:1); el turquesa brillante sigue como `--acento-2` para
   detalles.
2. **`--marca-revisar` sobre claro.** El naranja de marca no puede ser texto
   sobre papel (2,44:1): baja a `#B15201` (4,60:1). Como fondo de botón el
   naranja de marca no cambia.
3. **La letra sobre el azul de NA en la landing oscura.** Daba 2,98:1 con la
   tinta. Ahora es clara: 5,98:1. Ya estaba mal antes de esta etapa.

## Ajustes de marca

- **Nexo es todo verde.** El naranja salió de la paleta: `--acento-2` pasa a ser
  un segundo verde (`#16A85B` en oscuro, `#0A7F4F` en claro) y el marcador de
  «revisar» dejó de ser un color de marca — vive en el bloque de superficie y es
  el mismo en las tres pieles. No queda ningún `#F58220` ni `#FC7502` en el
  código.
  Ojo con una consecuencia: de las tres reglas de diferenciación entre puertas
  que tenía la landing —naranja sólo en Nexo, color plano contra degradé,
  itálica condensada sólo en Nexo— queda sin la primera. Las otras dos alcanzan.
- **El logotipo de Nueva Abogacía entra solo.** `LogoNuevaAbogacia` detecta si
  existe `public/logos/nueva-abogacia.png`: si está, lo sirve por `next/image`
  leyendo el ancho y el alto del encabezado IHDR del PNG; si no, dibuja el
  marcador provisorio. Cuando se agregue el archivo no hay que tocar código.
- **Los logos van a color.** El PNG de Nexo es una silueta blanca con alfa, así
  que se usa como máscara y se pinta con `--logo-nexo`: blanco sobre oscuro,
  verde de marca (`#065D3B`) sobre claro. Nada de filtros de escala de grises.
- **La cinta argentina es el fondo del ingreso.** Sobre negro se compone con
  `mix-blend-mode: screen`; sobre papel eso no sirve porque el JPEG trae el
  negro pegado, así que se la enmascara consigo misma por luminancia y quedan
  sólo las franjas con su color real.

## Etapas (c) y (d) — modal de datos y «Mi perfil»: hechas

- **El modal «Contanos un poco más»** se abre solo la primera vez sobre `/app`.
  Es un `<dialog>` nativo: trae foco atrapado y Esc sin código extra. Se puede
  cerrar; quien lo cierre lo completa después desde «Mi perfil», y vuelve a
  aparecer al entrar hasta que acepte.
- **Los campos salen de un solo lugar** (`content/onboarding.ts`) y los usan el
  modal y «Mi perfil», así que no hay dos listas que se puedan desincronizar.
  Estudiante lleva la lista del modal, que es la que elegiste: año de ingreso
  desde el CBC, cómo conoció a la organización y si trabaja en el ámbito
  jurídico. Abogado y «otro» llevan los mismos campos entre sí.
- **La validación es la pedida:** todos los campos se pueden dejar vacíos y un
  campo vacío se guarda como `null`, no como cadena vacía. Lo único obligatorio
  es el checkbox: mientras no esté tildado el botón queda deshabilitado.
- **La fecha de aceptación no se pisa.** Al guardar de nuevo desde «Mi perfil»
  se conserva la primera: vale cuándo aceptó, no cuándo editó.
- **«Mi perfil»** muestra el correo, el perfil elegido, la fecha de aceptación
  como dato —no como checkbox editable—, los campos cargados y editables, y
  cerrar sesión. Si alguien nunca aceptó, ahí también se le pide.
- El texto legal nombra a la organización según la marca y «escribiéndonos» es
  un enlace a nexoderecho@gmail.com.

## Pendiente

- Bloque 2: auth por magic link, registro con perfil, panel `/admin`.

## Decisiones

### De diseño — el preview contra las reglas de aprobación

Cinco puntos donde el preview y los criterios de aprobación no podían ser
ciertos a la vez. Resueltos a favor del criterio, con el cambio más chico que
lo cumpla.

1. **Gradiente del titular.** Arrancaba en `#04170E` (1,08:1) y terminaba en
   `#05413F` (1,74:1); `#056B37` daba 3,00:1. Como barre cada 7s, el tramo
   oscuro pasaba por todas las palabras del elemento LCP. Los tres stops suben
   en luminosidad conservando tono y saturación hasta 4,61:1.
2. **`--papel-débil`** pasa de `.35` (2,93:1) a `.50` (4,90:1), y
   `--papel-tenue` de `.55` a `.70` (8,78:1) para no aplastar la jerarquía. Lo
   usaba, entre otros, el aviso legal del pie.
3. **`--marca-revisar`**, token nuevo. `--acento-2` vale `transparent` en dual y
   en na, y `var(--acento-2,#F58220)` no cae al fallback porque la variable está
   definida: quedaban invisibles tres eyebrows y el anillo de "marcada" del
   simulador. El naranja sigue siendo exclusivo de Nexo; lo que dejó de serlo es
   poder ver la marca, que es funcional.
4. **`Revelar` envuelve, no decora.** `.rev` se aplicaba a elementos con
   `backdrop-filter`, que es la combinación que el brief pide evitar. Ahora
   anima un div sin filtro y el vidrio queda quieto adentro.
5. **`--error`** pasa de `#E5484D` a `#E64D52`. Daba 4,47:1 sobre el vidrio de
   Nexo, la superficie más clara del sistema. Lo encontró el test, no una
   revisión a mano.

Además, el cambio de puerta se unificó en `var(--t-sec)` = 700ms: el preview lo
tenía escrito a `.6s` mientras su propio sistema de movimiento decía 700ms.

### De modelo

- **`questions_public`** más grants por columna. RLS filtra filas, no columnas:
  sin el `grant select (…)` cualquiera con la anon key podía leer
  `respuesta_correcta`. El grant es la protección real; la vista es la comodidad.
- **`attempt_answers.marcada`**, sin la cual no se puede calcular el
  contrafáctico de la pantalla de resultados.
- **`alertas`** admite `insert` anónimo pero no `select`: se puede dejar el mail,
  no se puede leer la lista.
- **El simulador del MPF será la teórica** (20 preguntas / 30 min). Las 3
  consignas de desarrollo van a biblioteca sin puntaje: corregir desarrollo está
  fuera de alcance.
- **El tipeo del MPD** entra como `exams` con una `questions` de `tipo='tipeo'`.
  Motor de corrección propio, Bloque 4.

### De implementación

- **Las Server Actions viven en `lib/`, no en `app/`.** Con el action en
  `app/acciones.ts` importado desde un componente cliente de `components/`, el
  build en frío fallaba una de cada varias veces con "Could not find the module
  CapturaEmail.tsx#CapturaEmail in the React Client Manifest". Ese import cruza
  el límite del App Router. Los componentes cliente que entran a un server
  component se importan además siempre por el alias `@/`: el mismo archivo con
  dos especificadores distintos puede terminar con dos claves en el manifiesto.
  Un build que falla a veces rompe un deploy cada tantos pushes, así que no
  alcanzaba con reintentar.

- **El sistema de diseño queda en CSS, no en utilidades de Tailwind.** Son 350
  líneas de CSS a medida —máscaras, blend modes, keyframes, ejes variables— y
  traducirlas a clases utilitarias las volvería ilegibles sin ganar nada.
  Tailwind expone los tokens para utilidades sueltas.
- **La cinta va con `next/image` en la capa base y CSS en la del destello.** El
  destello necesita la cinta como `mask-image`, y una máscara CSS pide una URL:
  no se puede enmascarar con un `<Image>`.
- **`lib/marca/tokens.ts` es un espejo de `tokens.css`** y el test verifica que
  coincidan. Si alguien toca el CSS y no el espejo, el test de contraste dejaría
  de decir la verdad en silencio.

## Supuestos

- `// SUPUESTO:` en `content/landing.ts` — `/registro` es del Bloque 2 y
  `/nexo`, `/na` y `/recursos` del Bloque 3. Hasta entonces los CTA llevan a lo
  que sí existe: la captura de mail y la sección de inscripción. Ningún enlace
  del sitio da 404.
- Los números de la maqueta del simulador son ilustración de producto y quedan
  fijos. Los de la franja salen de `lib/datos.ts`, que lee de la base y cae a
  datos de prueba si todavía no hay Supabase.
