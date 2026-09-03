# Lo que falta, y quién lo puede hacer

Estado al 31 de agosto de 2026, después de la tanda 6.

Está ordenado por urgencia real: lo primero es lo que hoy impide que el
simulador muestre una sola pregunta.

---

## 0. El despliegue: resuelto

`peron-delta.vercel.app` publica desde **`main`**, y `main` está al día. Las
tandas 3 y 4, el simulador y la pantalla de revisión están en producción.

Queda una trampa anotada, porque ya nos costó una vuelta: **la Production
Branch cambió a mitad de camino.** Antes era `claude/mpf-faq-extraction-8nqr6i`
y ahora es `main`. Un pull request abierto contra la rama vieja se mergea sin
error y no despliega nada: Vercel lo trata como preview. Antes de abrir un PR,
mirar cuál es la Production Branch en ese momento.

`claude/mpf-faq-extraction-8nqr6i` quedó como rama de trabajo vieja, en el
mismo commit que `main`. Se puede borrar cuando quieras.

---

## 0 bis. Tuyo, cinco minutos: correr tres migraciones

Hay tres que todavía no corrieron en Supabase. Van en orden, y las tres se
pueden correr más de una vez sin romper nada. En Supabase → **SQL Editor** →
pegar el contenido del archivo y ejecutar.

**`supabase/migrations/0007_asistente.sql`.** El formulario de «¿No
encontramos la respuesta?» del asistente (A-12) guarda en una tabla nueva,
`consultas_sin_respuesta`, que todavía no existe. Hasta que se cree, el
formulario valida y responde el error de guardado en lugar de anotar la
consulta.

**`supabase/migrations/0008_piel_neutra.sql`.** Agrega el valor `neutro` al
enum de perfiles. Sin esto, quien elija «otro» no puede guardar el perfil.

**`supabase/migrations/0009_mpf_practico_tres.sql`.** Corrige el práctico del
MPF de 10 consignas a 3, que es lo que trae el examen real. Sin esto el
simulador sirve más del triple de ejercicios que la evaluación. No toca las
preguntas cargadas: las diez siguen en el banco y el intento sortea tres.

**`supabase/migrations/0010_insumos.sql`.** Crea el bucket público `insumos`
de Storage, de sólo lectura. Sin esto la pestaña de insumos lista el material
pero los botones de descarga no llevan a ningún archivo.

Si preferís una sola pegada, `supabase/instalar.sql` las incluye a las tres y
se puede volver a correr entero.

Lo que hace, y por qué está así: cualquiera puede dejar una consulta, nadie
puede leer las de los demás. Está probado contra un PostgreSQL de verdad en
`supabase/pruebas/02-seguridad.sql` (casos 13 a 16): insertar anda, insertar
marcándose la consulta como resuelta da permiso denegado, y leer la lista
también.

---

## 0 quater. Tuyo: subir los insumos de estudio

La pestaña de insumos ya lista los 21 materiales del MPF y los 2 del MPD,
agrupados por eje. Lo que falta es subir los archivos al bucket `insumos` de
Supabase Storage, con las rutas que están en `content/insumos.ts` —`mpf/…` y
`mpd/…`—. Un material cuyo archivo no esté subido se muestra igual, con su
título y su eje, pero sin botón de descarga: se ve qué entra en el examen
aunque el PDF todavía no esté.

---

## 0 ter. Tuyo: el material que le falta a la pestaña de inscripción

Las dos cosas están armadas y vacías. Ninguna necesita que toque código.

**Las capturas de pantalla del sistema (B-07).** Éstas no las puedo sacar yo,
y no por falta de acceso: **no existen en la web.**

`concursos.mpd.gov.ar` sirve una aplicación **Adobe Flex**, o sea Flash. Su
propio código trae `var timelimit = new Date('2020-12-24')` y desde esa fecha
echa a cualquier navegador que no sea Windows XP, Chromium 68 o Internet
Explorer. Por eso el manual te hace instalar el `.msi`: es el envoltorio de
escritorio de esa misma aplicación. Las pantallas de los pasos 2, 3 y 4 están
adentro de un programa instalado, no en una página que se pueda abrir.

O sea que tienen que salir de alguien que haga el trámite en una PC con
Windows y las saque a mano. Cuando las tengas, van en `public/` y se agregan
al campo `capturas` del paso en `content/inscripcion/mpd.ts`, cada una con su
`alt` —qué se ve— y su `pie` —qué hay que mirar—.

Mientras tanto **cada paso tiene un esquema** dibujado a partir del manual y
rotulado como esquema, no como captura. No las reemplaza: el esquema ubica
—dónde cae «Título Principal» entre las nueve páginas, cuál es el camino de
menús—, la captura muestra. Cuando lleguen las capturas, conviven.

**Los videos cortos (B-08).** La biblioteca lee de la tabla `videos`, que ya
existe desde la migración 0001. Insertá una fila por video con `publicado =
true` y aparecen solos:

```sql
insert into videos (titulo, youtube_id, organismo, orden, publicado)
values ('Instalar la aplicación CONCURSOS', 'ID_DE_YOUTUBE', 'mpd', 1, true);
```

Mientras la tabla esté vacía la sección entera no se renderiza, así que no hay
ningún cartel de «próximamente» esperando.

Cuando estén las dos, se puede tildar I-04 y los destacados de capturas y
videos aparecen solos en la portada.

---

## 1. Tuyo, cinco minutos, y es lo que desbloquea todo

### 1.1 `SUPABASE_SERVICE_ROLE_KEY` en Vercel

**Sin esto no se corrige ningún examen y la pantalla de revisión no anda.**

La respuesta correcta de una pregunta no la puede leer el navegador: está
cortada por permiso de columna en la base, no por código. Corregir un intento
y revisar el banco necesitan el cliente de servicio, y ese cliente necesita
esta clave.

En Vercel → tu proyecto → **Settings → Environment Variables**:

| Nombre | Valor | Dónde sale |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | la clave `service_role` | Supabase → Settings → API Keys |

Marcala para **Production, Preview y Development**. Las tres, no sólo
Production: mientras la rama no sea la de producción, el simulador vive en una
URL de preview, y una variable que no está marcada para Preview ahí no existe.

Después **redesplegá**: las variables se leen en el build, no en cada visita.

> **No me la pases por el chat ni la pongas en el repo.** Saltea toda la
> seguridad de la base: quien la tiene puede leer y borrar cualquier fila de
> cualquier tabla. Va sólo en ese campo de Vercel.

### 1.2 Cargar las 259 preguntas

Supabase → **SQL Editor** → pegá todo `supabase/preguntas.sql` → Run.

Se puede correr las veces que quieras: actualiza en vez de duplicar, y **no le
saca el tilde de revisada** a una pregunta que ya revisaste a mano.

Ya está cargado en la base, así que no hace falta que lo hagas otra vez:

- las cuatro instancias con sus puntajes (migración 0005);
- el rol de revisor y las columnas de revisión (migración 0006);
- los **3 textos de tipeo**, de 130 palabras cada uno;
- las **14 preguntas del práctico del MPF**.

Falta pegar lo que no entró: las **69 del MPD teórico** y las **176 del MPF
teórico**. Están en el mismo archivo; correrlo entero es lo más simple.

### 1.3 Un clic en Supabase: contraseñas filtradas

Supabase → **Authentication → Policies → Password security** → activá
*Leaked password protection*. Compara contra HaveIBeenPwned y evita que
alguien se registre con una contraseña que ya se filtró. Lo marca el propio
linter de Supabase.

### 1.4 Las URLs de autenticación

Supabase → **Authentication → URL Configuration**. Es el paso que nunca
confirmamos y sin él los correos de confirmación y de recuperación vuelven al
lugar equivocado.

- **Site URL**: `https://peron-delta.vercel.app`
- **Redirect URLs**: `https://peron-delta.vercel.app/auth/callback` y
  `https://peron-delta.vercel.app/ingresar/nueva-clave`

### 1.5 Opcional: el aviso de las consultas

Si querés que llegue un correo cuando alguien escribe por el formulario de
contacto, cargá en Vercel `RESEND_API_KEY` y `RESEND_FROM`. Sin eso la
consulta igual se guarda en la base: el aviso es lo prescindible, la consulta
no.

---

## 2. Tuyo, y no lo puede hacer nadie más: revisar las preguntas

Andá a **`/revisar`** —hoy, en la URL de preview del punto 0—. Tu cuenta
(`enzomemiralles@gmail.com`) ya tiene el rol.

La pantalla trae de a una pregunta, con la respuesta que venía marcada ya
elegida y el tema ya propuesto. Vos confirmás, corregís o frenás.

- **1 · 2 · 3** elige la respuesta
- **Enter** aprueba y trae la siguiente
- **S** saltea

Tres consejos para que no sea una tarde perdida:

1. **Empezá por «Alta»**. Son las 31 que están cruzadas contra dos fuentes
   independientes: si las dos dicen lo mismo, revisarlas es leer y apretar
   Enter.
2. **El tema ya viene propuesto** por reglas de palabra clave. Acertar acierta
   bastante, pero es una máquina: miralo antes de aprobar.
3. **Lo que no te cierre, frenalo con nota** en vez de aprobarlo con dudas. La
   nota queda guardada con la pregunta y la baja a confianza baja, así la
   encontrás después filtrando por «Baja».

En `material/preguntas/REVISAR.md` están anotados los problemas que ya
encontramos. Los cuatro, con el número que les toca en la pantalla:

| N.º | Qué pasa |
|---|---|
| **4003** | *«Para fomentar la inmigración europea…»* — el preguntero marca «Vivienda, navegación y Aduanas»; el manual marca «Educación laica, Matrimonio Civil y Registro Civil», que es la histórica. **La marcada está mal.** |
| **4020** | *«…¿de qué modo específico se ejerce violencia»* — el enunciado se corta ahí en el PDF original. Sin el texto completo no se puede responder: frenala con nota. |
| **3022** y **3127** | La misma pregunta sobre principios del sistema acusatorio, con opciones distintas. Conviene quedarse con una. |

**Hasta que revises, el simulador funciona y no muestra ninguna pregunta.** No
es un error: es la regla del proyecto haciendo lo que tiene que hacer.

### Si querés sumar a alguien más a revisar

Supabase → SQL Editor:

```sql
update profiles p set rol = 'revisor'
  from auth.users u
 where u.id = p.user_id and u.email = 'elmail@dequiensea.com';
```

No hay forma de auto-asignarse el rol desde el sitio, a propósito.

---

## 3. Material que sigue faltando de tu lado

| # | Qué | Qué desbloquea |
|---|---|---|
| **B-01** | Los **dos ejemplos de parte práctica y parte teórica** del MPF. | **S-04**. Hoy el práctico del MPF sirve 10 de los 14 ejercicios que tengo; el número real no consta y salió de una decisión, no de una fuente. Con el ejemplo se corrige con un `update`, sin tocar código. |
| **B-05** | ~~Capturas reales del simulador~~ | **Ya no hace falta**: el simulador existe y anda, así que las capturas de la tanda 7 salen de él. |
| — | El **texto real** de un examen de tipeo, si alguna vez conseguís uno. | Nada: los tres textos de práctica cumplen las 130 palabras que manda el artículo 27. Sería para que se parezca más, no para que funcione. |

**B-02 ya está resuelto.** Apareció la norma: *Reglamento para el Ingreso de
Personal al MPD*, texto ordenado conforme Res. DGN 1124/15, artículos 25 a 29.
Fija las 130 palabras, que la unidad de error es **la palabra** y no el
carácter, el descuento de 5 por palabra mal escrita y otros 5 por palabra no
escrita, y que **los 30 minutos son de las dos instancias juntas**. Está
citado en `material/metodologia/mpd-formato-examen.md` y cargado en el código.

**B-03 también.** El manual y el preguntero del MPF llegaron: de ahí salieron
las 176 preguntas del MPF teórico y las 14 del práctico.

---

## 3 bis. El lint ya corre

`npm run lint` no hacía nada: el repositorio tenía ESLint y `eslint-config-next`
instalados pero ningún archivo de configuración, así que `next lint` abría un
asistente interactivo y en un servidor se colgaba. Ahora hay `.eslintrc.json` y
el script llama a la CLI de ESLint directamente, no a `next lint`, que Next 16
elimina.

Las reglas del proyecto que antes vivían sólo en la cabeza ahora las comprueba
la máquina: nada de `any`, nada de importaciones sin usar, `===` en vez de `==`
y `const` cuando la variable no se reasigna. Encontró dos importaciones muertas
de verdad, ya sacadas.

Y hay CI: `.github/workflows/verificar.yml` corre tipos, lint, tests y build en
cada push a `main` y en cada pull request. Hasta ahora esas cuatro cosas se
corrían a mano y dependían de que alguien se acordara.

---

## 4. Lo que queda en el código, para cuando digas

Ninguna de estas frena la tanda 4. Están anotadas para no perderlas.

- **Comparar el formato en el tipeo.** El reglamento cuenta como error la
  negrita, la cursiva y el subrayado que falten; el simulador todavía compara
  sólo el texto, así que exige *menos* que el examen. La pantalla lo dice.
  Implementarlo es un editor con formato y una comparación por palabra que
  también mire los estilos.
- **`citext` vive en el esquema público.** Lo marca el linter de Supabase.
  Moverlo es cosmético y rompería `alertas` si se hace mal; lo dejamos como
  está a propósito.
- Hay una fila de prueba, `verificacion-claude@example.com`, en `alertas`.
  Se borra con un `delete` desde el SQL Editor cuando quieras.

---

## 5. Las tandas: no queda ninguna

Las siete de `CAMBIOS.md` están hechas y mergeadas, y la octava —el brief de
diseño— también. De los 101 ítems quedan **5 sin tildar**, y los cinco esperan
material tuyo, no código:

- **B-01** los dos ejemplos de parte práctica y teórica (bloquea S-04)
- **B-07** las capturas del sistema de inscripción del MPD, que hay que sacar a
  mano en una PC con Windows porque la web es una app Flash muerta
- **B-08** los videos cortos del trámite
- **I-04** la guía paso a paso, que espera a B-07 y B-08
- **S-04** el práctico del MPF, que espera a B-01

Decime por cuál seguimos.
