import type { TipoPerfil } from "@/lib/marca/marcas";

/** Todos los textos del modal de datos y de «Mi perfil». */

export const modal = {
  titulo: "Contanos un poco más",
  cerrar: "Cerrar",
  guardar: "Continuar",
  guardando: "Guardando…",
  error: "No pudimos guardar tus datos. Probá de nuevo.",
  aceptar: "Leí y acepto las condiciones de uso",
  aclaracion: "Podés dejar los campos vacíos, pero necesitamos tu aceptación para seguir.",
  escribiendonos: "escribiéndonos",
  opcional: "opcional",
} as const;

export const miPerfil = {
  titulo: "Mi perfil",
  bajada: "Estos son tus datos. Podés cambiarlos cuando quieras.",
  cuenta: "Cuenta",
  correo: "Correo electrónico",
  perfilElegido: "Perfil",
  aceptacion: "Condiciones de uso",
  aceptadaEl: (fecha: string) => `Aceptadas el ${fecha}`,
  sinAceptar: "Todavía no las aceptaste",
  guardar: "Guardar cambios",
  guardando: "Guardando…",
  guardado: "Listo, guardamos los cambios.",
  cerrarSesion: "Cerrar sesión",
  volver: "Volver",
  tipos: { abogado: "Abogado / Profesional", estudiante: "Estudiante de Derecho", otro: "Otro perfil" },
} as const;

export type Campo = {
  nombre: string;
  etiqueta: string;
  tipo: "texto" | "numero" | "opciones";
  opcional?: boolean;
  opciones?: { valor: string; texto: string }[];
  /** Sustituye {org} por el nombre corto de la marca. */
  plantilla?: boolean;
};

const DNI_Y_TELEFONO: Campo[] = [
  { nombre: "dni", etiqueta: "DNI", tipo: "texto", opcional: true },
  { nombre: "telefono", etiqueta: "Teléfono", tipo: "texto", opcional: true },
];

const ABOGADO: Campo[] = [
  { nombre: "anio_egreso", etiqueta: "Año de egreso", tipo: "numero" },
  { nombre: "jurisdiccion", etiqueta: "Jurisdicción / Fuero principal", tipo: "texto" },
  {
    nombre: "matriculado",
    etiqueta: "¿Estás matriculado/a?",
    tipo: "opciones",
    opciones: [
      { valor: "si", texto: "Sí" },
      { valor: "no", texto: "No" },
    ],
  },
  { nombre: "area_ejercicio", etiqueta: "Área de ejercicio principal", tipo: "texto" },
  ...DNI_Y_TELEFONO,
];

const ESTUDIANTE: Campo[] = [
  { nombre: "anio_ingreso", etiqueta: "Año de ingreso a la facultad (desde el CBC)", tipo: "numero" },
  {
    nombre: "como_conocio",
    etiqueta: "¿Cómo conociste {org}?",
    tipo: "opciones",
    plantilla: true,
    opciones: [
      { valor: "recomendacion", texto: "Me lo recomendó alguien" },
      { valor: "redes", texto: "Por redes sociales" },
      { valor: "aula", texto: "En una pasada por aula" },
      { valor: "otro", texto: "Otro" },
    ],
  },
  {
    nombre: "trabaja_juridico",
    etiqueta: "¿Trabajás en el ámbito jurídico?",
    tipo: "opciones",
    opciones: [
      { valor: "no", texto: "No" },
      { valor: "estudio", texto: "En un estudio jurídico" },
      { valor: "juzgado", texto: "En un juzgado" },
      { valor: "ministerio_publico", texto: "En el Ministerio Público" },
      { valor: "otro", texto: "Otro" },
    ],
  },
  ...DNI_Y_TELEFONO,
];

/** El perfil «otro» carga los mismos campos que abogado/profesional. */
export function camposDe(tipo: TipoPerfil): Campo[] {
  return tipo === "estudiante" ? ESTUDIANTE : ABOGADO;
}
