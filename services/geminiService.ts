
import { GoogleGenAI, Modality } from "@google/genai";
import { config } from '../config';

const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      if (base64Data) {
        resolve({ data: base64Data, mimeType: file.type });
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generateSimulation = async (beforeFile: File, referenceFile: File, prompt: string): Promise<string> => {
  const apiKey = config.apiKey;
  if (!apiKey) {
    throw new Error("API_KEY is not set in config.ts.");
  }
  
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const [beforeImagePart, referenceImagePart] = await Promise.all([
      fileToBase64(beforeFile),
      fileToBase64(referenceFile),
    ]);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: beforeImagePart },
                { inlineData: referenceImagePart },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("No image was generated. The AI may not have been able to process the request.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Failed to generate the simulation. Please ensure the photos are clear and front-facing.";
    if (error instanceof Error) {
        if (error.message.includes('429')) {
            errorMessage = "API rate limit exceeded. Please wait a moment and try again.";
        } else {
            // Include the original error message for more context
            errorMessage = `An error occurred during the API call: ${error.message}`;
        }
    }
    throw new Error(errorMessage);
  }
};
