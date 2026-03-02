import Queue from "../models/queue.schema.js";
import Chunk from "../models/chunk.model.js";
import Bot from "../models/chatbot.model.js";
import generateEmbeddingBatch from "../service/gemini.embedding.js";

const processQueue = async () => {
  try {
    // 1. queue se sabse purana chatbot uthao
    const job = await Queue.findOne({ status: "Pending" }).sort({
      createdAt: 1,
    });

    if (!job) {
      console.log("No pending jobs");
      return;
    }

    const chatbotId = job.chatbotId;

    // 2. pending chunks lao (5 ek sath)
    const chunks = await Chunk.find({
      chatbotID: chatbotId,
      status: "Pending",
    }).limit(5);

    if (chunks.length === 0) {
      // 3. sab done → chatbot ready
      await Bot.findByIdAndUpdate(chatbotId, { status: "ready" });
      await Queue.deleteOne({ _id: job._id });

      console.log("Chatbot ready:", chatbotId);
      return;
    }

    // 4 embedding karo
    const texts = chunks.map((c) => c.text);
    const vectors = await generateEmbeddingBatch(texts);

    // 5️⃣ DB update karo
    for (let i = 0; i < chunks.length; i++) {
      await Chunk.findByIdAndUpdate(chunks[i]._id, {
        embedding: vectors[i],
        status: "Done",
      });
    }

    console.log("Processed batch for:", chatbotId);
  } catch (error) {
    console.log("Worker error:", error.message);
  }
};

export default processQueue;
