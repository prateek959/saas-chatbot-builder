import Bot from "../models/chatbot.model.js";
import Chunk from "../models/chunk.model.js";
import Queue from "../models/queue.schema.js";
import generateEmbeddingBatch from "../service/gemini.embedding.js";
import extractText from "../utils/resumeparser.js";
import fs from 'fs/promises';


const docUpload = async (req, res) => {
    try {
        const { chatbotName } = req.body;

        const text = await extractText(req.file.path, req.file.mimetype);

        if (!text) {
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({
                message: "Unable to read the document. Please upload a valid file.",
            });
        };
        // await fs.unlink(req.file.path).catch(() => { });
        const bot = await Bot.create({
            userID: req.user.id,
            name: chatbotName,
            apiKey: req.user.id,
            status: "processing"
        });

        const CHUNK_SIZE = 1200;
        const STEP = CHUNK_SIZE - 200;

        let chunks = [];
        let start = 0;

        while (start < text.length) {
            let end = Math.min(start + CHUNK_SIZE, text.length);

            chunks.push({
                chatbotID: bot._id,
                text: text.slice(start, end),
                status: "Pending"
            });

            if (end == text.length) {
                break;
            }

            start += STEP

        }

        await Chunk.insertMany(chunks);

        const pendingChunks = await Chunk.find({
            chatbotID: bot._id,
            status: "Pending",
        }).limit(5);

        if (pendingChunks.length === 0) {
            bot.status = "ready";
            await bot.save();

            return res.status(200).json({
                message: "Your chatbot is ready to use.",
            });
        };


        try {
            const texts = pendingChunks.map((c) => c.text);
            const vectors = await generateEmbeddingBatch(texts);
            // console.log(vectors);
            for (let i = 0; i < pendingChunks.length; i++) {
                await Chunk.updateOne(
                    { chatbotID: pendingChunks[i].chatbotID },
                    { embedding: vectors[i], status: "Done" }
                )
            }

        } catch (aiError) {

            await Queue.create({
                chatbotId: bot._id
            });

            return res.status(202).json({
                message:
                    "Your chatbot is being prepared. Some processing is still in progress.",
            });
        };

        const remaining = await Chunk.findOne({
            chatbotID: bot._id,
            status: "Pending"
        });

        if (!remaining) {
            bot.status = "ready";
            await bot.save();

            return res.status(200).json({
                message: "Your chatbot is ready to use.",
            });
        }
        await Queue.create({
            chatbotId: bot._id
        });
        res.status(202).json({
            message: "Your chatbot is being processed. It will be ready shortly.",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong while processing your document.",
        });
    }
}

export { docUpload };