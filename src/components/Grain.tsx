export function Grain({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <svg className="grain" aria-hidden="true" width="100%" height="100%" style={{ opacity }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}
