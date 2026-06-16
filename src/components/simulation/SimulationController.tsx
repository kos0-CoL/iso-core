"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SimulationState, SimulationSettings, Agent, HistoryEntry, Resource, Threat, WorldCell } from '@/lib/simulation-types';
import { createInitialState, calculateAgentBrain, generateHistoryReport, WORLD_SIZE } from '@/lib/simulation-logic';
import { IsometricCanvas } from './IsometricCanvas';
import { StatsPanel } from './StatsPanel';
import { InspectorPanel } from './InspectorPanel';
import { DivineTerminal } from './DivineTerminal';
import { HistoryPanel } from './HistoryPanel';
import { useToast } from "@/hooks/use-toast";
import { audioManager } from '@/lib/audio-manager';
// 🔧 Importar la ventana de Tauri para escuchar eventos de redimensionado
import { appWindow } from '@tauri-apps/api/window';

export const SimulationController: React.FC<{ initialSettings: SimulationSettings; onExit: () => void }> = ({ initialSettings, onExit }) => {
  const [state, setState] = useState<SimulationState | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; id: string } | null>(null);
  const [cameraFocus, setCameraFocus] = useState<{ x: number; y: number; zoom: number; timestamp: number } | null>(null);
  const [historyTab, setHistoryTab] = useState<string | null>(null);
  const { toast } = useToast();

  const agentExplorationTargets = useRef<Record<string, { x: number, y: number }>>({});
  const threatTargets = useRef<Record<string, { x: number, y: number }>>({});

  // 🔧 Estado para forzar un re-render cuando sea necesario
  const [, forceUpdate] = useState(0);

  // 🔧 Efecto para corregir el layout inicial y responder a cambios de tamaño
  useEffect(() => {
    // Forzar un reflow después de que la ventana esté completamente cargada/maximizada
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      forceUpdate(n => n + 1);
    }, 150);

    // Escuchar cambios de tamaño de la ventana de Tauri (cuando el usuario maximiza o redimensiona)
    let unlistenResize: (() => void) | undefined;
    appWindow.onResized().then(unlisten => {
      unlistenResize = unlisten;
      window.dispatchEvent(new Event('resize'));
      forceUpdate(n => n + 1);
    });

    return () => {
      clearTimeout(timeout);
      if (unlistenResize) unlistenResize();
    };
  }, []);

  useEffect(() => {
    const initialState = createInitialState(initialSettings);
    setState({ ...initialState, time: 0 });
    audioManager.startAmbient();
  }, [initialSettings]);

  useEffect(() => {
    if (state) {
      audioManager.updateAmbientTheme(state.luz);
    }
  }, [state?.luz]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setState(prev => {
          if (!prev) return null;
          const newPaused = !prev.paused;
          if (newPaused) {
            setHistoryTab("DIARIO");
            audioManager.playUi('menu_open');
          } else {
            setHistoryTab(null);
            audioManager.playUi('menu_close');
          }
          return { ...prev, paused: newPaused };
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (selectedEntity) {
      audioManager.playUi('select');
      audioManager.resumeAmbient();
    }
  }, [selectedEntity]);

  const updateSimulation = useCallback(() => {
    setState(prev => {
      if (!prev || prev.paused) return prev;
      
      const simSpeed = prev.speed;
      const newTime = prev.time + simSpeed;
      const dayLength = 2400;
      const currentDay = Math.floor(newTime / dayLength) + 1;
      const isNewDay = (newTime % dayLength) < simSpeed;
      
      const newLuz = Math.max(0.1, 0.5 + 0.5 * Math.cos(((newTime % dayLength) / dayLength) * 2 * Math.PI));
      const updatedVillage = { ...prev.villages[0], stats: { ...prev.villages[0].stats } };
      
      const newGrid = prev.grid.map(row => row.map(cell => {
        if (cell.isSown && cell.sownDay && currentDay >= cell.sownDay + 7) {
           updatedVillage.stats.food += 50;
           return { ...cell, isSown: false, sownDay: undefined };
        }
        return cell;
      }));

      const newResources = prev.resources.map(r => {
        if (r.respawnDay && currentDay < r.respawnDay) return r;
        if (r.respawnDay && currentDay >= r.respawnDay) {
          return { ...r, quantity: r.maxQuantity, harvestCount: 0, respawnDay: undefined };
        }
        return {
          ...r,
          quantity: Math.min(r.maxQuantity, r.quantity + r.renewability * 0.4 * simSpeed),
          age: r.age + 0.01 * simSpeed
        };
      });

      const communityHelpTriggers: Record<string, boolean> = {};
      const newHistory = [...prev.history];
      const listenerPos = cameraFocus ? { x: cameraFocus.x, y: cameraFocus.y } : { x: 50, y: 50 };

      const newThreats = prev.threats.map(threat => {
        if (threat.health <= 0) return threat;
        let newPos = { ...threat.pos };
        let currentHealth = threat.health;
        const moveSpeed = 0.8 * simSpeed;

        const isPredator = ['Wolf', 'Bear', 'Jaguar'].includes(threat.type);
        const nearestAgent = prev.agents.reduce((best, a) => {
          const d = Math.hypot(a.pos.x - threat.pos.x, a.pos.y - threat.pos.y);
          return d < best.d ? {a, d} : best;
        }, {a: null as Agent | null, d: isPredator ? 20 : 10});

        const defendingAgents = prev.agents.filter(a => 
          a.currentTask === 'DEFENSA' && 
          Math.hypot(a.pos.x - threat.pos.x, a.pos.y - threat.pos.y) < 2.0
        );

        if (defendingAgents.length > 0) {
          const totalDps = defendingAgents.reduce((sum, a) => {
            const baseDps = a.type === 'Guardián' ? 8 : a.type === 'Niño' ? 0.2 : a.type === 'Anciano' ? 2 : 4;
            return sum + (baseDps * (1 + a.mastery));
          }, 0);
          currentHealth -= totalDps * simSpeed;
        }
        
        if (isPredator && nearestAgent.a) {
          const distToVillage = Math.hypot(threat.pos.x - updatedVillage.pos.x, threat.pos.y - updatedVillage.pos.y);
          if (distToVillage > 12) {
            const dx = nearestAgent.a.pos.x - threat.pos.x;
            const dy = nearestAgent.a.pos.y - threat.pos.y;
            const dist = Math.hypot(dx, dy);
            const nextX = threat.pos.x + (dx / dist) * moveSpeed;
            const nextY = threat.pos.y + (dy / dist) * moveSpeed;
            const gx = Math.floor(nextX), gy = Math.floor(nextY);
            if (gx >= 0 && gx < WORLD_SIZE && gy >= 0 && gy < WORLD_SIZE && !newGrid[gx][gy].hasWater) {
              newPos.x = nextX;
              newPos.y = nextY;
            }
            if (dist < 3.0) {
              communityHelpTriggers[nearestAgent.a.id] = true;
              if (Math.random() < 0.01) audioManager.playSpatial('wolf_growl', threat.pos, listenerPos);
            }
          } else {
            const dx = threat.pos.x - updatedVillage.pos.x;
            const dy = threat.pos.y - updatedVillage.pos.y;
            const dist = Math.hypot(dx, dy);
            const nextX = threat.pos.x + (dx / dist) * moveSpeed;
            const nextY = threat.pos.y + (dy / dist) * moveSpeed;
            const gx = Math.floor(nextX), gy = Math.floor(nextY);
            if (gx >= 0 && gx < WORLD_SIZE && gy >= 0 && gy < WORLD_SIZE && !newGrid[gx][gy].hasWater) {
              newPos.x = nextX;
              newPos.y = nextY;
            }
          }
        } else {
          let target = threatTargets.current[threat.id];
          if (!target || Math.hypot(target.x - threat.pos.x, target.y - threat.pos.y) < 2) {
            target = { 
              x: Math.max(0, Math.min(99, threat.pos.x + (Math.random() - 0.5) * 40)), 
              y: Math.max(0, Math.min(99, threat.pos.y + (Math.random() - 0.5) * 40)) 
            };
            threatTargets.current[threat.id] = target;
          }
          const dx = target.x - threat.pos.x;
          const dy = target.y - threat.pos.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0.5) {
            const nextX = threat.pos.x + (dx / dist) * (moveSpeed * 0.5);
            const nextY = threat.pos.y + (dy / dist) * (moveSpeed * 0.5);
            const gx = Math.floor(nextX), gy = Math.floor(nextY);
            if (gx >= 0 && gx < WORLD_SIZE && gy >= 0 && gy < WORLD_SIZE && !newGrid[gx][gy].hasWater) {
              newPos.x = nextX;
              newPos.y = nextY;
            }
          }
        }
        return { ...threat, pos: newPos, health: Math.max(0, currentHealth) };
      });

      let footstepPlayedThisTick = false;

      const newAgents = prev.agents.map(agent => {
        if (agent.health <= 0) return agent;

        const inputs = [...agent.inputs];
        const distToVillage = Math.hypot(agent.pos.x - updatedVillage.pos.x, agent.pos.y - updatedVillage.pos.y);
        const inVillage = distToVillage < 8;

        if (inVillage && Math.random() < 0.01 * simSpeed) {
          const tx = Math.floor(agent.pos.x);
          const ty = Math.floor(agent.pos.y);
          if (newGrid[tx]?.[ty] && !newGrid[tx][ty].isSown && !newGrid[tx][ty].hasWater) {
            newGrid[tx][ty].isSown = true;
            newGrid[tx][ty].sownDay = currentDay;
          }
        }
        
        const alliesInRange = prev.agents.filter(a => a.id !== agent.id && a.health > 0 && Math.hypot(a.pos.x - agent.pos.x, a.pos.y - agent.pos.y) < 12).length;
        const safeZone = Math.min(1.0, (alliesInRange * 0.2) + (inVillage ? 0.8 : 0));
        inputs[16] = safeZone;

        const woods = newResources.filter(r => r.type === 'Oak' && r.quantity > 0 && !r.respawnDay);
        const foods = newResources.filter(r => r.type === 'Berry' && r.quantity > 0 && !r.respawnDay);
        const rocks = newResources.filter(r => r.type === 'Rock' && r.quantity > 0 && !r.respawnDay);

        const nearestWood = woods.reduce((best, r) => { const d = Math.hypot(r.pos.x - agent.pos.x, r.pos.y - agent.pos.y); return d < best.d ? {r, d} : best; }, {r: null as any, d: 100});
        const nearestFood = foods.reduce((best, r) => { const d = Math.hypot(r.pos.x - agent.pos.x, r.pos.y - agent.pos.y); return d < best.d ? {r, d} : best; }, {r: null as any, d: 100});
        const nearestRock = rocks.reduce((best, r) => { const d = Math.hypot(r.pos.x - agent.pos.x, r.pos.y - agent.pos.y); return d < best.d ? {r, d} : best; }, {r: null as any, d: 100});

        inputs[10] = 1 - Math.min(1, nearestWood.d / 30);
        inputs[11] = 1 - Math.min(1, nearestFood.d / 30);
        inputs[12] = 1 - Math.min(1, nearestRock.d / 30);

        const predators = newThreats.filter(t => t.health > 0 && ['Wolf', 'Bear', 'Jaguar'].includes(t.type));
        const nearestPredator = predators.reduce((best, t) => {
          const d = Math.hypot(t.pos.x - agent.pos.x, t.pos.y - agent.pos.y);
          return d < best.d ? {t, d} : best;
        }, {t: null as any, d: 999});
        
        const rawFear = 1 - Math.min(1, nearestPredator.d / 25);
        inputs[0] = Math.max(0, rawFear - (safeZone * 0.7));

        if (rawFear > 0.1) inputs[15] = Math.max(inputs[15], rawFear);
        else inputs[15] = Math.max(0, inputs[15] - 0.05 * simSpeed);

        if (communityHelpTriggers[agent.id]) inputs[30] = 1.0;
        else inputs[30] = Math.max(0, (inputs[30] || 0) - 0.02 * simSpeed);

        let stress = agent.stress;
        let trauma = agent.trauma;
        let health = agent.health;
        let hunger = agent.hunger;

        if (nearestPredator.t && nearestPredator.d < 1.4) {
          health -= (nearestPredator.t.type === 'Bear' ? 12 : 6) * simSpeed;
          stress = Math.min(100, stress + 15 * simSpeed);
          if (health <= 0) {
             audioManager.playUi('death');
             newHistory.push(generateHistoryReport(prev, 'EVENTO_CRITICO', `Sujeto ${agent.name} eliminado por ${nearestPredator.t.type}.`));
          }
        }

        if (inVillage) {
          stress *= 0.1; trauma *= 0.1;
          health = Math.min(agent.maxHealth, health + 5.0 * simSpeed);
          if (updatedVillage.stats.food > 0 && hunger > 10) {
            const eat = Math.min(updatedVillage.stats.food, 10 * simSpeed);
            updatedVillage.stats.food -= eat;
            hunger -= eat * 2;
          }
        }

        inputs[5] = stress / 100;
        inputs[20] = trauma / 100;
        inputs[3] = hunger / 100;
        inputs[31] = 1 - (health / 100);

        const brain = calculateAgentBrain(agent, prev, inputs);
        let targetTask = brain.task;

        let newPos = { ...agent.pos };
        let inventory = { ...agent.inventory };
        let direction = agent.direction;
        let newMastery = agent.mastery;
        const moveSpeed = (0.8 + agent.intelligence * 0.5) * simSpeed;

        const moveTowards = (tx: number, ty: number, stopDist: number = 1.0) => {
          const dx = tx - agent.pos.x;
          const dy = ty - agent.pos.y;
          const dist = Math.hypot(dx, dy);
          
          if (Math.abs(dx) > Math.abs(dy)) direction = dx > 0 ? 'RIGHT' : 'LEFT';
          else direction = dy > 0 ? 'DOWN' : 'UP';

          if (dist > stopDist) {
            const speed = Math.min(dist - stopDist * 0.8, moveSpeed);
            const nextX = agent.pos.x + (dx / dist) * speed;
            const nextY = agent.pos.y + (dy / dist) * speed;
            const gx = Math.floor(nextX), gy = Math.floor(nextY);

            if (!footstepPlayedThisTick) {
               const distToListener = Math.hypot(agent.pos.x - listenerPos.x, agent.pos.y - listenerPos.y);
               const isSelectedAgent = selectedEntity?.type === 'agent' && selectedEntity?.id === agent.id;
               if (distToListener < 15) {
                 if (isSelectedAgent || Math.random() < 0.05) {
                   audioManager.playSpatial('walk', agent.pos, listenerPos);
                   footstepPlayedThisTick = true;
                 }
               }
            }

            if (gx >= 0 && gx < WORLD_SIZE && gy >= 0 && gy < WORLD_SIZE && !newGrid[gx][gy].hasWater) {
              newPos.x = nextX;
              newPos.y = nextY;
              return true;
            }
            return false;
          }
          return false;
        };

        const updateSkill = (skillId: string, baseAmount: number) => {
          const skills = [...agent.skills];
          const skill = skills.find(s => s.id === skillId);
          if (skill) {
            const intelligenceFactor = 1 + (agent.inputs[17] || 0);
            const inventivenessFactor = 1 + (agent.inputs[27] || 0) * 0.5;
            const mentalHealthFactor = 1 - (Math.max(agent.inputs[5], agent.inputs[20]) * 0.7);
            const physicalFactor = 1 - (agent.inputs[3] * 0.5);

            const multiplier = intelligenceFactor * inventivenessFactor * mentalHealthFactor * physicalFactor;
            const actualGain = baseAmount * multiplier * simSpeed;
            
            skill.experience += actualGain;

            const xpRequired = 100 * Math.pow(1.8, skill.level - 1);
            
            if (skill.experience >= xpRequired && skill.level < skill.maxLevel) {
              skill.level++;
              skill.experience = 0;
              newMastery += 0.05;
            }
          }
          return skills;
        };

        let actionSound: string | null = null;
        let isPerformingTask = false;
        let newSkills = [...agent.skills];

        const LEARN_BASE = 0.0014;

        if (targetTask === 'DEFENSA' && nearestPredator.t) {
          moveTowards(nearestPredator.t.pos.x, nearestPredator.t.pos.y, 1.2);
          newSkills = updateSkill('defensa', LEARN_BASE);
        }
        else if (targetTask === 'HUIR' && nearestPredator.t) {
          const dx = agent.pos.x - nearestPredator.t.pos.x;
          const dy = agent.pos.y - nearestPredator.t.pos.y;
          const dist = Math.hypot(dx, dy);
          const nextX = agent.pos.x + (dx / dist) * moveSpeed;
          const nextY = agent.pos.y + (dy / dist) * moveSpeed;
          const gx = Math.floor(nextX), gy = Math.floor(nextY);
          if (gx >= 0 && gx < WORLD_SIZE && gy >= 0 && gy < WORLD_SIZE && !newGrid[gx][gy].hasWater) {
            newPos.x = nextX;
            newPos.y = nextY;
          }
          direction = dx > 0 ? 'RIGHT' : 'LEFT';
        } else if (targetTask === 'RETORNO') {
          if (!moveTowards(updatedVillage.pos.x, updatedVillage.pos.y, 1.5)) {
            updatedVillage.stats.food += inventory.food;
            updatedVillage.stats.wood += inventory.wood;
            updatedVillage.stats.advanced += inventory.advanced;
            inventory.food = 0; inventory.wood = 0; inventory.advanced = 0;
            direction = 'IDLE';
          }
        } else if (targetTask === 'TALAR' || targetTask === 'RECOLECTAR') {
           const nearestRes = prev.resources.filter(r => 
             !r.respawnDay &&
             (targetTask === 'TALAR' ? (r.type === 'Oak' || r.type === 'Rock') : r.type === 'Berry') 
             && r.quantity > 0
           ).reduce((best, r) => {
             const d = Math.hypot(r.pos.x - agent.pos.x, r.pos.y - agent.pos.y);
             return d < best.d ? { r, d } : best;
           }, {r: null as any, d: 999});

           if (nearestRes.r) {
             if (!moveTowards(nearestRes.r.pos.x, nearestRes.r.pos.y, 1.5)) {
               isPerformingTask = true;
               if (simSpeed >= 2) {
                  actionSound = targetTask === 'TALAR' ? (nearestRes.r.type === 'Rock' ? 'mine' : 'chop') : 'collect';
               }
               
               if (targetTask === 'TALAR') newSkills = updateSkill('tala', LEARN_BASE);
               else if (targetTask === 'RECOLECTAR') newSkills = updateSkill('cocina', LEARN_BASE);

               const harvest = 10.0 * simSpeed * (1 + newMastery);
               if (nearestRes.r.type === 'Berry') inventory.food += harvest;
               else if (nearestRes.r.type === 'Oak') inventory.wood += harvest;
               else if (nearestRes.r.type === 'Rock') inventory.advanced += harvest * 0.1;
               const resIdx = newResources.findIndex(res => res.id === nearestRes.r.id);
               if (resIdx !== -1) {
                 newResources[resIdx].quantity -= harvest;
                 newResources[resIdx].harvestCount += 1;
                 if (newResources[resIdx].harvestCount >= 10) {
                   newResources[resIdx].respawnDay = currentDay + 2;
                 }
               }
               direction = 'IDLE';
             }
           } else targetTask = 'EXPLORAR';
        } else if (targetTask === 'EXPLORAR') {
           let target = agentExplorationTargets.current[agent.id];
           if (!target || Math.hypot(target.x - agent.pos.x, target.y - agent.pos.y) < 4) {
             target = { x: Math.random() * WORLD_SIZE, y: Math.random() * WORLD_SIZE };
             agentExplorationTargets.current[agent.id] = target;
           }
           if (!moveTowards(target.x, target.y, 2.0)) {
             direction = 'IDLE';
           } else {
             newSkills = updateSkill('exploracion', LEARN_BASE * 0.5);
           }
        }

        audioManager.syncEntitySound(agent.id, actionSound, agent.pos, listenerPos);

        hunger = Math.min(100, hunger + 0.1 * simSpeed);
        if (hunger >= 100) {
           health -= 2.0 * simSpeed;
           if (health <= 0) {
              audioManager.playUi('death');
              newHistory.push(generateHistoryReport(prev, 'EVENTO_CRITICO', `Sujeto ${agent.name} fallecido por inanición.`));
           }
        }
        return { ...agent, pos: newPos, hunger, health, currentTask: targetTask, inputs, inventory, stress, trauma, direction, skills: newSkills, mastery: newMastery };
      }).filter(a => a.health > 0);

      const crowdedAgent = newAgents.find(a => {
        const neighbors = newAgents.filter(other => 
          other.id !== a.id && 
          Math.hypot(other.pos.x - a.pos.x, other.pos.y - a.pos.y) < 8
        ).length;
        return neighbors >= 5; 
      });

      const isZoomedIn = (cameraFocus?.zoom || 1) >= 2.0;
      const isDaytime = newLuz > 0.5;
      const shouldPlayMurmur = crowdedAgent && isZoomedIn && isDaytime;

      audioManager.syncEntitySound(
        'collective-murmur',
        shouldPlayMurmur ? 'murmur' : null,
        crowdedAgent ? crowdedAgent.pos : { x: 50, y: 50 },
        listenerPos
      );

      if (isNewDay) newHistory.push(generateHistoryReport(prev, 'DIARIO'));
      return { ...prev, grid: newGrid, time: newTime, day: currentDay, luz: newLuz, agents: newAgents, resources: newResources, threats: newThreats, villages: [updatedVillage], history: newHistory };
    });
  }, [cameraFocus, selectedEntity]); 

  useEffect(() => {
    const interval = setInterval(updateSimulation, 30);
    return () => clearInterval(interval);
  }, [updateSimulation]);

  const handleFocusAgent = (agentId: string) => {
    const agent = state?.agents.find(a => a.id === agentId);
    if (agent) {
      setCameraFocus({ x: agent.pos.x, y: agent.pos.y, zoom: 2.5, timestamp: Date.now() });
      setSelectedEntity({ type: 'agent', id: agentId });
    }
  };

  if (!state) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-auto relative">
      <aside className="w-80 border-r border-border relative z-20">
        <StatsPanel 
          state={state} 
          onPause={() => setState(s => s ? ({...s, paused: !s.paused}) : null)} 
          onReset={() => setState(createInitialState(initialSettings))} 
          onChangeSpeed={s => setState(prev => prev ? ({...prev, speed: s}) : null)} 
          onFocusVillage={() => setCameraFocus({ x: 50, y: 50, zoom: 1.8, timestamp: Date.now() })}
          onFocusAgent={handleFocusAgent}
          onOpenLog={(tab) => {
            setHistoryTab(tab || "DIARIO");
            setState(s => s ? ({...s, paused: true}) : null);
          }}
        />
      </aside>
      <main className="flex-1 flex flex-col relative z-10">
        <header className="p-4 border-b border-border flex items-center justify-between z-10 bg-background/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="font-headline font-bold text-accent italic uppercase text-xs tracking-widest border-r border-white/10 pr-4">ISO-CORE // DÍA {state.day}</div>
            <div className="text-[10px] font-code text-muted-foreground uppercase flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> LUZ {(state.luz * 100).toFixed(0)}%
            </div>
          </div>
          <DivineTerminal onApplyWeights={w => setState(s => s ? ({...s, globalWeights: {...s.globalWeights, ...w}}) : null)} />
        </header>
        <div className="flex-1 relative">
          <IsometricCanvas state={state} onSelectEntity={(type, id) => setSelectedEntity({ type, id })} focusTarget={cameraFocus} selectedEntity={selectedEntity} />
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ backgroundColor: 'rgba(5, 5, 25, 0.7)', opacity: Math.max(0, 0.85 - state.luz) }} />
        </div>
      </main>
      <aside className="w-80 border-l border-border relative z-20">
        <InspectorPanel 
          selected={selectedEntity} state={state} 
          onUpdateAgent={(id, u) => setState(s => s ? ({...s, agents: s.agents.map(a => a.id === id ? {...a, ...u} : a)}) : null)} 
          onUpdateGlobalWeights={w => setState(s => s ? ({...s, globalWeights: {...s.globalWeights, ...w}}) : null)}
          onDeselect={() => setSelectedEntity(null)} 
        />
      </aside>
      <HistoryPanel 
        history={state.history} 
        isOpen={!!historyTab} 
        defaultTab={historyTab || "DIARIO"} 
        onClose={() => {
          setHistoryTab(null);
          setState(s => s ? ({...s, paused: false}) : null);
        }} 
        state={state} 
      />
    </div>
  );
};
