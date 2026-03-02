import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateEmbeddingBatch = async (input) => {
  try {

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: input,
    });

    const vectors = response.embeddings.map((item) => item.values);
    return vectors;

  } catch (error) {
    console.log("Embedding error:", error.message);
    throw new Error("Embedding failed");
  }
};

export default generateEmbeddingBatch;
