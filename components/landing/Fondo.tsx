export function Fondo() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="ruido">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="r" />
          <feDisplacementMap in="SourceGraphic" in2="r" scale="3" />
        </filter>
      </svg>

      <div className="fondo" aria-hidden="true">
        <div className="mancha a" />
        <div className="mancha b" />
        <svg className="grano" width="100%" height="100%">
          <filter id="g">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#g)" />
        </svg>
      </div>

      <div className="riel izq" aria-hidden="true" />
      <div className="riel der" aria-hidden="true" />
    </>
  );
}
