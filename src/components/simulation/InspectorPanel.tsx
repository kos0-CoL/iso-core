
"use client";

import React from 'react';
import { SimulationState, Agent, Resource, Threat, VillageEntity } from '@/lib/simulation-types';
import { INPUT_LABELS, BRAIN_WEIGHTS, calculateAgentBrain, TECH_TREE } from '@/lib/simulation-logic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Brain, Shield, Globe, Zap, Database, HeartPulse, Book, Activity, Target, ShieldAlert, Trees, Users, Calculator, MessageSquare, Crown, Layers, Eye, Mountain, Trophy, X, FlaskConical, Info, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  selected: { type: string; id: string } | null;
  state: SimulationState;
  onUpdateAgent: (agentId: string, updates: Partial<Agent>) => void;
  onUpdateGlobalWeights: (weights: Record<string, number>) => void;
  onDeselect: () => void;
}

export const InspectorPanel: React.FC<Props> = ({ selected, state, onUpdateAgent, onUpdateGlobalWeights, onDeselect }) => {
  const agent = selected?.type === 'agent' ? state.agents.find(a => a.id === selected.id) : null;
  const village = selected?.type === 'village' ? (selected.id ? state.villages.find(v => v.id === selected.id) : state.villages[0]) : null;
  const resource = selected?.type === 'resource' ? state.resources.find(r => r.id === selected.id) : null;
  const threat = selected?.type === 'threat' ? state.threats.find(t => t.id === selected.id) : null;

  const leader = village?.leaderId ? state.agents.find(a => a.id === village.leaderId) : null;

  const getInferenceData = (a: Agent) => calculateAgentBrain(a, state);

  /**
   * v20.0: Cálculo de progreso exponencial para el UI
   */
  const getSkillProgress = (experience: number, level: number) => {
    const xpRequired = 100 * Math.pow(1.8, level - 1);
    return Math.min(100, (experience / xpRequired) * 100);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-full flex flex-col p-6 bg-card/40 backdrop-blur-2xl border-l border-border overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            {!selected && <Globe size={14} className="text-primary" />}
            {agent && <Brain size={14} className="text-accent" />}
            {village && <Shield size={14} className="text-primary" />}
            {resource && <Trees size={14} className="text-green-500" />}
            {threat && <ShieldAlert size={14} className="text-red-500" />}
            {!selected ? 'Telemetría Global' : agent ? 'Sujeto Bio-Vectorial' : village ? 'Núcleo de Asentamiento' : resource ? 'Ficha de Recurso' : 'Ficha de Amenaza'}
          </h2>
          {selected && <button onClick={onDeselect} className="text-muted-foreground hover:text-white transition-all bg-white/5 hover:bg-red-500/20 p-1.5 rounded-full"><X size={12} /></button>}
        </div>

        <ScrollArea className="flex-1 pr-4">
          {agent && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-headline font-bold text-white uppercase italic tracking-tight">{agent.name}</div>
                    <div className="text-[8px] text-muted-foreground uppercase font-code">{agent.type} // NIVEL {agent.level}</div>
                  </div>
                  <div className="text-[10px] font-code text-white bg-accent/20 px-2 py-0.5 rounded-full uppercase">{agent.currentTask}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                   <div className="p-2 bg-green-500/5 border border-green-500/20 rounded-xl">
                      <div className="text-[7px] text-green-400 font-bold uppercase flex items-center gap-1"><HeartPulse size={8} /> Salud</div>
                      <div className="text-xs font-code text-white">{agent.health.toFixed(0)}%</div>
                   </div>
                   <div className="p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                      <div className="text-[7px] text-yellow-400 font-bold uppercase flex items-center gap-1"><Scale size={8} /> Carga</div>
                      <div className="text-xs font-code text-white">{((agent.inventory.food + agent.inventory.wood + agent.inventory.advanced)).toFixed(0)} / {agent.maxInventory}</div>
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[8px] text-accent font-bold uppercase flex items-center gap-1"><Trophy size={10} /> Habilidades (Exponencial)</div>
                  {agent.skills.map(s => (
                    <div key={s.id} className="space-y-1">
                      <div className="flex justify-between text-[7px] uppercase font-bold text-muted-foreground">
                        <span>{s.name}</span>
                        <span>LV {s.level}</span>
                      </div>
                      <Progress value={getSkillProgress(s.experience, s.level)} className="h-1 bg-accent/20" />
                    </div>
                  ))}
                  <div className="text-[6px] text-muted-foreground uppercase italic text-center pt-2">
                    "Curva de aprendizaje afectada por Inteligencia e Inventiva"
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <div className="text-[8px] text-primary font-bold uppercase flex items-center gap-1"><Zap size={10} /> Inferencia Σ</div>
                    <div className="text-[10px] font-headline font-bold text-primary italic">σ = {(getInferenceData(agent).score * 100).toFixed(1)}%</div>
                 </div>

                 <div className="space-y-1.5 border-t border-primary/10 pt-3">
                    <div className="text-[8px] text-muted-foreground uppercase font-bold mb-2">Impacto Psíquico (W * X)</div>
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-1">
                      {INPUT_LABELS.map((label, i) => {
                        const brainKey = agent.type.toLowerCase() === 'explorador' ? 'explorador' : (BRAIN_WEIGHTS[agent.type.toLowerCase()] ? agent.type.toLowerCase() : 'leñador');
                        const brain = BRAIN_WEIGHTS[brainKey];
                        const weights = brain?.[agent.currentTask.toLowerCase()]?.weights || [];
                        const w = weights[i] || 0;
                        const x = agent.inputs[i] || 0;
                        const impact = w * x;
                        
                        return (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <div className={cn("grid grid-cols-6 items-center text-[7px] font-code border-b border-white/5 pb-1 transition-colors group cursor-help", Math.abs(impact) > 0.5 ? "bg-white/5" : "")}>
                                <span className="col-span-2 text-white/50 truncate group-hover:text-white">X{i+1}: {label}</span>
                                <span className="text-center text-muted-foreground/50">W:{w.toFixed(1)}</span>
                                <span className="text-center text-muted-foreground/50">X:{x.toFixed(1)}</span>
                                <span className={cn("col-span-2 text-right font-bold", impact > 0 ? "text-accent" : impact < 0 ? "text-red-400" : "text-muted-foreground/30")}>
                                  {impact > 0 ? '+' : ''}{impact.toFixed(3)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="bg-card border-white/10 text-[10px] uppercase font-bold p-3 max-w-[200px]">
                              <div className="text-accent mb-1">X{i+1}: {label}</div>
                              <div className="text-muted-foreground font-normal leading-tight">Sensor bio-vectorial. Multiplicador W: {w.toFixed(1)}. Resultado psíquico: {impact.toFixed(3)}.</div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                 </div>
              </div>

              {(agent.type === 'Explorador' || agent.explorationLog.length > 0) && (
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
                  <div className="text-[8px] text-muted-foreground uppercase flex items-center gap-1"><Book size={10} /> Bitácora Explorador</div>
                  <div className="space-y-2">
                    {agent.explorationLog.length > 0 ? agent.explorationLog.slice(-3).map((log, i) => (
                      <div key={i} className="text-[9px] text-white/70 border-l-2 border-primary/30 pl-3 py-1 italic bg-white/5 rounded-r-lg">
                        <span className="text-[7px] text-primary block not-italic uppercase font-bold">Día {log.day}</span>
                        "{log.message}"
                      </div>
                    )) : (
                       <div className="text-[7px] text-muted-foreground uppercase text-center py-4">Sin descubrimientos registrados</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {village && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-headline font-bold text-white uppercase italic tracking-tight">{village.name}</div>
                      <div className="text-[8px] text-muted-foreground uppercase font-code">Era {village.currentEra} // Sigmoide de Facción</div>
                    </div>
                    <Shield size={20} className="text-primary" />
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                    <div className="text-[8px] text-muted-foreground uppercase mb-1">Estabilidad Social (σ)</div>
                    <div className="text-2xl font-headline font-bold text-primary italic">{(village.stats.morale).toFixed(1)}%</div>
                  </div>
               </div>

               {leader && (
                 <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl space-y-3">
                    <div className="text-[8px] text-yellow-500 font-bold uppercase flex items-center gap-2"><Crown size={12} /> Líder de Facción</div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 overflow-hidden"><Crown size={20} className="text-yellow-500" /></div>
                       <div>
                          <div className="text-xs text-white uppercase font-bold">{leader.name}</div>
                          <div className="text-[7px] text-muted-foreground uppercase font-code">Influencia: {(leader.mastery * 100).toFixed(0)}%</div>
                       </div>
                    </div>
                 </div>
               )}

               <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                  <div className="text-[8px] text-primary font-bold uppercase flex items-center gap-1"><Activity size={10} /> Vectores Estructurales</div>
                  <div className="space-y-4">
                    {Object.entries(village.vectors).map(([key, val]) => (
                      <div key={key} className="space-y-1.5">
                        <div className="flex justify-between text-[7px] uppercase font-bold text-muted-foreground"><span>{key}</span><span className="text-white">{(val * 100).toFixed(0)}%</span></div>
                        <Progress value={val * 100} className="h-1 bg-primary/20" />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {resource && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <div className="text-sm font-headline font-bold text-white uppercase italic">{resource.type}</div>
                        <div className="text-[8px] text-muted-foreground uppercase font-code">ID: {resource.id}</div>
                     </div>
                     <Trees size={24} className="text-green-500" />
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                     <div className="text-[8px] text-muted-foreground uppercase mb-1">Disponibilidad de Biomasa</div>
                     <Progress value={(resource.quantity / resource.maxQuantity) * 100} className="h-2 bg-green-500/20" />
                     <div className="mt-2 text-right text-[10px] font-code text-green-400">{resource.quantity.toFixed(0)}u</div>
                  </div>
               </div>

               <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="text-[8px] text-green-400 font-bold uppercase flex items-center gap-1"><Layers size={10} /> Atributos Físicos</div>
                  <div className="space-y-3">
                     {Object.entries(resource.vectors).map(([key, val]) => (
                       <div key={key} className="space-y-1">
                          <div className="flex justify-between text-[7px] uppercase font-bold text-muted-foreground"><span>{key}</span><span className="text-white">{(val * 100).toFixed(0)}%</span></div>
                          <Progress value={val * 100} className="h-1 bg-green-500/20" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {threat && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <div className="text-sm font-headline font-bold text-white uppercase italic">{threat.type}</div>
                        <div className="text-[8px] text-muted-foreground uppercase font-code">Amenaza Nivel {['Bear', 'Wolf'].includes(threat.type) ? 'CRÍTICO' : 'BAJO'}</div>
                     </div>
                     <ShieldAlert size={24} className="text-red-500" />
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                     <div className="text-[8px] text-muted-foreground uppercase mb-1">Integridad Orgánica</div>
                     <Progress value={threat.health} className="h-2 bg-red-500/20" />
                     <div className="mt-2 text-right text-[10px] font-code text-red-400">{threat.health.toFixed(0)}%</div>
                  </div>
               </div>

               <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="text-[8px] text-red-500 font-bold uppercase flex items-center gap-1"><Zap size={10} /> Instintos Neuronales</div>
                  <div className="space-y-3">
                     {Object.entries(threat.vectors).map(([key, val]) => (
                       <div key={key} className="space-y-1">
                          <div className="flex justify-between text-[7px] uppercase font-bold text-muted-foreground"><span>{key}</span><span className="text-white">{(val * 100).toFixed(0)}%</span></div>
                          <Progress value={val * 100} className="h-1 bg-red-500/20" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};
