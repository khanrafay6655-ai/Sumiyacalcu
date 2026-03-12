import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainCalculation(expression: string, result: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Explain the following calculation step-by-step: ${expression} = ${result}. Provide context if it's a common scientific or mathematical formula.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't generate an explanation at this time.";
  }
}

export async function solveWordProblem(problem: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Solve the following mathematical word problem. Provide the final answer and a clear step-by-step explanation: ${problem}`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error while trying to solve this problem.";
  }
}
