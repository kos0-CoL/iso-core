
/**
 * @fileOverview Definición del Atlas de Sprites para ISO CORE.
 * Mapea las regiones del spritesheet de 1536x1024 según especificación oficial.
 */

export interface SpriteRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
}

export const ATLAS_REGIONS: Record<string, SpriteRegion> = {
  ALDEANOS: { x: 0, y: 0, w: 470, h: 390, cols: 5, rows: 5 },
  ACCIONES: { x: 470, y: 0, w: 430, h: 390, cols: 5, rows: 2 },
  EDIFICIOS: { x: 900, y: 0, w: 636, h: 365, cols: 5, rows: 2 },
  RECURSOS: { x: 0, y: 365, w: 470, h: 270, cols: 4, rows: 3 },
  ANIMALES: { x: 470, y: 365, w: 430, h: 270, cols: 5, rows: 2 },
  TERRENO: { x: 900, y: 365, w: 636, h: 390, cols: 4, rows: 2 },
  OBJETOS: { x: 0, y: 635, w: 470, h: 110, cols: 7, rows: 1 },
  EFECTOS: { x: 470, y: 635, w: 430, h: 110, cols: 5, rows: 1 },
  VARIOS: { x: 900, y: 635, w: 636, h: 110, cols: 5, rows: 1 },
  ARMAS: { x: 0, y: 745, w: 470, h: 110, cols: 4, rows: 1 },
  INTERFAZ: { x: 470, y: 745, w: 430, h: 110, cols: 10, rows: 1 },
  CURSORES: { x: 900, y: 745, w: 636, h: 110, cols: 4, rows: 1 },
  CLIMA: { x: 0, y: 855, w: 900, h: 169, cols: 5, rows: 1 }
};

export type SpriteCategory = keyof typeof ATLAS_REGIONS;

/**
 * Obtiene las coordenadas de un frame específico dentro de una región.
 */
export function getSpriteFrame(category: SpriteCategory, col: number, row: number) {
  const region = ATLAS_REGIONS[category];
  if (!region) return { sx: 0, sy: 0, sw: 0, sh: 0 };
  
  const frameW = region.w / region.cols;
  const frameH = region.h / region.rows;
  
  return {
    sx: region.x + col * frameW,
    sy: region.y + row * frameH,
    sw: frameW,
    sh: frameH
  };
}

// Mapeos de ID a Frame
export const AGENT_TYPE_MAP: Record<string, number> = {
  'Leñador': 0,
  'Recolector': 1,
  'Mujer': 2,
  'Niño': 3,
  'Anciano': 4
};

export const DIRECTION_MAP: Record<string, number> = {
  'DOWN': 0,
  'LEFT': 1,
  'RIGHT': 2,
  'UP': 3,
  'IDLE': 4
};

export const ANIMAL_TYPE_MAP: Record<string, number> = {
  'Rabbit': 0,
  'Deer': 1,
  'Boar': 2,
  'Bear': 3,
  'Wolf': 4
};

// 0: Pasto, 1: Tierra, 2: Arena, 3: Agua, 4: Rocas, 5: Montañas, 6: Árboles, 7: Bosques
export const BIOME_SPRITE_MAP: Record<string, number> = {
  'Meadow': 0,
  'Plain': 0,
  'Hills': 1,
  'Desert': 2,
  'Snow': 3,
  'Water': 3,
  'Sierra': 4,
  'Mountain': 5,
  'Forest': 7,
  'Jungle': 7
};
