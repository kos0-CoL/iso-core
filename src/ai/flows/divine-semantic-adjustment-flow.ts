'use client';

import { callGemini } from '@/ai/genkit';

export type DivineSemanticAdjustmentInput = {
  command: string;
};

export type DivineSemanticAdjustmentOutput = {
  success: boolean;
  message: string;
  adjustedWeights: Record<string, number>;
};

export async function divineSemanticAdjustment(
  input: DivineSemanticAdjustmentInput
): Promise<DivineSemanticAdjustmentOutput> {
  try {
    // Armando el prompt idéntico al que tenías originalmente
    const promptMaster = `Eres el Arquitecto de Vectores del sistema ISO-CORE.
Tu función es interpretar los "Comandos Divinos" del investigador y traducirlos a ajustes numéricos (0.0 a 1.0) en la Matriz de Perceptrones.

Comando del Investigador: "${input.command}"

Lista de Pesos Disponibles para ajustar:
- hambre_aldea_impacto
- peligro_global_impacto
- oso_peligro
- oso_carne_recompensa
- curiosidad_global
- resiliencia_trauma

INSTRUCCIONES:
1. Analiza la intención semántica del comando.
2. Calcula los nuevos valores para los pesos afectados.
3. Devuelve OBLIGATORIAMENTE una respuesta en formato JSON puro que coincida exactamente con esta estructura, sin textos extras fuera del JSON:
{
  "success": true,
  "message": "Explicación divina de los cambios.",
  "adjustedWeights": { "hambre_aldea_impacto": 0.5 }
}`;

    // Llamamos a la IA local de PC
    const responseText = await callGemini(promptMaster);
    
    // Limpiamos la respuesta por si Gemini devuelve formato markdown (```json ... ```)
    const jsonLimpio = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultado = JSON.parse(jsonLimpio);

    return {
      success: resultado.success ?? true,
      message: resultado.message ?? 'Ajuste completado.',
      adjustedWeights: resultado.adjustedWeights ?? {}
    };

  } catch (error) {
    console.error('Divine Error:', error);
    return {
      success: false,
      message: 'Fallo en la conexión sináptica divina. Revisa tu API Key de Gemini.',
      adjustedWeights: {}
    };
  }
}

