import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const generateBingoItems = async (topic: string): Promise<string[]> => {
  try {
    const aiInstance = getAI();
    const prompt = `Generate a list of exactly 24 short, punchy, and fun bingo square items for the topic: "${topic}". 
    The items should be tropes, predictions, or common occurrences related to the topic. 
    Keep each item under 50 characters. 
    Do not include a free space.`;

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const items = JSON.parse(response.text || "[]");
    
    // Validate we got an array
    if (!Array.isArray(items)) {
      throw new Error("Invalid format received from AI");
    }

    // Ensure we have exactly 24 items (if more, slice; if less, pad)
    let processedItems = items.map(String).slice(0, 24);
    while (processedItems.length < 24) {
      processedItems.push("Wildcard");
    }

    return processedItems;

  } catch (error) {
    console.error("Error generating bingo items:", error);
    throw new Error("Failed to generate items. Please try again.");
  }
};
