
import { 
  SimulationState, WorldCell, Agent, Resource, Threat, 
  SimulationSettings, AgentType, SocietyModel, MapType,
  Biome, ThreatType, AgentSkill, HistoryEntry, VillageEntity, Technology, ExplorationLogEntry
} from './simulation-types';

export const WORLD_SIZE = 100;

export const TECH_TREE: Technology[] = [
  { id: 'fuego', name: 'Dominio del Fuego', description: 'Base de la civilización y protección térmica.', era: 'Primitiva', requires: [], cost: 100 },
  { id: 'lanzas', name: 'Lanzas de Madera', description: 'Caza más eficiente y defensa básica.', era: 'Primitiva', requires: ['fuego'], cost: 150 },
  { id: 'arcos', name: 'Arcos y Flechas', description: 'Caza a distancia y superioridad táctica.', era: 'Primitiva', requires: ['lanzas'], cost: 300 },
  { id: 'granja', name: 'Granja Primitiva', description: 'Domestica animales y estabiliza el alimento.', era: 'Primitiva', requires: ['arcos'], cost: 400 },
  { id: 'remiembra', name: 'Silvicultura Básica', description: 'Plantar árboles frutales para el futuro.', era: 'Primitiva', requires: ['granja'], cost: 500 },
  { id: 'carreta', name: 'Carreta de Madera', description: 'Gran capacidad de transporte de recursos.', era: 'Agraria', requires: ['arcos'], cost: 600 },
  { id: 'vivienda', name: 'Vivienda Reforzada', description: 'Aísla del frío y reduce el estrés nocturno.', era: 'Agraria', requires: ['fuego'], cost: 350 },
  { id: 'fragua', name: 'Fragua de Piedra', description: 'Permite trabajar metales y herramientas de acero.', era: 'Industrial', requires: ['carreta', 'vivienda'], cost: 1000 },
  { id: 'espadas', name: 'Espadas de Acero', description: 'Supremacía militar absoluta contra fauna.', era: 'Industrial', requires: ['fragua'], cost: 2000 },
  { id: 'molino', name: 'Molino de Viento', description: 'Energía renovable básica para procesar granos.', era: 'Industrial', requires: ['carreta'], cost: 1500 }
];

export const INITIAL_SKILLS: AgentSkill[] = [
  { id: 'tala', name: 'Tala Eficiente', level: 1, experience: 0, maxLevel: 10 },
  { id: 'caza', name: 'Rastreo Primal', level: 1, experience: 0, maxLevel: 10 },
  { id: 'cocina', name: 'Nutrición Óptima', level: 1, experience: 0, maxLevel: 10 },
  { id: 'defensa', name: 'Resiliencia de Escudo', level: 1, experience: 0, maxLevel: 10 },
  { id: 'exploracion', name: 'Cartografía Mental', level: 1, experience: 0, maxLevel: 10 }
];

const W_CHARLAR = [
  -1.0, 0, 0, -0.5, -0.5, -2.0, 3.0, 1.5, 0.8, 2.5, 0, 0, 0, 0, 1.5, -0.5, 4.0, 0.5, 1.0, 0, 
  -1.0, -1.0, -1.0, 0, 0, 0.5, 0, 0, 0, 0, 2.0, -0.5, 2.0, 5.0, 0.5, 0, 3.0, -3.0, 8.0, 0
];

export const BRAIN_WEIGHTS: Record<string, any> = {
  leñador: {
    huir: { weights: [5.5, 0.4, 0.6, 0.1, 0.1, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.0, -6.5, 0, -0.7, 0.1, 0.9, 0.5, 0.5, 0, 0, 0, 0, 0, 0.5, 0, -4.0, -5.5, 0, 0, 0, 0, -1.0, 2.0, 0, 0], bias: -0.2 },
    defensa: { weights: [2.5, 0, 0, 0, 0, 0.5, 2.0, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 2.0, 0.5, 0.5, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0.5, 6.5, 8.0, 2.0, 0, 0, 0, 0, 0, 0, 0, 0], bias: 0.2 },
    talar: { weights: [-3.0, -0.3, -0.2, -5.0, -0.6, -0.1, 0.5, 0, 0, 0, 6.5, 0.5, 1.5, 1.5, 0, -1.5, 2.5, 0.2, 0.4, -0.5, -0.8, -0.5, -0.5, 1.0, 0.1, 0, 0, 0.5, 0.8, 0.2, 0, -8.0, -1.0, -1.0, -2.0, -1.0, 0, 0, 0, 0], bias: 1.5 },
    recolectar: { weights: [-2.5, -0.2, -0.1, -4.0, -0.5, 0, 0.5, 0, 0, 0, 0.5, 8.5, 0, 2.0, 0, -1.0, 2.0, 0.2, 0.3, 0, 0, 0, 0, 0.8, 0.2, 0, 0, 0.5, 3.5, 1.5, 0, -8.0, -0.5, -0.5, -1.5, -0.5, 0, 0, 0, 0], bias: 2.2 },
    retorno: { weights: [0.1, 0.5, 1.0, 25.0, 3.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 15.0, 0, 3.5, -5.0, 0, 0, 0.4, 0.5, 1.5, 1.5, 1.0, 0.5, 0, 0, 0, 15.0, 2.5, 12.0, 25.0, -2.0, -2.0, -5.0, -2.0, -1.0, 0, 0, 0], bias: 2.0 },
    explorar: { weights: [-1.0, 0.5, 0, -2.0, 0, 0, -1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 2.5, 0, 0, 0, 0, 0, 0, 1.0, 0.8, 0, 0.5, 0, 0, 1.5, -5.0, 12.0, 8.0, 18.0, 15.0, 0, 0, 0, 0], bias: 1.0 },
    charlar: { weights: W_CHARLAR, bias: -4.0 }
  },
  explorador: {
    explorar: { weights: [-1.0, 0.8, 0, -1.0, 0, 0, -0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.0, 4.5, 0, 0, 0, 0, 0, 0, 2.5, 1.5, 0.8, 1.5, 0, 0, 5.0, -2.0, 25.0, 15.0, 20.0, 30.0, 0, 0, 0, 0], bias: 5.0 },
    huir: { weights: [5.5, 0.4, 0.6, 0.1, 0.1, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.0, -6.5, 0, -0.7, 0.1, 0.9, 0.5, 0.5, 0, 0, 0, 0, 0, 0.5, 0, -4.0, -5.5, 0, 0, 0, 0, -1.0, 2.0, 0, 0], bias: -0.2 },
    retorno: { weights: [0.1, 0.5, 1.0, 25.0, 3.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 15.0, 0, 3.5, -5.0, 0, 0, 0.4, 0.5, 1.5, 1.5, 1.0, 0.5, 0, 0, 0, 15.0, 2.5, 12.0, 25.0, -2.0, -2.0, -5.0, -2.0, -1.0, 0, 0, 0], bias: 2.0 }
  },
  cocinera: {
    defensa: { weights: [1.5, 0, 0, 0, 0, 0.2, 3.0, 4.0, 0, 0, 0, 0, 0, 0, 0, 1.0, 3.5, 0.3, 0.8, 0, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 6.0, 6.0, 1.5, 0, 0, 0, 0, 0, 0, 0, 0], bias: 0.1 },
    recolectar: { weights: [-1.0, -0.1, 0.5, -2.0, 0, 0, 1.0, 0.5, 0, 0, 0, 10.5, 0, 4.0, 0, -1.5, 3.0, 0.2, 0.5, 0, 0, 0, 0, 1.0, 0, 0, 0, 0.5, 12.0, 3.5, 0, -5.0, -1.0, -1.0, -2.0, -1.0, 0, 0, 0, 0], bias: 3.5 },
    huir: { weights: [6.5, 0.5, 1.2, 0.2, 0, 1.0, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 4.0, -7.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2.0, -6.0, 0, 0, 0, 0, -1.0, 2.5, 0, 0], bias: 1.0 },
    retorno: { weights: [0.1, 0.5, 1.0, 28.0, 2.5, 0.3, 0, 0, 0, 0, 0, 0, 0, 12.0, 0, 2.0, -3.5, 0, 0, 0, 0, 1.5, 1.5, 1.0, 0, 0, 0, 0, 18.0, 3.0, 15.0, 28.0, -2.0, -2.0, -5.0, -2.0, -1.0, 0, 0, 0], bias: 2.5 },
    explorar: { weights: [-1.0, 0.2, 0, -2.0, 0, 0, -0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.2, 2.0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0, 0.3, 0, 0, 1.2, -4.0, 8.0, 6.0, 12.0, 10.0, 0, 0, 0, 0], bias: -0.5 },
    charlar: { weights: W_CHARLAR, bias: -3.0 }
  },
  guardián: {
    defensa: { weights: [8.5, 0.2, -0.8, 0, 0, 1.5, 1.5, 1.5, 1.0, 0.5, 0, 0, 0, 0, 1.0, 3.5, 4.0, 0.5, 1.0, -0.2, 0.5, 0.2, 0.2, 0.8, 0, 0.2, 0.1, 0.1, 0, 10.0, 12.0, 12.0, -1.0, -1.0, -2.0, -1.0, 0, 0, 0, 0], bias: 3.5 },
    huir: { weights: [2.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.0, -9.5, 0, -1.5, 0.3, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2.5, -4.0, 0, 0, 0, 0, 0, 1.0, 0, 0], bias: -2.5 },
    retorno: { weights: [0, 0.2, 0.5, 20.0, 2.5, 1.5, 0, 0, 0, 0, 0, 0, 0, 10.0, 0, 2.5, -2.5, 0, 0, 0, 1.2, 1.5, 1.5, 1.0, 0, 0, 0, 0, 15.0, 2.0, 18.0, 25.0, -2.0, -2.0, -5.0, -2.0, 0, 0, 0, 0], bias: 1.0 },
    charlar: { weights: W_CHARLAR, bias: -6.0 }
  },
  niño: {
    huir: { weights: [12.0, 1.5, 2.0, 0, 0, 4.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6.0, -10.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -10.0, -12.0, 0, 0, 0, 0, 0, 0, 0, 0], bias: 5.5 },
    defensa: { weights: [-8.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.0, 2.0, 0.1, 0, 0, 0, 0, 0, 0, 0, 0], bias: -4.0 },
    retorno: { weights: [2.0, 1.5, 2.5, 25.0, 3.0, 2.0, 0, 0, 0, 0, 0, 0, 0, 8.0, 0, 0, -4.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15.0, 1.0, 5.0, 30.0, 0, 0, 0, 0, 0, 0, 0, 0], bias: 3.5 },
    charlar: { weights: W_CHARLAR, bias: 0.5 }
  },
  anciano: {
    huir: { weights: [10.0, 2.0, 2.5, 0, 0, 3.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5.0, -8.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -6.0, -8.0, 0, 0, 0, 0, 0, 0, 0, 0], bias: 4.5 },
    defensa: { weights: [2.0, 0, 0, 0, 0, 0.5, 2.0, 0, 2.0, 0, 0, 0, 0, 0, 0, 2.0, 3.0, 1.0, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5.0, 4.0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0], bias: 0.5 },
    retorno: { weights: [2.0, 1.0, 2.0, 22.0, 4.0, 3.0, 0, 0, 0, 0, 0, 0, 0, 6.0, 0, 0, -3.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18.0, 2.0, 10.0, 25.0, 0, 0, 0, 0, 0, 0, 0, 0], bias: 3.5 },
    charlar: { weights: W_CHARLAR, bias: 0.2 }
  }
};

export const INPUT_LABELS = [
  "Peligro Inmediato", "Clima Hostil", "Oscuridad (Luz)", "Hambre Crítica", "Fatiga", "Trauma Agudo", "Aliados Cercanos", "Niños Cerca", "Líderes Cerca", "Vínculo Afectivo",
  "Madera Prox", "Comida Prox", "Roca Prox", "Almacén Vacío", "Ritual Activo", "Miedo Residual (Memoria)", "Zona Segura (Cohesión)", "Inteligencia ($X_{18}$)",
  "Aura Social", "Dificultad Terreno", "Trauma Acumulado", "Enfermedad", "Veneno", "Gravedad Global", "Densidad Bosque", "Nivel Tecnológico", "Asombro", "Inventiva ($X_{28}$)",
  "Instinto Supervivencia", "Cohesión de Grupo", "Comunidad (Ayuda) ($X_{30}$)", "Salud Crítica ($X_{31}$)", "Determinación ($X_{32}$)", "Curiosidad", "Monotonía", "Exploración", "Novedad",
  "Felicidad", "Desconfianza", "Afinidad de Rol"
];

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function calculateAgentBrain(agent: Agent, state: SimulationState, currentInputs?: number[]) {
  const typeKey = agent.type.toLowerCase();
  const brainKey = BRAIN_WEIGHTS[typeKey] ? typeKey : 'leñador';
  const baseBrain = BRAIN_WEIGHTS[brainKey];
  
  const inputsToUse = currentInputs || agent.inputs;
  
  const currentInv = agent.inventory.food + agent.inventory.wood + agent.inventory.advanced;
  if (currentInv >= agent.maxInventory) {
    inputsToUse[13] = 1.0; 
    inputsToUse[3] = 0.5; 
  }

  // Influencia de las habilidades en el Vector X40 (Afinidad de Rol)
  // Calculamos el promedio de nivel de las habilidades relevantes para su tipo
  const relevantSkillIds = typeKey === 'leñador' ? ['tala'] : 
                           typeKey === 'cocinera' ? ['cocina'] : 
                           typeKey === 'guardián' ? ['defensa'] : 
                           typeKey === 'explorador' ? ['exploracion'] : ['exploracion'];
  
  const relevantSkills = agent.skills.filter(s => relevantSkillIds.includes(s.id));
  const avgSkillLevel = relevantSkills.reduce((sum, s) => sum + s.level, 0) / (relevantSkills.length || 1);
  inputsToUse[39] = Math.min(1.0, (avgSkillLevel - 1) * 0.1 + (agent.mastery * 0.5));

  let mejorAccion = agent.currentTask || 'RETORNO';
  let maxOutput = -Infinity;
  let dominantIdx = -1;

  for (const [actionName, params] of Object.entries(baseBrain)) {
    let suma = (params as any).bias;
    const weights = (params as any).weights;
    
    let localMaxImpact = -Infinity;
    let localDominantIdx = -1;

    for (let i = 0; i < weights.length; i++) {
      const weightVal = weights[i] || 0;
      const inputVal = inputsToUse[i] || 0;
      suma += weightVal * inputVal;

      const impact = Math.abs(weightVal * inputVal);
      if (impact > localMaxImpact) {
        localMaxImpact = impact;
        localDominantIdx = i;
      }
    }

    let output = sigmoid(suma);
    if (output > maxOutput) {
      maxOutput = output;
      mejorAccion = actionName;
      dominantIdx = localDominantIdx;
    }
  }

  return { task: mejorAccion.toUpperCase(), dominantIdx, score: maxOutput };
}

export function createInitialState(settings: SimulationSettings): SimulationState {
  const grid: WorldCell[][] = [];
  const biomeSeeds: any[] = [];
  
  const count = 25 + Math.floor(Math.random() * 10);
  for (let i = 0; i < count; i++) {
    let type: Biome = 'Meadow';
    if (settings.mapType === 'DESERT') type = 'Desert';
    else if (settings.mapType === 'TUNDRA') type = 'Snow';
    else if (settings.mapType === 'MOUNTAIN') type = 'Sierra';
    else if (settings.mapType === 'RANDOM') {
      const r = Math.random();
      if (r > 0.85) type = 'Desert';
      else if (r > 0.7) type = 'Forest';
      else if (r > 0.5) type = 'Sierra';
      else if (r > 0.3) type = 'Hills';
      else type = 'Meadow';
    } else {
      type = 'Meadow';
    }
    biomeSeeds.push({ x: Math.random() * WORLD_SIZE, y: Math.random() * WORLD_SIZE, type, r: 10 + Math.random() * 25 });
  }

  for (let x = 0; x < WORLD_SIZE; x++) {
    grid[x] = [];
    for (let y = 0; y < WORLD_SIZE; y++) {
      let closestBiome: Biome = 'Meadow';
      let minDist = 999;
      biomeSeeds.forEach(seed => {
        const d = Math.hypot(seed.x - x, seed.y - y);
        if (d < seed.r && d < minDist) { minDist = d; closestBiome = seed.type; }
      });
      grid[x][y] = { x, y, biome: closestBiome, height: Math.random(), hasWater: false };
    }
  }

  const isDesertMap = settings.mapType === 'DESERT';
  const waterLimit = isDesertMap ? 0.05 : 0.10; 
  const maxWaterTiles = WORLD_SIZE * WORLD_SIZE * waterLimit;
  let waterCount = 0;

  const waterSeedsCount = isDesertMap ? 2 : 5;
  const waterSeeds: {x: number, y: number}[] = [];
  for(let i=0; i<waterSeedsCount; i++) {
    let sx, sy;
    do {
      sx = Math.floor(Math.random() * WORLD_SIZE);
      sy = Math.floor(Math.random() * WORLD_SIZE);
    } while (Math.hypot(sx - 50, sy - 50) < 25); 
    waterSeeds.push({ x: sx, y: sy });
  }

  const queue = [...waterSeeds];
  const safeRadius = 20; 
  while (queue.length > 0 && waterCount < maxWaterTiles) {
    const {x, y} = queue.shift()!;
    if (x >= 0 && x < WORLD_SIZE && y >= 0 && y < WORLD_SIZE && !grid[x][y].hasWater) {
      const distToVillage = Math.hypot(x - 50, y - 50);
      if (distToVillage < safeRadius) continue;

      grid[x][y].hasWater = true;
      waterCount++;
      const neighbors = [{x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1}];
      neighbors.forEach(n => { if (Math.random() < 0.8) queue.push(n); });
    }
  }

  const agents: Agent[] = [];
  const roles: AgentType[] = ['Leñador', 'Cocinera', 'Niño', 'Anciano', 'Guardián', 'Explorador'];
  for (let i = 0; i < settings.populationCount; i++) {
    const type = roles[i % roles.length];
    const strength = 0.5 + Math.random() * 0.5;
    agents.push({
      id: `a-${i}`, name: `${type} ${i + 1}`, type,
      level: 1, experience: 0, health: 100, maxHealth: 100, hunger: 10, fatigue: 0, stress: 0, miedoResidual: 0, 
      intelligence: 0.4 + Math.random() * 0.5, inventiveness: 0.1,
      strength, dexterity: 0.5 + Math.random() * 0.5,
      trauma: 0, sickness: 0, poison: 0, happiness: 50, distrust: 10, recoveryTicksRemaining: 0, starvationTicks: 0,
      pos: { x: 50 + (Math.random() - 0.5) * 8, y: 50 + (Math.random() - 0.5) * 8 },
      currentTask: 'IDLE', utilityScore: 0, inputs: new Array(40).fill(0),
      neuroScores: {}, weightedSums: {}, 
      inventory: { wood: 0, food: 0, advanced: 0 },
      rations: 100,
      maxRations: 100,
      maxInventory: Math.min(50, 20 + Math.floor(strength * 30)),
      factionId: 'v-1', mastery: 0.2,
      workTicksToday: 0,
      taskProgress: 0,
      interest: { HUIR: 1.0, TALAR: 1.0, CAZA: 1.0, RETORNO: 1.0, GRANJA: 1.0, RECOLECTAR: 1.0, EXPLORAR: 1.0, CHARLAR: 1.0, DEFENSA: 1.0 },
      skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
      actionTracking: {},
      vectorImpactTracking: {},
      observationIntensity: 0.3,
      explorationLog: [],
      direction: 'IDLE'
    });
  }

  const resources: Resource[] = [];
  for (let f = 0; f < 35; f++) {
    const centerX = Math.random() * 100;
    const centerY = Math.random() * 100;
    const isRockField = Math.random() > 0.85; 
    for (let i = 0; i < 20; i++) {
      const type = isRockField ? 'Rock' : (Math.random() > 0.5 ? 'Berry' : 'Oak');
      resources.push({
        id: `r-${f}-${i}`, type,
        pos: { x: Math.max(0, Math.min(99, centerX + (Math.random()-0.5)*15)), y: Math.max(0, Math.min(99, centerY + (Math.random()-0.5)*15)) },
        quantity: 500, maxQuantity: 500, renewability: 0.5, isFruitBearing: type === 'Berry', age: Math.random() * 100,
        harvestCount: 0,
        vectors: { dureza: type === 'Rock' ? 0.9 : 0.4, calidad: Math.random(), densidad: 0.8, valor: type === 'Rock' ? 0.9 : 0.3 }
      });
    }
  }

  const threats: Threat[] = [];
  const types: ThreatType[] = ['Rabbit', 'Deer', 'Boar', 'Wolf', 'Bear'];
  for (let i = 0; i < 50; i++) {
    const type = types[i % types.length];
    threats.push({
      id: `t-${i}`, type,
      pos: { x: Math.random() * 99, y: Math.random() * 99 },
      health: 100, status: 'Idle',
      vectors: { 
        peligro: ['Wolf', 'Bear', 'Jaguar'].includes(type) ? 0.8 : 0.2, 
        agresividad: ['Wolf', 'Bear', 'Boar'].includes(type) ? 0.7 : 0.1, 
        movimiento: 0.5, nutricion: 80, periodicidad: 0.5,
        instintoCaza: ['Wolf', 'Bear'].includes(type) ? 0.9 : 0
      },
    });
  }

  return {
    grid, agents, resources, threats, 
    villages: [{
      id: 'v-1', name: 'Aldea Alpha', pos: { x: 50, y: 50 },
      vectors: { defensa: 0.2, infraestructura: 0.3, almacenamiento: 0.5, mezquindad: 0.1, autoridad: 0.8 },
      stats: { population: settings.populationCount, food: 2000, wood: 2000, advanced: 500, morale: 100 },
      leaderId: 'a-0',
      unlockedTechnologies: ['fuego'], currentEra: 'Primitiva', techProgress: 0,
      consecutiveShortageCycles: 0
    }],
    time: 0, day: 1, weather: { type: 'Sunny', intensity: 0.5 }, luz: 1.0, paused: false, speed: 1, settings,
    globalWeights: { hambre_impacto: 1.0, panico_resilience: 0.6, inventiva_threshold: 0.4 },
    history: []
  };
}

export function generateHistoryReport(state: SimulationState, type: HistoryEntry['type'], reason?: string): HistoryEntry {
  const stats = state.villages[0]?.stats || { food: 0, wood: 0, pop: 0 };
  const message = reason ? `Evento Crítico: ${reason}` : `Registro Diario: Biosfera Alpha estable. Población activa: ${state.agents.length}.`;
  return {
    id: `h-${Date.now()}`,
    time: state.time, day: state.day, type,
    message,
    details: { prevailingSigmoid: 'SUBSISTENCIA', dominantVector: 'Supervivencia', reason, stats: { ...stats, pop: state.agents.length } }
  };
}
