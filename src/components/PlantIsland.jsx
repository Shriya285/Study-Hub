import { PlantSprite } from './PlantSprite'

export default function PlantIsland({ plantType = 'cactus', t = 0, deathProgress = 0, size = 220 }) {
  const islandR  = size * 0.36
  const cx       = size / 2
  const cy       = size * 0.74
  const spriteSize = islandR * 1.5

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* SVG soil island base */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* Shadow */}
        <ellipse cx={cx} cy={cy + 6} rx={islandR * 0.9} ry={islandR * 0.28} fill="rgba(0,0,0,0.18)" />
        {/* Soil top surface */}
        <ellipse cx={cx} cy={cy} rx={islandR} ry={islandR * 0.36} fill="#8B6347" />
        {/* Lighter top sheen */}
        <ellipse cx={cx} cy={cy - 3} rx={islandR * 0.85} ry={islandR * 0.22} fill="#A0784D" />
      </svg>

      {/* Plant sprite — positioned so base sits on soil */}
      <div style={{
        position: 'absolute',
        left: cx - spriteSize / 2,
        top: cy - spriteSize * 0.82,
        width: spriteSize,
        height: spriteSize,
      }}>
        <PlantSprite
          type={plantType}
          t={t}
          size={spriteSize}
          deathProgress={deathProgress}
        />
      </div>
    </div>
  )
}
