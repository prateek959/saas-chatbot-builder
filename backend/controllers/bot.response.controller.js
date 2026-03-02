import Bot from "../models/chatbot.model.js";
import crypto from 'crypto'
import Conversation from "../models/conversation.schema.js";
import generateEmbeddingBatch from "../service/gemini.embedding.js";
import Chunk from "../models/chunk.model.js";
import askAI from "../service/gemini.service.js";

const cosineSimilarity = (a, b) => {
    let dot = 0, magA = 0, magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const botQuestion = async (req, res) => {
    try {
        let { botID, question, sessionID } = req.body;
        if (!botID || !question) {
            return res.status(400).json({
                message: "botID and question are required",
            });
        }
        const chatbot = await Bot.findById(botID);

        if (!chatbot) {
            return res.status(400).json({ message: "ChatBot Not Found" });
        };

        if (chatbot.status !== "ready") {
            return res.status(200).json({
                message: "Chatbot is still processing",
            });
        }

        if (!sessionID) {
            sessionID = crypto.randomUUID();
        };
        const history = await Conversation.findOne({ botID, sessionID, userMessage: question });

        if (history) {
            return res.status(200).json({
                answer: history.botMessage,
                sessionID,
            });
        }
        try {
            const vectors = await generateEmbeddingBatch([question]);
            if (!vectors || !vectors.length) {
                return res.status(500).json({
                    message: "Embedding failed",
                });
            }
            const questionVector = vectors[0]
            const chunks = await Chunk.find({ chatbotID: botID, status: "Done" });
            if (!chunks.length) {
                return res.status(200).json({
                    answer: "No knowledge available in chatbot.",
                    sessionID,
                });
            }
            let scoredChunks = [];

            for (let chunk of chunks) {
                const score = cosineSimilarity(questionVector, chunk.embedding);

                scoredChunks.push({
                    text: chunk.text,
                    score
                });

            }
            if (!scoredChunks.length) {
                return res.status(200).json({
                    answer: "No relevant information found.",
                    sessionID,
                });
            }
            scoredChunks.sort((a, b) => b.score - a.score);
            const bestContext = scoredChunks.slice(0, 3).map((c) => c.text).join('\n\n');

            let historyChat = await Conversation.find({ botID, sessionID })
                .sort({ createdAt: -1 }) 
                .limit(10)               
                .lean();                   
        
            historyChat = historyChat.reverse();

            historyChat = historyChat.map(msg => ({
                role: msg.userMessage ? "user" : "assistant",
                content: msg.userMessage || msg.botMessage
            }));


            const answer = await askAI(question, bestContext, historyChat);

            await Conversation.create({
                botID,
                sessionID,
                userMessage: question,
                botMessage: answer
            });

            res.status(200).json({ answer, sessionID, });

        } catch (aierror) {
            console.log("AI Error:", aierror);
            return res.status(429).json({
                message:
                    "AI is currently busy. Please try again in a moment.",
            });
        };

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export { botQuestion };