# Lo que falta, y quién lo puede hacer

Estado al 31 de agosto de 2026, después de la tanda 4.

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

## 4. Lo que queda en el código, para cuando digas

Ninguna de estas frena la tanda 4. Están anotadas para no perderlas.

- **Comparar el formato en el tipeo.** El reglamento cuenta como error la
  negrita, la cursiva y el subrayado que falten; el simulador todavía compara
  sólo el texto, así que exige *menos* que el examen. La pantalla lo dice.
  Implementarlo es un editor con formato y una comparación por palabra que
  también mire los estilos.
- **Cuántos ejercicios sirve el práctico del MPF** (ver B-01).
- **`citext` vive en el esquema público.** Lo marca el linter de Supabase.
  Moverlo es cosmético y rompería `alertas` si se hace mal; lo dejamos como
  está a propósito.
- Hay una fila de prueba, `verificacion-claude@example.com`, en `alertas`.
  Se borra con un `delete` desde el SQL Editor cuando quieras.

---

## 5. Y después, la tanda que digas

Las que quedan en `CAMBIOS.md`:

- **Tanda 5** · pestaña Asistente
- **Tanda 6** · pestaña Inscripción
- **Tanda 7** · la muestra de la portada, que ahora puede usar capturas reales

Decime por cuál seguimos.
