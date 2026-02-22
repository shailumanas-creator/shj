
import { GoogleGenAI, Type } from "@google/genai";
import { StockAnalysis, StockSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_PROMPT = (stockSymbol: string) => `
Analyze the Indian stock "${stockSymbol}" using real-time search data. 
Explicitly reference Trendlyne (https://trendlyne.com/equity/${stockSymbol.split(':')[0]}/) for technical and fundamental ratios.
Evaluate it strictly against "Shailu's Long-term Screener" 16-point conditions.

Provide the response in the specified JSON schema. Ensure all numeric data (PE, PEG, Debt, RSI, DMA, Interest Coverage, Free Cash Flow) are current for 2024-2025.
`;

const CATEGORY_SCREENER_PROMPT = (category: 'FUNDAMENTAL' | 'TECHNICAL' | 'CHECKLIST') => {
  if (category === 'FUNDAMENTAL') {
    return `Act as a professional Indian market fundamental analyst. 
    Identify 10 high-quality stocks that are currently (early 2025) top performers based ONLY on fundamental strength.
    Criteria:
    1. ROCE > 20% consistently for 3 years.
    2. Debt to Equity < 0.5.
    3. Revenue and Profit CAGR > 15% (5-year).
    4. Positive Free Cash Flow (FCF) for the last 3 years.
    5. No significant promoter pledging (<10%).
    Return a JSON array of objects with: symbol, name, sector, reason, fundamentalScore (75-100), and technicalScore.`;
  }
  
  if (category === 'TECHNICAL') {
    return `Act as a professional Indian market technical analyst.
    Identify 10 stocks with the strongest bullish momentum in the NSE/BSE.
    Criteria:
    1. Price is at least 10% above the 200-Day Moving Average.
    2. 50-DMA is above the 200-DMA (Golden Cross).
    3. RSI is in the 50-70 range (Bullish Momentum).
    4. Recent volume breakout (above 20-day average).
    Return a JSON array of objects with: symbol, name, sector, reason, fundamentalScore, and technicalScore (75-100).`;
  }

  return `Identify 10 high-quality Indian stocks that satisfy Shailu's full 16-point checklist (both Fundamental and Technical). 
  These should be the best "Wealth Creation" opportunities for 2025.
  Return a JSON array of objects with: symbol, name, sector, reason, fundamentalScore, and technicalScore.`;
};

export const fetchTopPicks = async (category: 'HOME' | 'FUNDAMENTAL' | 'TECHNICAL' | 'CHECKLIST' = 'HOME'): Promise<StockSummary[]> => {
  const model = 'gemini-3-pro-preview';
  
  // Route to the appropriate prompt
  const prompt = category === 'HOME' 
    ? `Identify 8 high-quality Indian stocks satisfying both high fundamental quality and bullish technical trends. Ensure fundamentalScore is at least 70/100.`
    : CATEGORY_SCREENER_PROMPT(category as any);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            name: { type: Type.STRING },
            sector: { type: Type.STRING },
            reason: { type: Type.STRING },
            fundamentalScore: { type: Type.NUMBER },
            technicalScore: { type: Type.NUMBER }
          },
          required: ["symbol", "name", "sector", "reason", "fundamentalScore", "technicalScore"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeStock = async (query: string): Promise<StockAnalysis> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: ANALYSIS_PROMPT(query),
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          fundamentalScore: { type: Type.NUMBER },
          technicalScore: { type: Type.NUMBER },
          overallVerdict: { type: Type.STRING },
          fundamentals: {
            type: Type.OBJECT,
            properties: {
              businessModel: { $ref: "#/definitions/condition" },
              revenueGrowth: { $ref: "#/definitions/condition" },
              profitGrowth: { $ref: "#/definitions/condition" },
              returnRatios: { $ref: "#/definitions/condition" },
              debtManagement: { $ref: "#/definitions/condition" },
              cashFlow: { $ref: "#/definitions/condition" },
              managementQuality: { $ref: "#/definitions/condition" },
              shareholdingPattern: { $ref: "#/definitions/condition" },
              valuation: { $ref: "#/definitions/condition" },
              scalability: { $ref: "#/definitions/condition" }
            }
          },
          technicals: {
            type: Type.OBJECT,
            properties: {
              primaryTrend: { $ref: "#/definitions/condition" },
              verticalRally: { $ref: "#/definitions/condition" },
              movingAverages: { $ref: "#/definitions/condition" },
              supportZones: { $ref: "#/definitions/condition" },
              volumeBehavior: { $ref: "#/definitions/condition" },
              rsiStatus: { $ref: "#/definitions/condition" }
            }
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              revenueCAGR: { type: Type.STRING },
              profitCAGR: { type: Type.STRING },
              roe: { type: Type.STRING },
              roce: { type: Type.STRING },
              debtToEquity: { type: Type.STRING },
              interestCoverage: { type: Type.STRING },
              freeCashFlow: { type: Type.STRING },
              peRatio: { type: Type.STRING },
              pegRatio: { type: Type.STRING },
              promoterHolding: { type: Type.STRING },
              promoterPledging: { type: Type.STRING },
              rsi: { type: Type.NUMBER },
              dma200: { type: Type.NUMBER },
              dma50: { type: Type.NUMBER }
            }
          }
        },
        definitions: {
          condition: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              status: { type: Type.STRING },
              value: { type: Type.STRING },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  const analysis = JSON.parse(response.text);
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks.map((chunk: any) => ({
    title: chunk.web?.title || 'Market Source',
    uri: chunk.web?.uri || '#'
  }));

  return { ...analysis, sources };
};
