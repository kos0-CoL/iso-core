
export type Biome = 'Forest' | 'Meadow' | 'Mountain' | 'Lake' | 'River' | 'Hills' | 'Desert' | 'Tundra' | 'Jungle' | 'Swamp' | 'Snow' | 'Sierra' | 'Yunga' | 'Plain';

export interface WorldCell {
  x: number;
  y: number;
  biome: Biome;
  height: number;
  hasWater: boolean;
  isSown?: boolean; 
  sownDay?: number;
}

export type AgentType = 
  | 'Leñador' | 'Cocinera' | 'Niño' | 'Anciano' | 'Guardián' 
  | 'Artesano' | 'Héroe' | 'Líder' | 'Médico' | 'Bufón' | 'Explorador';

export interface AgentSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxLevel: number;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  era: 'Primitiva' | 'Agraria' | 'Industrial' | 'Atómica';
  requires: string[];
  cost: number;
  icon?: string;
}

export interface ExplorationLogEntry {
  day: number;
  message: string;
  discoveryType: 'Resource' | 'Threat' | 'Anomaly' | 'Landscape';
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  hunger: number;
  fatigue: number; 
  stress: number;  
  miedoResidual: number; 
  intelligence: number;
  inventiveness: number;
  strength: number; 
  dexterity: number; 
  trauma: number;
  sickness: number;
  poison: number;
  happiness: number;
  distrust: number;
  recoveryTicksRemaining: number;
  starvationTicks: number;
  pos: { x: number; y: number };
  currentTask: string;
  utilityScore: number;
  inputs: number[]; 
  neuroScores: Record<string, number>; 
  weightedSums: Record<string, number>;
  inventory: { wood: number; food: number; advanced: number; };
  rations: number;
  maxRations: number;
  maxInventory: number; 
  workTicksToday: number;
  factionId: string;
  customWeights?: Record<string, { weights: number[] }>;
  mastery: number; 
  taskProgress: number;
  interest: Record<string, number>;
  skills: AgentSkill[];
  actionTracking: Record<string, number>;
  vectorImpactTracking: Record<number, number>;
  observationIntensity: number; 
  explorationLog: ExplorationLogEntry[];
  direction: 'DOWN' | 'LEFT' | 'RIGHT' | 'UP' | 'IDLE';
}

export interface Resource {
  id: string;
  type: string;
  pos: { x: number; y: number };
  quantity: number;
  maxQuantity: number;
  renewability: number;
  isFruitBearing: boolean;
  age: number;
  harvestCount: number; 
  respawnDay?: number; 
  vectors: {
    dureza: number;
    calidad: number;
    densidad: number;
    valor: number;
  };
}

export type ThreatType = 'Bear' | 'Wolf' | 'Boar' | 'Rabbit' | 'Deer' | 'Scorpion' | 'Snake' | 'Jaguar' | 'Vulture';

export interface Threat {
  id: string;
  type: ThreatType;
  pos: { x: number; y: number };
  health: number;
  status: 'Idle' | 'Wandering' | 'Hunting' | 'Domesticated';
  targetId?: string;
  vectors: {
    peligro: number;
    agresividad: number;
    movimiento: number;
    nutricion: number;
    periodicidad: number;
    instintoCaza: number;
  };
  weights?: Record<string, number>;
}

export interface VillageEntity {
  id: string;
  name: string;
  pos: { x: number; y: number };
  vectors: { 
    defensa: number; 
    infraestructura: number; 
    almacenamiento: number; 
    mezquindad: number; 
    autoridad: number; 
  };
  stats: { 
    population: number; 
    food: number; 
    wood: number; 
    advanced: number; 
    morale: number; 
  };
  leaderId?: string;
  unlockedTechnologies: string[]; 
  currentEra: string;
  techProgress: number;
  consecutiveShortageCycles: number;
}

export type SocietyModel = 
  | 'CLASSIC' | 'STATIC' | 'EXPANSIONIST' | 'CHAOTIC' | 'REVOLUTIONARY' 
  | 'INDUSTRIALIZABLE' | 'UTOPIAN' | 'SURVIVALIST' | 'HEDONISTIC' | 'TECHNOCRATIC' | 'SPIRITUALIST';

export type MapType = 'RANDOM' | 'DESERT' | 'TROPICAL' | 'TUNDRA' | 'PLAIN' | 'YUNGA' | 'SIERRA' | 'MOUNTAIN';

export interface SimulationSettings {
  populationCount: number;
  dominance: number;
  societyModel: SocietyModel;
  mapType: MapType;
  randomizeIntent?: boolean;
}

export interface HistoryEntry {
  id: string;
  time: number;
  day: number;
  type: 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'ANUAL' | 'ERA' | 'EVENTO_CRITICO';
  message: string;
  details: {
    prevailingSigmoid: string;
    dominantVector: string;
    reason?: string;
    stats: any;
  };
}

export interface SimulationState {
  grid: WorldCell[][];
  agents: Agent[];
  resources: Resource[];
  threats: Threat[];
  villages: VillageEntity[]; 
  time: number;
  day: number;
  weather: { type: string; intensity: number; };
  luz: number;   
  paused: boolean;
  speed: number;
  settings: SimulationSettings;
  globalWeights: Record<string, number>;
  history: HistoryEntry[];
}
