
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, CreditCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsights = async (expenses: Expense[], cards: CreditCard[]) => {
  if (!process.env.API_KEY) return "Configure sua API Key para receber insights.";
  if (expenses.length === 0) return "Adicione algumas despesas para que eu possa analisar seu perfil financeiro.";

  const prompt = `
    Analise o seguinte perfil de gastos de cartão de crédito e forneça 3 sugestões práticas de economia e detecte se há algum gasto fora do padrão.
    
    Cartões: ${JSON.stringify(cards)}
    Gastos: ${JSON.stringify(expenses)}
    
    Responda em português de forma amigável e executiva.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar insights no momento. Tente novamente mais tarde.";
  }
};
