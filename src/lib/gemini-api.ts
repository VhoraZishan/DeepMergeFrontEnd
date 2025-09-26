import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

export async function queryGemini(userQuery: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are an AI Ocean Assistant.
      Your goal is to answer questions about oceanographic data, fisheries, and biodiversity.
      
      IMPORTANT RULE: Provide your answer as plain text only. 
      Do not use any Markdown formatting like asterisks (*), backticks (\`), or hashtags (#).
    `;

    const fullPrompt = `${systemInstruction}\n\nUser Question: "${userQuery}"`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    return result.response.candidates[0]?.content.parts[0]?.text || "⚠️ No response from Gemini.";
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return "⚠️ Could not query Gemini API.";
  }
}
