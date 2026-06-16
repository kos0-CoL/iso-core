
"use client";

import { useState, useEffect } from 'react';
import { SimulationController } from '@/components/simulation/SimulationController';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimulationSettings, SocietyModel, MapType } from '@/lib/simulation-types';
import { Brain, Settings, Sparkles, Binary, ShieldAlert, Zap, Trees, Map as MapIcon, Info, Network, Cpu, Calculator, FlaskConical, Target, MessageSquareCode, BookOpen, Layers, Activity, TrendingUp, HelpCircle, Microchip, Atom, FlaskConical as Flask, MousePointer2, Terminal, UserCog, RefreshCw, BarChart3, ChevronRight, ArrowRight, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BRAIN_WEIGHTS, INPUT_LABELS } from '@/lib/simulation-logic';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-manager';

export default function Home() {
  const [userApiKey, setUserApiKey] = useState('');
  const [mostrarConfigIA, setMostrarConfigIA] = useState(false);

  // Carga la clave si ya estaba guardada en la PC del jugador
  useEffect(() => {
    const savedKey = localStorage.getItem('user_gemini_api_key');
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  const [showSim, setShowSim] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  
  const [settings, setSettings] = useState<SimulationSettings>({
    populationCount: 15,
    dominance: 0.8,
    societyModel: 'CLASSIC',
    mapType: 'RANDOM',
    randomizeIntent: false
  });

  const [volumes, setVolumes] = useState({
    ambient: 0.6,
    sfx: 0.5
  });

  useEffect(() => {
    // Inicializar volúmenes desde el manager
    setVolumes({
      ambient: audioManager.getAmbientVolume(),
      sfx: audioManager.getSfxVolume()
    });
  }, []);

  const handleAmbientVolumeChange = (v: number) => {
    setVolumes(prev => ({ ...prev, ambient: v }));
    audioManager.setAmbientVolume(v);
  };

  const handleSfxVolumeChange = (v: number) => {
    setVolumes(prev => ({ ...prev, sfx: v }));
    audioManager.setSfxVolume(v);
  };

  const MODELS: SocietyModel[] = [
    'CLASSIC', 'STATIC', 'EXPANSIONIST', 'CHAOTIC', 'REVOLUTIONARY', 
    'INDUSTRIALIZABLE', 'UTOPIAN', 'SURVIVALIST', 'HEDONISTIC', 
    'TECHNOCRATIC', 'SPIRITUALIST'
  ];

  const MAP_TYPES: MapType[] = [
    'RANDOM', 'DESERT', 'TROPICAL', 'TUNDRA', 'PLAIN', 'YUNGA', 'SIERRA', 'MOUNTAIN'
  ];

  if (showSim) {
    return (
      <main className="min-h-screen bg-background">
        <SimulationController initialSettings={settings} onExit={() => setShowSim(false)} />
      </main>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <main className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background overflow-auto">
        <div className="max-w-4xl w-full space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-4 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Binary size={40} className="pulse-accent" />
            </div>
            <h1 className="text-5xl font-headline font-bold tracking-tighter text-white uppercase italic text-shadow-glow">
              ISO-CORE // VECTOR LAB
            </h1>
            <p className="text-muted-foreground font-code text-sm tracking-widest uppercase">
              SISTEMA DE EMERGENCIA CONDUCTUAL v12.1
            </p>
          </div>

          <div className="bg-card/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-[0.2em]">
                    <Settings size={14} /> 
                    <span>Demografía Base</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Sujetos de Prueba</label>
                    <span className="text-xs text-white font-code">{settings.populationCount}</span>
                  </div>
                  <Slider 
                    value={[settings.populationCount]} 
                    min={5} max={50} step={1} 
                    onValueChange={([v]) => setSettings(s => ({...s, populationCount: v}))} 
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Dominancia Sináptica</label>
                    <span className="text-xs text-white font-code">{(settings.dominance * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[settings.dominance]} 
                    min={0.1} max={1.0} step={0.05} 
                    onValueChange={([v]) => setSettings(s => ({...s, dominance: v}))} 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-accent font-bold uppercase text-xs tracking-[0.2em]">
                    <MapIcon size={14} /> 
                    <span>Entorno y Sociedad</span>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Modelo Sistémico</label>
                    <Select value={settings.societyModel} onValueChange={(v: SocietyModel) => setSettings(s => ({...s, societyModel: v}))}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 text-xs uppercase font-bold">
                        <SelectValue placeholder="Model" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        {MODELS.map(m => (
                          <SelectItem key={m} value={m} className="text-[10px] uppercase font-bold">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Configuración de Mapa</label>
                    <Select value={settings.mapType} onValueChange={(v: MapType) => setSettings(s => ({...s, mapType: v}))}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 text-xs uppercase font-bold">
                        <SelectValue placeholder="Map Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        {MAP_TYPES.map(m => (
                          <SelectItem key={m} value={m} className="text-[10px] uppercase font-bold">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-6">
               <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-xs tracking-[0.2em]">
                  <Volume2 size={14} /> 
                  <span>Configuración de Audio</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-2">
                        <Volume1 size={12} /> Ambiente
                      </label>
                      <span className="text-xs text-white font-code">{(volumes.ambient * 100).toFixed(0)}%</span>
                    </div>
                    <Slider 
                      value={[volumes.ambient]} 
                      min={0} max={1} step={0.01} 
                      onValueChange={([v]) => handleAmbientVolumeChange(v)} 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-2">
                        <Zap size={12} /> Efectos (SFX)
                      </label>
                      <span className="text-xs text-white font-code">{(volumes.sfx * 100).toFixed(0)}%</span>
                    </div>
                    <Slider 
                      value={[volumes.sfx]} 
                      min={0} max={1} step={0.01} 
                      onValueChange={([v]) => handleSfxVolumeChange(v)} 
                    />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Dialog open={networkOpen} onOpenChange={setNetworkOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-500 uppercase text-[10px] font-bold tracking-widest gap-2">
                    <Network size={14} /> Red Neuronal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh] bg-card border-white/5 flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="p-6 border-b border-white/5 shrink-0 bg-black/20">
                    <DialogTitle className="text-xl font-headline font-bold text-yellow-500 uppercase italic">Mapa de Conexiones Sinápticas</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-yellow-400 uppercase italic border-b border-yellow-400/20 pb-2">
                          Entradas del Mundo (X1 ... X40)
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {INPUT_LABELS.map((label, i) => (
                            <div key={i} className="p-2 bg-black/40 border border-white/5 rounded text-[8px] font-code text-muted-foreground uppercase group hover:border-yellow-500/40 transition-colors">
                              <span className="text-yellow-400/50 mr-2">X{i+1}:</span> {label}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase italic border-b border-primary/20 pb-2">
                          Funciones de Acción (Y_task)
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(BRAIN_WEIGHTS.leñador).map(([actionName, params]: [string, any]) => (
                            <div key={actionName} className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                              <div className="text-[10px] font-bold text-white uppercase mb-2 flex justify-between">
                                <span>Activación: {actionName.toUpperCase()}</span>
                                <span className="text-primary font-code">b={params.bias}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {params.weights.map((w: number, i: number) => w !== 0 && (
                                  <div key={i} className={cn(
                                    "text-[6px] px-1.5 py-0.5 rounded border",
                                    w > 0 ? "bg-accent/10 border-accent/20 text-accent" : "bg-red-500/10 border-red-500/20 text-red-400"
                                  )}>
                                    X{i+1} ({w > 0 ? '+' : ''}{w})
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary uppercase text-[10px] font-bold tracking-widest gap-2">
                    <BookOpen size={14} /> Mecánicas (GUÍA)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl h-[90vh] bg-card border-white/5 flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="p-6 border-b border-white/5 shrink-0 bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg text-primary"><Brain size={24} /></div>
                      <DialogTitle className="text-2xl font-headline font-bold text-white uppercase italic tracking-tighter">
                        🧠 ISO CORE: LABORATORIO NEURONAL
                      </DialogTitle>
                    </div>
                  </DialogHeader>
                  
                  <Tabs defaultValue="intro" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="px-6 bg-black/40 border-b border-white/5 h-12 justify-start gap-4">
                      <TabsTrigger value="intro" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
                        <Flask size={12} /> ¿Qué es esto?
                      </TabsTrigger>
                      <TabsTrigger value="brain" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
                        <Brain size={12} /> El Cerebro
                      </TabsTrigger>
                      <TabsTrigger value="emergent" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
                        <Trees size={12} /> Emergencia
                      </TabsTrigger>
                      <TabsTrigger value="architect" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
                        <Sparkles size={12} /> Tú eres el Arquitecto
                      </TabsTrigger>
                      <TabsTrigger value="learning" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
                        <RefreshCw size={12} /> Aprendizaje
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2">
                        <BarChart3 size={12} /> Estadísticas
                      </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1">
                      <div className="p-10 max-w-4xl mx-auto space-y-12 pb-20">
                        
                        <TabsContent value="intro" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="space-y-8">
                            <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-4">
                              <h3 className="text-3xl font-headline font-bold text-white uppercase italic">Protocolo de Inferencia</h3>
                              <p className="text-lg text-muted-foreground leading-relaxed font-body">
                                "ISO CORE no es un juego tradicional. Es un <strong className="text-white">Simulador de Perceptrones</strong> donde los aldeanos aprenden a sobrevivir usando redes neuronales artificiales. Tú no controlas a nadie. Solo modificas vectores y observas cómo la IA se re-entrena a sí misma."
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-center space-y-2">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">Entorno</div>
                                <div className="flex justify-center text-green-500"><Trees /></div>
                              </div>
                              <div className="flex justify-center"><ArrowRight className="text-white/20" /></div>
                              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-center space-y-2 relative">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">40 Sensores (X)</div>
                                <div className="flex justify-center text-primary"><Binary /></div>
                                <div className="absolute -top-2 -right-2 bg-primary text-[8px] px-1.5 py-0.5 rounded font-bold">INPUT</div>
                              </div>
                              <div className="flex justify-center"><ArrowRight className="text-white/20" /></div>
                              <div className="p-4 bg-primary/10 border border-primary/40 rounded-2xl text-center space-y-2">
                                <div className="text-[10px] font-bold text-white uppercase italic">Perceptrón</div>
                                <div className="flex justify-center text-white"><Brain /></div>
                              </div>
                              <div className="flex justify-center"><ArrowRight className="text-white/20" /></div>
                              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-center space-y-2">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">Acción (Y)</div>
                                <div className="flex justify-center text-accent"><Target /></div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="brain" className="mt-0 space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-4">
                              <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <Binary size={14} /> 📥 40 Sensores de Entrada (X₁ a X₄₀)
                              </h4>
                              <p className="text-[11px] text-muted-foreground">Los aldeanos perciben el mundo a través de estos inputs normalizados (0.0 a 1.0).</p>
                              <div className="space-y-1.5 border-t border-white/5 pt-4">
                                {[
                                  { x: 'X₁', label: 'Miedo al depredador cercano' },
                                  { x: 'X₄', label: 'Hambre acumulada' },
                                  { x: 'X₈', label: 'Niños desprotegidos cerca' },
                                  { x: 'X₁₇', label: 'Cohesión social (aliados cerca)' },
                                  { x: 'X₃₂', label: 'Curiosidad por explorar' },
                                  { x: 'X₃₃', label: 'Aburrimiento (monotonía)' },
                                ].map(s => (
                                  <div key={s.x} className="flex justify-between text-[10px] font-code p-2 bg-white/5 rounded">
                                    <span className="text-primary font-bold">{s.x}</span>
                                    <span className="text-white/70 italic">{s.label}</span>
                                  </div>
                                ))}
                                <Button variant="link" className="w-full text-[8px] uppercase font-bold text-primary hover:text-white" onClick={() => { setGuideOpen(false); setNetworkOpen(true); }}>
                                  Ver 40 vectores completos <ArrowRight size={10} className="ml-1" />
                                </Button>
                              </div>
                            </div>

                            <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                                  <UserCog size={14} /> ⚖️ Pesos Sinápticos (W)
                                </h4>
                                <p className="text-[11px] text-muted-foreground">Cada tipo de aldeano tiene una matriz de pesos distinta. Esto determina su personalidad.</p>
                                <div className="p-4 bg-black/60 rounded-xl font-code text-[10px] space-y-2 border border-accent/20">
                                   <div className="flex justify-between border-b border-white/5 pb-1">
                                      <span className="text-white">Leñador:</span>
                                      <span className="text-accent">Talar=+0.95 | Huir=-0.20</span>
                                   </div>
                                   <div className="flex justify-between">
                                      <span className="text-white">Cocinera:</span>
                                      <span className="text-accent">Cocinar=+0.90 | Defensa=-0.70</span>
                                   </div>
                                </div>
                              </div>

                              <div className="space-y-3 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                  <Calculator size={14} /> 📐 La Fórmula Mágica
                                </h4>
                                <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl text-center space-y-2">
                                   <div className="text-[9px] text-muted-foreground uppercase font-code">Suma Ponderada</div>
                                   <code className="text-lg font-headline text-white italic">z = b + Σ (W_i * X_i)</code>
                                   <div className="text-[9px] text-muted-foreground uppercase font-code mt-2">Activación (Sigmoide)</div>
                                   <code className="text-xl font-headline text-primary italic">σ(z) = 1 / (1 + e⁻ᶻ)</code>
                                </div>
                                <p className="text-[9px] text-center text-muted-foreground italic uppercase">"La acción con la sigmoide más cercana a 1.0 toma el control."</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="emergent" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="space-y-6">
                            <h3 className="text-2xl font-headline font-bold text-white uppercase italic flex items-center gap-3">
                              <Trees className="text-green-500" /> Libertad Determinista
                            </h3>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Los aldeanos no siguen guiones preestablecidos. Cada decisión "emerge" de una colisión de variables: su estado biológico actual, la geografía inmediata y su configuración psíquica (Pesos W).
                              </p>
                              <p className="text-xs text-primary font-bold uppercase tracking-widest">
                                "Dos sujetos bajo la misma lluvia pueden decidir cosas opuestas basándose exclusivamente en su arquitectura neuronal."
                              </p>
                            </div>
                            
                            <div className="p-8 bg-black/60 border border-white/10 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 bg-green-500/20 text-green-500 text-[8px] font-bold uppercase tracking-widest">Caso de Estudio: Dilema de Subsistencia</div>
                              <div className="space-y-3">
                                <div className="text-[10px] font-bold text-primary uppercase">Escenario de Entrada Idéntico</div>
                                <div className="p-4 bg-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-white/5">
                                   <div className="flex gap-4">
                                      <div className="px-3 py-2 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-500/20">X₄: HAMBRE (0.9)</div>
                                      <div className="px-3 py-2 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-xl border border-green-500/20">X₁₂: FRUTA (0.8)</div>
                                   </div>
                                   <div className="text-xs text-white italic font-body">"Estímulos idénticos, tres destinos neuronales"</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                    <div className="text-[10px] font-bold text-white uppercase flex items-center gap-2"><UserCog size={14} className="text-primary" /> Leñador</div>
                                    <div className="space-y-1">
                                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary w-[95%]" /></div>
                                      <div className="text-[9px] text-primary font-bold">TALAR: 0.95</div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground leading-tight italic">Su peso W para el trabajo es tan alto que ignora el dolor del hambre para cumplir su rol sistémico.</p>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                    <div className="text-[10px] font-bold text-white uppercase flex items-center gap-2"><UserCog size={14} className="text-accent" /> Cocinera</div>
                                    <div className="space-y-1">
                                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-accent w-[92%]" /></div>
                                      <div className="text-[9px] text-accent font-bold">RECOLECTAR: 0.92</div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground leading-tight italic">Su red detecta la fruta como prioridad absoluta de sustento, activando el sensor de nutrición inmediata.</p>
                                 </div>
                                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                    <div className="text-[10px] font-bold text-white uppercase flex items-center gap-2"><UserCog size={14} className="text-red-400" /> Niño</div>
                                    <div className="space-y-1">
                                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[99%]" /></div>
                                      <div className="text-[9px] text-red-400 font-bold">HUIR: 0.99</div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground leading-tight italic">El hambre crítica ($X_4$) se interpreta como una amenaza existencial, disparando el pánico ante la falta de adultos.</p>
                                 </div>
                              </div>
                              <div className="p-4 bg-primary/10 rounded-xl text-[10px] text-center text-primary font-bold uppercase tracking-widest border border-primary/20">
                                "El mismo entorno, tres configuraciones de pesos (W), tres comportamientos emergentes."
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="architect" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="space-y-6">
                            <h3 className="text-2xl font-headline font-bold text-white uppercase italic flex items-center gap-3">
                              <Sparkles className="text-yellow-500" /> Tú eres el Arquitecto
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              En este laboratorio no eres un jugador, eres un ingeniero de sistemas sociales. No mueves personajes con el teclado; manipulas las constantes matemáticas que rigen su realidad.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group hover:border-primary/50 transition-colors">
                                  <Terminal className="text-primary" />
                                  <div className="text-[10px] font-bold text-white uppercase">Comandos Semánticos</div>
                                  <p className="text-[10px] text-muted-foreground">Utiliza la terminal para inyectar intenciones globales (ej. 'hambre', 'miedo') que ajustan los pesos de toda la población.</p>
                               </div>
                               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group hover:border-accent/50 transition-colors">
                                  <UserCog className="text-accent" />
                                  <div className="text-[10px] font-bold text-white uppercase">Ecualización de Pesos</div>
                                  <p className="text-[10px] text-muted-foreground">Usa el panel de inspector para ajustar sliders de dominancia sináptica o resiliencia al trauma.</p>
                               </div>
                               <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group hover:border-yellow-500/50 transition-colors">
                                  <MousePointer2 className="text-yellow-500" />
                                  <div className="text-[10px] font-bold text-white uppercase">Intervención Quirúrgica</div>
                                  <p className="text-[10px] text-muted-foreground">Altera los Pesos W de un sujeto individual para forzar un cambio de rol o probar su resistencia ante un depredador.</p>
                               </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="learning" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="p-10 bg-primary/5 border border-primary/20 rounded-[3rem] space-y-8">
                             <h3 className="text-2xl font-headline font-bold text-white uppercase italic text-center">Bucle de Refuerzo Hebbiano</h3>
                             <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-32 p-3 bg-black/40 border border-white/10 rounded-xl text-[9px] text-center uppercase font-bold text-white">Acción (Ej. Talar)</div>
                                   <ArrowRight className="text-white/20" />
                                   <div className="w-32 p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-[9px] text-center uppercase font-bold text-green-400">Éxito (Madera)</div>
                                   <ArrowRight className="text-white/20" />
                                   <div className="w-32 p-3 bg-primary/20 border border-primary/40 rounded-xl text-[9px] text-center uppercase font-bold text-primary">Peso W (+)</div>
                                </div>
                                <div className="h-10 border-l border-dashed border-white/20" />
                                <div className="flex items-center gap-4">
                                   <div className="w-32 p-3 bg-black/40 border border-white/10 rounded-xl text-[9px] text-center uppercase font-bold text-white">Acción (Ej. Caza)</div>
                                   <ArrowRight className="text-white/20" />
                                   <div className="w-32 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-[9px] text-center uppercase font-bold text-red-400">Fracaso (Muerte)</div>
                                   <ArrowRight className="text-white/20" />
                                   <div className="w-32 p-3 bg-red-900/20 border border-red-500/40 rounded-xl text-[9px] text-center uppercase font-bold text-red-500">Peso W (-)</div>
                                </div>
                             </div>
                             <div className="text-center space-y-4 pt-6">
                                <p className="text-xl font-headline font-bold text-white uppercase italic">"Cada muerte es una oportunidad de aprendizaje para los que sobreviven."</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">La población entera muta su psiquis en tiempo real basándose en la telemetría del éxito colectivo.</p>
                             </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="stats" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="space-y-6">
                             <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40">
                                <table className="w-full text-left text-[10px] uppercase font-bold">
                                   <thead className="bg-white/5 text-muted-foreground">
                                      <tr>
                                         <th className="p-4 border-b border-white/10">Concepto</th>
                                         <th className="p-4 border-b border-white/10">Valor de Laboratorio</th>
                                      </tr>
                                   </thead>
                                   <tbody className="text-white divide-y divide-white/5">
                                      <tr><td className="p-4 text-muted-foreground">Sensores Totales</td><td className="p-4 text-primary">40 Vectores de Entrada</td></tr>
                                      <tr><td className="p-4 text-muted-foreground">Acciones Posibles</td><td className="p-4 text-accent">10 Tareas (Talar, Cazar, Defender...)</td></tr>
                                      <tr><td className="p-4 text-muted-foreground">Perfiles Neuronales</td><td className="p-4">6 Clases (Leñador, Guardián, etc.)</td></tr>
                                      <tr><td className="p-4 text-muted-foreground">Función de Activación</td><td className="p-4 font-code italic">Sigmoide (σ)</td></tr>
                                      <tr><td className="p-4 text-muted-foreground">Tipo de Aprendizaje</td><td className="p-4 text-yellow-500">Refuerzo Hebbiano Post-Mortem</td></tr>
                                   </tbody>
                                </table>
                             </div>
                          </div>
                        </TabsContent>

                      </div>
                    </ScrollArea>

                    <div className="p-6 border-t border-white/5 bg-black/40 flex justify-center">
                       <Button 
                         onClick={() => { setGuideOpen(false); setNetworkOpen(true); }}
                         className="bg-primary/20 hover:bg-primary text-primary hover:text-white uppercase text-xs font-bold tracking-widest px-8 rounded-full border border-primary/30 transition-all gap-2"
                       >
                         <Network size={16} /> VER RED NEURONAL COMPLETA
                       </Button>
                    </div>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

                        <Button 
              className="w-full h-16 bg-primary hover:bg-primary/80 text-white font-headline font-bold text-xl rounded-2xl transition-all shadow-[0_10px_40px_rgba(59,130,246,0.3)] group relative overflow-hidden"
              onClick={() => {
                const savedKey = localStorage.getItem('user_gemini_api_key');
                if (!savedKey) {
                  setMostrarConfigIA(true);
                  alert("Por favor, configura tu Gemini API Key antes de inicializar el núcleo.");
                } else {
                  setShowSim(true);
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3">
                INICIALIZAR NÚCLEO
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              </span>
            </Button>

            {/* Panel de Configuración de la API Key Dinámica */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <button 
                onClick={() => setMostrarConfigIA(!mostrarConfigIA)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                {mostrarConfigIA ? "Ocultar configuración de IA" : "Configuración de Núcleo Divino (IA)"}
              </button>

              {mostrarConfigIA && (
                <div className="mt-3 p-3 bg-black/40 border border-white/5 rounded-xl text-left">
                  <label className="text-[11px] font-bold text-primary block mb-1 uppercase tracking-wider">
                    Gemini API Key del Investigador
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={userApiKey}
                      onChange={(e) => setUserApiKey(e.target.value)}
                      className="flex-1 bg-background border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => {
                        if (!userApiKey.trim()) return alert("Ingresa una clave válida.");
                        localStorage.setItem('user_gemini_api_key', userApiKey.trim());
                        alert("¡Sincronización con la Matriz de Perceptrones exitosa!");
                        window.location.reload();
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                  <a 
                    href="https://google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary/70 hover:underline block mt-2 text-center"
                  >
                    ¿No tienes una clave? Consíguela gratis en Google AI Studio
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

