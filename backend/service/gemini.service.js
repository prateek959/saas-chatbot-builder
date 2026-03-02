import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemPrompt = `
You are a professional human assistant.

Rules:
- Answer naturally like a human expert.
- Do NOT mention words like "context", "document", or "provided information".
- Give clear, direct, and helpful answers.
- If the answer is not found, say politely that you don’t have enough information.
- Keep the tone professional and conversational.
`;

const askAI = async (question, context = "", history = []) => {

  const historyText = history
    .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  const userPrompt = `
${systemPrompt}

${historyText ? `Conversation so far:\n${historyText}\n\n` : ""}

Information:
${context}

User Question:
${question}

Write a helpful answer:
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userPrompt,
  });

  return response.text;
};

export default askAI;
