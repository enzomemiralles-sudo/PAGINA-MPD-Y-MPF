import type { TipoPerfil } from "@/lib/marca/marcas";

export const seleccion = {
  titulo: "Seleccioná tu perfil para personalizar tu experiencia",
  // El subtítulo de cada opción va acá y no en MARCAS_CONFIG: describe a quién
  // apunta *esta* opción, que no siempre es lo mismo que a quién apunta la
  // marca. «Otro perfil» comparte marca con la de abogados y sin embargo no es
  // para abogados.
  opciones: [
    { id: "abogado" as TipoPerfil, etiqueta: "Abogado / Profesional", quien: "Para abogados y abogadas" },
    { id: "estudiante" as TipoPerfil, etiqueta: "Estudiante de Derecho", quien: "Para estudiantes" },
    { id: "otro" as TipoPerfil, etiqueta: "Otro perfil", quien: "Para otra ocupación" },
  ],
  guardando: "Entrando…",
  error: "No pudimos guardar tu perfil. Probá de nuevo.",
} as const;
