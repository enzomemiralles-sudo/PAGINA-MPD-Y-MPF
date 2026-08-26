import { AplicarPiel } from "@/components/marca/AplicarPiel";

/** El ingreso es neutro y claro: es la puerta de entrada a la app. */
export default function LayoutIngreso({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AplicarPiel marca="neutro" superficie="clara" />
      {children}
    </>
  );
}
