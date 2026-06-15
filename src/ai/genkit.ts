import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_gemini_api_key') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }
  return process.env.GEMINI_API_KEY || '';
};

export async function callGemini(promptTexto: string) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("No hay API Key configurada.");

  // CORREGIDO: Se invoca la clase oficial nativa con su nombre real completo
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent(promptTexto);
  return result.response.text();
}

