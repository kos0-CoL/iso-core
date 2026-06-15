
"use client";

import React, { useState } from 'react';
import { SimulationState, AgentType } from '@/lib/simulation-types';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Zap, Globe, Database, MapPin, Navigation, Network, Info, Map as MapIcon, Trees, Activity, Users, ChevronRight, FastForward, Info as InfoIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { WORLD_SIZE } from '@/lib/simulation-logic';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  state: SimulationState;
  onPause: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onFocusVillage: (villageId: string) => void;
  onFocusAgent: (agentId: string) => void;
  onOpenLog: (tab?: string) => void;
}

export const StatsPanel: React.FC<Props> = ({ state, onPause, onReset, onChangeSpeed, onFocusVillage, onFocusAgent, onOpenLog }) => {
  const speeds = [0.1, 0.5, 1, 2, 5, 10];
  const [professionIndices, setProfessionIndices] = useState<Record<string, number>>({});

  const totalBiomass = state.resources.reduce((acc, r) => acc + (r.respawnDay ? 0 : r.quantity), 0);

  const professions: AgentType[] = ['Leñador', 'Cocinera', 'Niño', 'Anciano', 'Guardián', 'Explorador'];

  const handleCycleProfession = (type: AgentType) => {
    const relevantAgents = state.agents.filter(a => a.type === type);
    if (relevantAgents.length === 0) return;

    const currentIdx = professionIndices[type] || 0;
    const nextIdx = (currentIdx + 1) % relevantAgents.length;
    
    setProfessionIndices({ ...professionIndices, [type]: nextIdx });
    onFocusAgent(relevantAgents[nextIdx].id);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="p-6 flex flex-col h-full bg-card/40 backdrop-blur-xl border-r border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Zap size={14} className="text-primary" /> Telemetría Core
          </h2>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={onPause}>
              {state.paused ? <Play size={14} /> : <Pause size={14} />}
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={onReset}>
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <FastForward size={12} /> Velocidad Temporal
          </div>
          <div className="flex flex-wrap gap-1">
            {speeds.map(s => (
              <Button 
                key={s} 
                variant={state.speed === s ? 'default' : 'outline'} 
                size="sm" 
                className="h-6 px-2 text-[8px] font-code"
                onClick={() => onChangeSpeed(s)}
              >
                x{s}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6">
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-3">
               <div className="text-[10px] font-bold text-accent uppercase flex items-center gap-2">
                  <MapIcon size={12} /> Biosfera Alpha v9.7
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[8px] uppercase font-code">
                     <span className="text-muted-foreground">Dimensión:</span>
                     <span className="text-white">{WORLD_SIZE}x{WORLD_SIZE}</span>
                  </div>
                  <div className="flex justify-between text-[8px] uppercase font-code">
                     <span className="text-muted-foreground">Luz Ambiental:</span>
                     <span className="text-white">{(state.luz * 100).toFixed(0)}%</span>
                  </div>
                  <div className="pt-2 border-t border-accent/10">
                     <div className="flex justify-between text-[8px] uppercase font-code mb-1">
                        <span className="text-muted-foreground">Biomasa:</span>
                        <span className="text-green-400">{totalBiomass.toFixed(0)}u</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <div className="text-[10px] font-bold text-primary uppercase flex items-center gap-2">
                  <Users size={12} /> Dinámica de Población
               </div>
               <div className="grid gap-2">
                  {professions.map(type => {
                    const count = state.agents.filter(a => a.type === type).length;
                    return (
                      <Button 
                        key={type}
                        variant="outline"
                        className="w-full justify-between h-10 bg-black/40 border-white/5 hover:bg-primary/20 text-[10px] uppercase font-bold"
                        onClick={() => handleCycleProfession(type)}
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight size={10} className="text-primary" />
                          {type}
                        </span>
                        <span className="font-code text-primary">{count}</span>
                      </Button>
                    );
                  })}
               </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
               <div className="text-[10px] font-bold text-primary uppercase flex items-center gap-2">
                 <Navigation size={12} /> Localización de Núcleos
               </div>
               <div className="space-y-2">
                  {state.villages.map(v => (
                    <Button 
                      key={v.id}
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 bg-black/40 border-white/5 hover:bg-primary/20 hover:border-primary/40 transition-all group"
                      onClick={() => onFocusVillage(v.id)}
                    >
                      <MapPin size={12} className="text-primary group-hover:scale-125 transition-transform" />
                      <div className="flex flex-col items-start overflow-hidden text-left">
                        <span className="text-[10px] font-bold uppercase truncate w-full text-white">{v.name}</span>
                        <span className="text-[8px] text-muted-foreground uppercase">{v.currentEra}</span>
                      </div>
                    </Button>
                  ))}
               </div>
            </div>

            <div className="p-4 border border-white/5 rounded-xl space-y-3 bg-black/20">
               <div className="flex justify-between items-center mb-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                      <Database size={12} /> Almacén Global
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <InfoIcon size={12} className="text-accent cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-white/10 p-3 max-w-[200px]">
                       <p className="text-[9px] uppercase font-bold leading-tight">ADVANCE: Materiales raros (Piedra/Metal) obtenidos en montañas para tech industrial.</p>
                    </TooltipContent>
                  </Tooltip>
               </div>
               {state.villages[0] && Object.entries(state.villages[0].stats).map(([k, v]) => (
                 <div key={k} className="flex justify-between items-center text-[9px] uppercase font-code">
                    <span className="text-muted-foreground">{k}</span>
                    <span className={cn("text-white", k === 'advanced' ? "text-accent" : "")}>
                       {(v as number).toFixed(0)}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};
