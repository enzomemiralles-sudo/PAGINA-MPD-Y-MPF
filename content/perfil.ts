import type { TipoPerfil } from "@/lib/marca/marcas";

export const seleccion = {
  titulo: "Seleccioná tu perfil para personalizar tu experiencia",
  bajada: "Elegís una vez. Después lo podés cambiar desde «Mi perfil».",
  opciones: [
    { id: "abogado" as TipoPerfil, etiqueta: "Abogado / Profesional" },
    { id: "estudiante" as TipoPerfil, etiqueta: "Estudiante de Derecho" },
    { id: "otro" as TipoPerfil, etiqueta: "Otro perfil" },
  ],
  guardando: "Entrando…",
  error: "No pudimos guardar tu perfil. Probá de nuevo.",
} as const;
