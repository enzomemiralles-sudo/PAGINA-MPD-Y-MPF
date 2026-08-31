/**
 * Los textos de la pestaña principal. Ningún string suelto en componentes.
 *
 * Acá va sólo lo que existe. Cuando llegue la pestaña de inscripción se agrega
 * su tarjeta; hasta entonces no se anuncia, porque un «próximamente» es
 * exactamente lo que las reglas del proyecto prohíben.
 */
export const herramientas = {
  titulo: "Tus herramientas",
  bajada: "Todo lo que necesitás para preparar el ingreso, en un solo lugar.",
  items: [
    {
      destino: "/simulador",
      titulo: "Simulador de exámenes",
      texto:
        "Rendí con el formato, el tiempo y el criterio de corrección de cada organismo. Podés repetirlo las veces que quieras.",
      cta: "Practicar",
    },
    {
      destino: "/asistente",
      titulo: "Asistente de Ingreso Democrático",
      texto:
        "Preguntá lo que necesites sobre el concurso. Cada respuesta te dice de dónde sale, y si no hay con qué respaldarla te lo decimos en lugar de inventar.",
      cta: "Preguntar",
    },
  ],
} as const;
