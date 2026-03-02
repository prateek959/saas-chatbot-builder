import Bot from "../models/chatbot.model.js";
import crypto from 'crypto'
import generateEmbeddingBatch from "../service/gemini.embedding.js";
import Chunk from "../models/chunk.model.js";
import askAI from "../service/gemini.service.js";
import Conversation from "../models/conversation.schema.js";

const cosineSimilarity = (a, b) => {
    let dot = 0, magA = 0, magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const checkBot = async (req, res) => {
    try {
        let { question, sessionID } = req.body;

        const chatbot = await Bot.findOne({ userID: req.user.id });

        if (!chatbot) {
            return res.status(404).json({
                message: "Chatbot not found.",
            });
        };

        if (chatbot.status === "processing") {
            return res.status(200).json({
                message: "Your chatbot is being prepared. Please wait while processing completes.",
            });
        };

        if (!sessionID) {
            sessionID = crypto.randomUUID();
        }

        const history = await Conversation.findOne({ botID: chatbot._id, userMessage: question });

        if (history) {
            await Conversation.create({
                botID: chatbot._id,
                sessionID: sessionID,
                userMessage: question,
                botMessage: history.botMessage
            });
            return res.status(200).json({
                answer: history.botMessage,
                sessionID,
            });
        }

        try {
            const questionVector = await generateEmbeddingBatch([question]);

            const chunks = await Chunk.find({ chatbotID: chatbot._id, status: "Done" });

            let scoredChunks = [];

            for (const chunk of chunks) {
                const score = cosineSimilarity(questionVector, chunk.embedding);

                scoredChunks.push({
                    text: chunk.text,
                    score,
                });

            };

            scoredChunks.sort((a, b) => b.score - a.score);

            const bestContext = scoredChunks.slice(0, 3).map((c) => c.text).join("\n\n");

            const answer = await askAI(question, bestContext);
            await Conversation.create({
                botID: chatbot._id,
                sessionID: sessionID,
                userMessage: question,
                botMessage: answer
            });
            res.status(200).json({
                answer,
                sessionID,
            });


        } catch (aierror) {
            console.log("AI Error:", aierror);
            return res.status(429).json({
                message:
                    "AI is currently busy. Please try again in a moment.",
            });
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Unable to process your request.",
        });
    }
};


export { checkBot };