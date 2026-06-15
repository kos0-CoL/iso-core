
"use client";

import React from 'react';
import { HistoryEntry, SimulationState, Technology } from '@/lib/simulation-types';
import { TECH_TREE } from '@/lib/simulation-logic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Calendar, Binary, Zap, Target, X, Share2, Award, FlaskConical, Lightbulb, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  state: SimulationState;
  defaultTab?: string;
}

export const HistoryPanel: React.FC<Props> = ({ history, isOpen, onClose, state, defaultTab = "ARBOL" }) => {
  if (!isOpen) return null;

  const unlockedTechs = state.villages[0]?.unlockedTechnologies || [];

  const renderTechNode = (tech: Technology) => {
    const isUnlocked = unlockedTechs.includes(tech.id);
    const canUnlock = tech.requires.every(req => unlockedTechs.includes(req));

    return (
      <div 
        key={tech.id} 
        className={cn(
          "p-4 rounded-2xl border transition-all duration-500 relative group overflow-hidden",
          isUnlocked ? "bg-accent/20 border-accent shadow-[0_0_20px_rgba(34,211,238,0.2)]" : 
          canUnlock ? "bg-primary/10 border-primary/40 opacity-80" : "bg-black/40 border-white/5 opacity-30 grayscale"
        )}
      >
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className={cn("p-2 rounded-lg", isUnlocked ? "bg-accent text-white" : "bg-white/5")}>
             <FlaskConical size={14} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-tighter">{tech.name}</div>
            <div className="text-[7px] text-muted-foreground uppercase font-code">{tech.era}</div>
          </div>
        </div>
        <p className="text-[8px] text-muted-foreground leading-tight mb-3 relative z-10">{tech.description}</p>
        
        {isUnlocked && (
          <div className="absolute top-2 right-2">
            <Award size={12} className="text-accent animate-bounce" />
          </div>
        )}

        <div className="flex gap-1 mt-2 flex-wrap relative z-10">
          {tech.requires.map(reqId => (
            <div key={reqId} className="text-[6px] px-1.5 py-0.5 rounded-full bg-black/40 text-white/50 border border-white/5 uppercase">
              REQS: {reqId}
            </div>
          ))}
        </div>
        
        {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />}
      </div>
    );
  };

  const renderEntry = (entry: HistoryEntry) => (
    <div key={entry.id} className={cn(
      "p-4 rounded-xl border space-y-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
      entry.type === 'EVENTO_CRITICO' ? "bg-red-500/5 border-red-500/20" : "bg-black/60 border-white/10"
    )}>
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-[0.2em]",
          entry.type === 'EVENTO_CRITICO' ? "text-red-500" : "text-primary"
        )}>
          {entry.type === 'EVENTO_CRITICO' ? "ALERTA_CRÍTICA" : `Registro_Día_${entry.day}`}
        </span>
        <span className="text-[8px] text-muted-foreground font-code uppercase">Timestamp: {new Date(entry.time).toLocaleTimeString()}</span>
      </div>
      
      <div className="flex gap-3 items-start">
        {entry.type === 'EVENTO_CRITICO' && <AlertTriangle className="text-red-500 shrink-0" size={14} />}
        <p className={cn(
          "text-xs font-medium leading-relaxed font-body italic",
          entry.type === 'EVENTO_CRITICO' ? "text-red-200" : "text-white"
        )}>
          "{entry.message}"
        </p>
      </div>
      
      {entry.details.reason && (
         <div className="text-[8px] text-red-400 font-code uppercase px-2 py-1 bg-red-500/10 rounded">
            Causa: {entry.details.reason}
         </div>
      )}
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
          <div className="text-[7px] text-accent font-bold uppercase mb-1 flex items-center gap-1">
             <Target size={8} /> Sigmoide Prevalente
          </div>
          <div className="text-[10px] font-code text-white uppercase tracking-wider">{entry.details.prevailingSigmoid}</div>
        </div>
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-[7px] text-primary font-bold uppercase mb-1 flex items-center gap-1">
             <Binary size={8} /> Vector Dominante
          </div>
          <div className="text-[10px] font-code text-white uppercase tracking-wider">{entry.details.dominantVector}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-6">
      <div className="bg-card/95 border border-white/10 w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/20">
          <div className="space-y-1">
             <h2 className="text-2xl font-headline font-bold text-white uppercase italic flex items-center gap-3 tracking-tighter">
                <History className="text-primary pulse-accent" /> Registro de Caja Negra
             </h2>
             <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-code">Recuperación de Telemetría Histórica // ISO-CORE_V6.5</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5"
          >
            <X size={20} />
          </Button>
        </header>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col min-h-0 bg-black/10">
          <TabsList className="px-8 bg-transparent border-b border-white/5 h-14 gap-8 justify-start">
            <TabsTrigger value="ARBOL" className="bg-transparent data-[state=active]:text-accent border-b-2 border-transparent data-[state=active]:border-accent rounded-none px-0 text-[10px] font-bold uppercase tracking-[0.2em] h-full transition-all">
              <Share2 size={12} className="mr-2" /> Árbol Tecnológico
            </TabsTrigger>
            <TabsTrigger value="DIARIO" className="bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 text-[10px] font-bold uppercase tracking-[0.2em] h-full transition-all">
              <Calendar size={12} className="mr-2" /> Diario de Laboratorio
            </TabsTrigger>
            <TabsTrigger value="INFO" className="bg-transparent data-[state=active]:text-white border-b-2 border-transparent data-[state=active]:border-white rounded-none px-0 text-[10px] font-bold uppercase tracking-[0.2em] h-full transition-all">
              <Info size={12} className="mr-2" /> Resumen de Sesión
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ARBOL" className="flex-1 mt-0 p-8 min-h-0">
             <ScrollArea className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {TECH_TREE.map(renderTechNode)}
                </div>
                <div className="mt-12 p-6 bg-accent/5 rounded-3xl border border-accent/20 flex items-start gap-4">
                   <Lightbulb className="text-accent shrink-0" size={24} />
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest">Protocolo de Investigación</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed">Las tecnologías no son lineales. Se desbloquean mediante la acumulación de Inteligencia ($X_{18}$) e Inventiva ($X_{28}$) colectiva. Algunas requieren descubrimientos previos para ser conceptualizadas por los sujetos.</p>
                   </div>
                </div>
             </ScrollArea>
          </TabsContent>

          <TabsContent value="DIARIO" className="flex-1 mt-0 p-8 min-h-0">
            <ScrollArea className="h-full">
              {history.length > 0 ? (
                <div className="space-y-4">
                  {[...history].reverse().map(renderEntry)}
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-muted-foreground space-y-6 opacity-30 animate-pulse">
                  <Calendar size={64} strokeWidth={1} />
                  <p className="text-[12px] uppercase font-bold tracking-[0.4em]">Sin registros almacenados</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="INFO" className="flex-1 mt-0 p-8 min-h-0">
            <ScrollArea className="h-full">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <h3 className="text-lg font-bold text-white uppercase italic mb-4">Estado del Experimento</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    La sesión actual se encuentra en el día {state.day}. La demografía se mantiene estable con {state.agents.length} sujetos activos. El árbol tecnológico ha progresado hasta la era {state.villages[0].currentEra}.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                      <div className="text-[10px] text-muted-foreground uppercase">Suministros (Food)</div>
                      <div className="text-xl font-code text-white">{state.villages[0].stats.food.toFixed(0)}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                      <div className="text-[10px] text-muted-foreground uppercase">Materiales (Wood)</div>
                      <div className="text-xl font-code text-white">{state.villages[0].stats.wood.toFixed(0)}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-3xl">
                   <div className="flex gap-4 items-start">
                      <Info className="text-accent shrink-0" size={20} />
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Glosario de Recursos: ADVANCE</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                          "Los materiales avanzados (Piedra, Hierro, Minerales) son recursos de alta densidad necesarios para desbloquear las eras Industrial y Atómica. Se obtienen principalmente minando rocas en biomas de Sierra y Montaña."
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <footer className="p-6 border-t border-white/5 bg-black/40 shrink-0">
           <div className="flex justify-between items-center text-[8px] uppercase font-code tracking-[0.2em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <Binary size={10} className="text-primary" /> ISO CORE // SECURE_TELEMETRY_V6
              </span>
              <span className="flex items-center gap-2">
                 <Zap size={10} className="text-accent" /> SISTEMA DE ANÁLISIS SIGMOIDAL ACTIVO
              </span>
           </div>
        </footer>
      </div>
    </div>
  );
};
