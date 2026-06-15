"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, Sparkles, Terminal } from 'lucide-react';
import { divineSemanticAdjustment } from '@/ai/flows/divine-semantic-adjustment-flow';

interface Props {
  onApplyWeights: (weights: Record<string, number>) => void;
}

export const DivineTerminal: React.FC<Props> = ({ onApplyWeights }) => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    try {
    const result = await divineSemanticAdjustment({ command });
     if (result.success && result.adjustedWeights) {
        onApplyWeights(result.adjustedWeights);
        setCommand('');
    }
    } catch (error) {
      console.error("Semantic Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md mx-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-accent/20 blur-md group-focus-within:bg-accent/40 transition-all rounded-full" />
        <div className="relative flex items-center px-3 bg-card border border-border rounded-full hover:border-accent transition-colors">
          <Terminal size={14} className="text-accent mr-2" />
          <Input 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="DIVINE COMMAND (e.g., 'increase hunger impact')..." 
            className="border-0 bg-transparent focus-visible:ring-0 text-xs font-code placeholder:text-muted-foreground/50 h-9"
          />
          <Button 
            disabled={loading}
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 text-accent hover:bg-accent/10 rounded-full"
          >
            {loading ? <div className="w-3 h-3 border-2 border-accent border-t-transparent animate-spin rounded-full" /> : <Sparkles size={14} />}
          </Button>
        </div>
      </div>
    </form>
  );
};
