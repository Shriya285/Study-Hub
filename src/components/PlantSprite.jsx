import { useState, useEffect } from 'react'
import { SPRITE_CONFIG } from '../constants/plantSprites'

export function PlantSprite({ type, t, size = 160, deathProgress = 0 }) {
  const config = SPRITE_CONFIG[type]
  if (!config) return null

  const { cols, rows, totalFrames } = config
  const frameIndex = Math.min(Math.floor(t * totalFrames), totalFrames - 1)

  const [displayFrame, setDisplayFrame] = useState(frameIndex)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (frameIndex === displayFrame) return
    setFading(true)
    const timer = setTimeout(() => {
      setDisplayFrame(frameIndex)
      setFading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [frameIndex])

  const col = displayFrame % cols
  const row = Math.floor(displayFrame / cols)
  const bgXPct = cols > 1 ? (col / (cols - 1)) * 100 : 0
  const bgYPct = rows > 1 ? (row / (rows - 1)) * 100 : 0

  const deathFilter = deathProgress > 0
    ? `grayscale(${deathProgress * 0.85}) brightness(${1 - deathProgress * 0.3}) sepia(${deathProgress * 0.3})`
    : 'none'

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/plants/${type}_transparent.png)`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${bgXPct}% ${bgYPct}%`,
        backgroundRepeat: 'no-repeat',
        opacity: fading ? 0.6 : 1,
        filter: deathFilter,
        transform: deathProgress > 0 ? `rotate(${deathProgress * -8}deg)` : 'none',
        transformOrigin: 'bottom center',
        transition: 'opacity 0.3s ease, filter 0.5s ease, transform 0.5s ease',
      }}
    />
  )
}
