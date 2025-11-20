import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlanetAnalysis } from "../types";

// ใช้ import.meta.env สำหรับ Vite (ต้องมี prefix VITE_)
const apiKey = import.meta.env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePlanetImage = async (base64Image: string, mimeType: string): Promise<PlanetAnalysis> => {
  if (!apiKey) {
    throw new Error("ไม่พบ API Key กรุณาตรวจสอบการตั้งค่า Environment Variable: VITE_API_KEY");
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      planetName: { type: Type.STRING, description: "Name of the planet or celestial body identified." },
      isSolarSystem: { type: Type.BOOLEAN, description: "True if it belongs to our Solar System, False otherwise." },
      earthSimilarityPercentage: { type: Type.INTEGER, description: "Percentage (0-100) representing similarity to Earth in terms of composition and atmosphere." },
      habitabilityScore: { type: Type.INTEGER, description: "Score (0-100) representing how likely humans can survive there." },
      habitabilityAnalysis: { type: Type.STRING, description: "A short analysis in Thai language about human habitability." },
      compositionComparison: { type: Type.STRING, description: "A short comparison in Thai language of its composition vs Earth." },
    },
    required: ["planetName", "isSolarSystem", "earthSimilarityPercentage", "habitabilityScore", "habitabilityAnalysis", "compositionComparison"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Analyze this image of a planet or celestial body. Identify it. If it's a fictional or unknown planet, estimate its properties based on visual appearance. Provide the output strictly in JSON format as per the schema. Respond in Thai language for the text descriptions.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as PlanetAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("เกิดข้อผิดพลาดในการวิเคราะห์ภาพ: กรุณาตรวจสอบ API Key หรือลองใหม่อีกครั้ง");
  }
};