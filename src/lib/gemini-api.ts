import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

export async function queryGemini(userQuery: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- Start of Changes ---

    // 1. Define the rules for the AI
    const systemInstruction = `
      You are an AI Ocean Assistant.
      Your goal is to answer questions about oceanographic data, fisheries, and biodiversity.
      
      IMPORTANT RULE: Provide your answer as plain text only. 
      Do not use any Markdown formatting like asterisks (*), backticks (\`), or hashtags (#).
    `;

    // 2. Combine your rules with the user's question
    const fullPrompt = `${systemInstruction}\n\nUser Question: "${userQuery}"`;

    // 3. Send the combined prompt to the AI
    const result = await model.generateContent(fullPrompt);

    // --- End of Changes ---

    return result.response.text();
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return "⚠️ Could not query Gemini API.";
  }
}