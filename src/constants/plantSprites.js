// Grid layout determined by reading sprite sheets with vision.
// All sheets are 1024×1536 px. Each cell is 256×256 (4-col sheets) or 256×307 (4×5 sheets).
export const SPRITE_CONFIG = {
  cactus: { cols: 4, rows: 6, totalFrames: 23 }, // last cell (row 6, col 4) is empty
  pine:   { cols: 4, rows: 6, totalFrames: 24 },
  flower: { cols: 4, rows: 5, totalFrames: 20 },
  bamboo: { cols: 4, rows: 5, totalFrames: 20 },
}

export const PLANT_LABELS = {
  cactus: 'Cactus',
  pine:   'Pine',
  flower: 'Flower',
  bamboo: 'Bamboo',
}
