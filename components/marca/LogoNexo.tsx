import Image from "next/image";

export function LogoNexo() {
  return (
    <Image
      src="/marca/nexo-logotipo-blanco.png"
      alt="Nexo Derecho"
      width={560}
      height={137}
      priority
      style={{ height: 19, width: "auto" }}
    />
  );
}
