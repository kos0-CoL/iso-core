
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { SimulationState } from '@/lib/simulation-types';
import { WORLD_SIZE } from '@/lib/simulation-logic';

interface Props {
  state: SimulationState;
  onSelectEntity: (type: 'agent' | 'resource' | 'threat' | 'village', id: string) => void;
  focusTarget?: { x: number; y: number; zoom: number; timestamp: number } | null;
  selectedEntity: { type: string; id: string } | null;
}

export const IsometricCanvas: React.FC<Props> = ({ state, onSelectEntity, focusTarget, selectedEntity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  
  const offsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1.0);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMovedSignificant = useRef(false);

  useEffect(() => {
    const sources = [
      'Aldeano_Lenador', 'Aldeano_Mujer', 'Aldeano_Nino', 'Aldeano_Anciano', 'Aldeano_Recolector',
      'Animal_Lobo', 'Animal_Oso', 'Animal_Conejo', 'Animal_Deer', 'Animal_Boar',
      'Recurso_Arbol', 'Recurso_Roca', 'Recurso_Fruta', 'Accion_Talar', 'Edificio_Casa'
    ];
    
    const loadedImages: Record<string, HTMLImageElement> = {};
    let loadedCount = 0;

    sources.forEach(s => {
      const img = new Image();
      img.src = `/textures/${s}.png`;
      img.crossOrigin = "anonymous";
      img.onload = () => { 
        loadedImages[s] = img;
        loadedCount++;
        if (loadedCount === sources.length) setImages({ ...loadedImages });
      };
      img.onerror = () => {
        loadedCount++; 
        if (loadedCount === sources.length) setImages({ ...loadedImages });
      };
    });
  }, []);

  useEffect(() => {
    if (focusTarget && canvasRef.current) {
      const newZoom = focusTarget.zoom;
      const tileW = 64 * newZoom;
      const tileH = 32 * newZoom;
      zoomRef.current = newZoom;
      offsetRef.current = {
        x: - (focusTarget.x - focusTarget.y) * (tileW / 2),
        y: - (focusTarget.x + focusTarget.y) * (tileH / 2)
      };
    }
  }, [focusTarget]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const drawNeonSelection = (sx: number, sy: number, curZoom: number) => {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(1, 0.5);
      ctx.beginPath();
      ctx.arc(0, 0, 40 * curZoom, 0, Math.PI * 2);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 4 * curZoom;
      ctx.globalAlpha = 0.5;
      ctx.shadowBlur = 15 * curZoom;
      ctx.shadowColor = '#00E5FF';
      ctx.stroke();
      ctx.restore();
    };

    const drawOutline = (img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, zoom: number, row: number = 0) => {
      ctx.save();
      ctx.shadowBlur = 10 * zoom;
      ctx.shadowColor = '#00E5FF';
      
      const offsets = [{x:-1,y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];
      ctx.globalCompositeOperation = 'source-over';
      
      // Simple Glow approach
      ctx.drawImage(img, 0, row * 78, 94, 78, sx - (sw/2)*zoom, sy - sh*zoom, sw*zoom, sh*zoom);
      ctx.restore();
    };

    const render = () => {
      const curZoom = zoomRef.current;
      const TILE_W = 64 * curZoom;
      const TILE_H = 32 * curZoom;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2 + offsetRef.current.x;
      const centerY = canvas.height / 2 + offsetRef.current.y;

      const toIso = (x: number, y: number) => ({
        x: centerX + (x - y) * (TILE_W / 2),
        y: centerY + (x + y) * (TILE_H / 2)
      });

      for (let x = 0; x < WORLD_SIZE; x++) {
        for (let y = 0; y < WORLD_SIZE; y++) {
          const { x: sx, y: sy } = toIso(x, y);
          if (sx < -TILE_W || sx > canvas.width + TILE_W || sy < -TILE_H || sy > canvas.height + TILE_H) continue;
          const cell = state.grid[x][y];
          
          if (cell.isSown) ctx.fillStyle = '#452c1e';
          else if (cell.hasWater) ctx.fillStyle = '#1e40af';
          else {
            switch(cell.biome) {
              case 'Forest': ctx.fillStyle = '#064e3b'; break;
              case 'Desert': ctx.fillStyle = '#78350f'; break;
              case 'Snow': ctx.fillStyle = '#f8fafc'; break;
              case 'Sierra': ctx.fillStyle = '#475569'; break;
              case 'Hills': ctx.fillStyle = '#166534'; break;
              default: ctx.fillStyle = '#14532d';
            }
          }
          
          ctx.beginPath();
          ctx.moveTo(sx, sy); 
          ctx.lineTo(sx + TILE_W/2, sy + TILE_H/2); 
          ctx.lineTo(sx, sy + TILE_H); 
          ctx.lineTo(sx - TILE_W/2, sy + TILE_H/2);
          ctx.closePath(); 
          ctx.fill();
        }
      }

      state.resources.forEach(r => {
        if (r.respawnDay || r.quantity <= 0) return;
        const { x: sx, y: sy } = toIso(r.pos.x, r.pos.y);
        const isSelected = selectedEntity?.type === 'resource' && selectedEntity?.id === r.id;
        if (isSelected) drawNeonSelection(sx, sy + TILE_H/2, curZoom);

        const imgKey = r.isFruitBearing ? 'Recurso_Fruta' : (r.type === 'Rock' ? 'Recurso_Roca' : 'Recurso_Arbol');
        const img = images[imgKey];
        if (img) {
          const sw = imgKey === 'Recurso_Arbol' ? 117 : 64;
          const sh = imgKey === 'Recurso_Arbol' ? 90 : 64;
          ctx.drawImage(img, sx - (sw/2)*curZoom, sy - (sh*0.8)*curZoom, sw*curZoom, sh*curZoom);
        }
      });

      state.villages.forEach(v => {
        const { x: sx, y: sy } = toIso(v.pos.x, v.pos.y);
        const isSelected = selectedEntity?.type === 'village';
        if (isSelected) drawNeonSelection(sx, sy + TILE_H/2, curZoom);
        const img = images['Edificio_Casa'];
        if (img) ctx.drawImage(img, sx - 64 * curZoom, sy - 140 * curZoom, 127 * curZoom, 182 * curZoom);
      });

      state.threats.forEach(t => {
        if (t.health <= 0) return;
        const { x: sx, y: sy } = toIso(t.pos.x, t.pos.y);
        const isSelected = selectedEntity?.type === 'threat' && selectedEntity?.id === t.id;
        if (isSelected) drawNeonSelection(sx, sy + TILE_H/2, curZoom);

        let imgKey = 'Animal_Lobo';
        if (t.type === 'Bear') imgKey = 'Animal_Oso';
        else if (t.type === 'Rabbit') imgKey = 'Animal_Conejo';
        else if (t.type === 'Deer') imgKey = 'Animal_Deer';
        else if (t.type === 'Boar') imgKey = 'Animal_Boar';

        const img = images[imgKey];
        if (img) ctx.drawImage(img, sx - 32*curZoom, sy - 40*curZoom, 64*curZoom, 64*curZoom);
      });

      state.agents.forEach(a => {
        if (a.health <= 0) return;
        const { x: sx, y: sy } = toIso(a.pos.x, a.pos.y);
        const isSelected = selectedEntity?.type === 'agent' && selectedEntity?.id === a.id;
        if (isSelected) drawNeonSelection(sx, sy + TILE_H/2, curZoom);

        let imgKey = 'Aldeano_Lenador';
        if (a.type === 'Niño') imgKey = 'Aldeano_Nino';
        else if (a.type === 'Anciano') imgKey = 'Aldeano_Anciano';
        else if (a.type === 'Cocinera') imgKey = 'Aldeano_Mujer';
        else if (a.type === 'Explorador') imgKey = 'Aldeano_Recolector';
        
        const agentImg = images[imgKey];
        if (agentImg) {
          const row = a.direction === 'LEFT' ? 1 : a.direction === 'RIGHT' ? 2 : a.direction === 'UP' ? 3 : a.direction === 'IDLE' ? 4 : 0;
          if (isSelected) {
            ctx.save();
            ctx.shadowBlur = 10 * curZoom;
            ctx.shadowColor = '#00E5FF';
            ctx.drawImage(agentImg, 0, row * 78, 94, 78, sx - 47*curZoom, sy - 70*curZoom, 94*curZoom, 78*curZoom);
            ctx.restore();
          } else {
            ctx.drawImage(agentImg, 0, row * 78, 94, 78, sx - 47*curZoom, sy - 70*curZoom, 94*curZoom, 78*curZoom);
          }
        }

        if (a.currentTask === 'TALAR' || a.currentTask === 'RECOLECTAR') {
          const actionImg = images['Accion_Talar'];
          if (actionImg) {
            const frame = Math.floor(Date.now() / 200) % 4;
            ctx.drawImage(actionImg, 0, frame * 195, 86, 195, sx - 43*curZoom, sy - 150*curZoom, 86*curZoom, 195*curZoom);
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [state, images, selectedEntity]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    hasMovedSignificant.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    if (Math.abs(e.clientX - dragStartPos.current.x) > 5 || Math.abs(e.clientY - dragStartPos.current.y) > 5) hasMovedSignificant.current = true;
    offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!hasMovedSignificant.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const curZoom = zoomRef.current;
      const centerX = rect.width / 2 + offsetRef.current.x;
      const centerY = rect.height / 2 + offsetRef.current.y;
      const dx = (e.clientX - rect.left) - centerX;
      const dy = (e.clientY - rect.top) - centerY;
      const x = (dx / (32 * curZoom) + dy / (16 * curZoom)) / 2;
      const y = (dy / (16 * curZoom) - dx / (32 * curZoom)) / 2;
      
      const threat = state.threats.find(t => Math.hypot(t.pos.x - x, t.pos.y - y) < 3);
      if (threat) {
        onSelectEntity('threat', threat.id);
        return;
      }

      const resource = state.resources.find(r => Math.hypot(r.pos.x - x, r.pos.y - y) < 3 && !r.respawnDay);
      if (resource) {
        onSelectEntity('resource', resource.id);
        return;
      }

      const agent = state.agents.find(a => Math.hypot(a.pos.x - x, a.pos.y - y) < 4);
      if (agent) onSelectEntity('agent', agent.id);
      else {
        const village = state.villages.find(v => Math.hypot(v.pos.x - x, v.pos.y - y) < 6);
        if (village) onSelectEntity('village', village.id);
        else onSelectEntity('village', '');
      }
    }
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 0.9 : 1.1;
    zoomRef.current = Math.max(0.1, Math.min(5, zoomRef.current * scale));
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={1200} height={800} 
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { isDragging.current = false; }}
      className="w-full h-full bg-[#0a0a0a] cursor-grab active:cursor-grabbing" 
    />
  );
};
