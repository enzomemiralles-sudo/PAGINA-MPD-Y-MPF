/**
 * El data-marca se fija antes de pintar para que no se vea un parpadeo de la
 * piel anterior al entrar al login desde la landing.
 */
export default function LayoutIngreso({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('data-marca','neutro')`,
        }}
      />
      {children}
    </>
  );
}
