import { GoogleGenAI, Type } from "@google/genai";
import type { PartIdentificationResult } from '../types';

// FIX: Per Gemini API guidelines, the API key must be sourced from process.env.API_KEY.
// This also resolves the TypeScript error for `import.meta.env`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: any = {
  type: Type.OBJECT,
  properties: {
    identifiedPart: {
      type: Type.OBJECT,
      properties: {
        partName: { type: Type.STRING, description: "Nome técnico completo da peça identificada." },
        description: { type: Type.STRING, description: "Breve descrição da função e aplicação da peça." },
        specifications: {
          type: Type.ARRAY,
          description: "Lista de especificações técnicas chave.",
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING, description: "Nome da especificação (ex: Tensão, Corrente, Capacitância)." },
              value: { type: Type.STRING, description: "Valor e unidade da especificação (ex: 220V, 10A, 100uF)." },
            },
            required: ["key", "value"],
          },
        },
      },
      required: ["partName", "description", "specifications"],
    },
    equivalentParts: {
      type: Type.ARRAY,
      description: "Lista com 3 a 5 peças equivalentes ou compatíveis de diferentes fabricantes.",
      items: { type: Type.STRING },
    },
    marketplaceListings: {
      type: Type.ARRAY,
      description: "Lista de 3 ofertas fictícias em marketplaces para a peça.",
      items: {
        type: Type.OBJECT,
        properties: {
          seller: { type: Type.STRING, description: "Nome do vendedor (ex: 'Eletrônica Brasil', 'Import Peças PY', 'Global Parts CN')." },
          priceBRL: { type: Type.NUMBER, description: "Preço do produto em Reais (BRL)." },
          shippingTime: { type: Type.STRING, description: "Estimativa de tempo de entrega (ex: '3-5 dias', '20-30 dias')." },
          rating: { type: Type.NUMBER, description: "Avaliação do vendedor de 0 a 5." },
        },
        required: ["seller", "priceBRL", "shippingTime", "rating"],
      },
    },
  },
  required: ["identifiedPart", "equivalentParts", "marketplaceListings"],
};

export async function identifyPartFromImage(base64Image: string): Promise<PartIdentificationResult> {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: `Você é um especialista em catalogação de peças para eletricistas e mecânicos chamado "PeçaCerta". Analise a imagem de um componente elétrico/mecânico.

    Siga estas instruções estritamente:
    1.  **Identifique a Peça:** Forneça o nome técnico, uma descrição clara da sua função e as principais especificações técnicas visíveis ou inferidas (como Tensão, Corrente, Capacitância, dimensões, etc.).
    2.  **Liste Equivalentes:** Sugira de 3 a 5 peças equivalentes ou compatíveis, incluindo marca e modelo se possível.
    3.  **Simule Preços:** Crie 3 listagens fictícias de marketplaces, representando mercados diferentes (Brasil, Paraguai, China), com preço em BRL, prazo de entrega e avaliação do vendedor.
    4.  **Idioma:** Responda em Português do Brasil.
    5.  **Formato:** Retorne a resposta estritamente no formato JSON definido pelo schema. Não inclua markdown (aspas triplas de json) na saída.`,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });
  
  const jsonText = response.text.trim();
  
  try {
    return JSON.parse(jsonText) as PartIdentificationResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("A resposta da IA não estava no formato JSON esperado.");
  }
}
