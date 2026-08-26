/** Todos los textos del flujo de ingreso. Castellano rioplatense, con voseo. */

export const ingreso = {
  titulo: "Ingresá a tu cuenta",
  tituloRegistro: "Creá tu cuenta",
  bajada: "Todo el material del ingreso democrático, en un solo lugar.",

  google: "Continuar con Google",
  divisor: "o",

  email: "Correo electrónico",
  emailPlaceholder: "tu@mail.com",
  clave: "Contraseña",
  clavePlaceholder: "Tu contraseña",
  claveRepetir: "Repetir contraseña",

  entrar: "Ingresar",
  entrando: "Ingresando…",
  crear: "Crear cuenta",
  creando: "Creando cuenta…",

  olvide: "¿Olvidaste tu contraseña?",
  olvideLink: "Recuperala",

  sinCuenta: "¿No tenés cuenta?",
  sinCuentaLink: "Creá una",
  conCuenta: "¿Ya tenés cuenta?",
  conCuentaLink: "Ingresá",

  revisaMail: "Te mandamos un correo para confirmar la cuenta. Revisá también el spam.",
} as const;

export const recuperar = {
  titulo: "Recuperá tu contraseña",
  bajada: "Poné el correo con el que te registraste y te mandamos un enlace para cambiarla.",
  email: "Correo electrónico",
  enviar: "Enviar enlace",
  enviando: "Enviando…",
  listoTitulo: "Revisá tu correo",
  listoTexto:
    "Si hay una cuenta con ese correo, te llega un enlace para cambiar la contraseña. Revisá también el spam.",
  volver: "Volver al ingreso",
} as const;

export const nuevaClave = {
  titulo: "Elegí una contraseña nueva",
  bajada: "Tiene que tener al menos 8 caracteres.",
  clave: "Contraseña nueva",
  claveRepetir: "Repetir contraseña",
  guardar: "Guardar contraseña",
  guardando: "Guardando…",
  listo: "Listo, ya podés ingresar con la contraseña nueva.",
  enlaceVencido:
    "Este enlace ya no sirve. Pedí uno nuevo desde «¿Olvidaste tu contraseña?».",
  pedirOtro: "Pedir otro enlace",
} as const;

/** Errores. Cada uno dice qué pasó y qué hacer. */
export const errores = {
  mailInvalido: "Ese correo no parece válido. Revisá que esté bien escrito.",
  mailFalta: "Escribí tu correo electrónico.",
  claveCorta: "La contraseña tiene que tener al menos 8 caracteres.",
  claveFalta: "Escribí tu contraseña.",
  clavesNoCoinciden: "Las dos contraseñas no coinciden.",
  credenciales: "El correo o la contraseña no coinciden. Probá de nuevo.",
  yaRegistrado: "Ya hay una cuenta con ese correo. Ingresá o recuperá la contraseña.",
  mailSinConfirmar: "Todavía no confirmaste tu correo. Buscá el mail que te mandamos.",
  demasiadosIntentos: "Demasiados intentos seguidos. Esperá un momento y probá otra vez.",
  google: "No pudimos entrar con Google. Probá de nuevo o usá tu correo.",
  generico: "Algo falló de nuestro lado. Probá de nuevo en un momento.",
  sinConfigurar:
    "El ingreso todavía no está conectado. Falta configurar Supabase en este entorno.",
} as const;

export const pieLogos = {
  ayuda: "Una iniciativa de Nexo Derecho y Nueva Abogacía",
} as const;
