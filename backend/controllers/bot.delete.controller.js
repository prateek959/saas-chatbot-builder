import Bot from '../models/chatbot.model.js'
import Chunk from '../models/chunk.model.js'
import Queue from '../models/queue.schema.js';
import extractText from '../utils/resumeparser.js';
import fs from 'fs/promises';


const deleteBot = async (req, res) => {
    try {
        const bot = await Bot.findOne({ userID: req.user.id });

        if (!bot) {
            return res.status(404).json({ message: "Bot Not found" });
        };


        await Chunk.deleteMany({ chatbotID: bot._id });
        await Queue.deleteOne({chatbotId:bot._id});
        await Bot.findByIdAndDelete(bot._id);
        res.status(200).json({ message: "ChatBot Deleted Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const addDoc = async (req, res) => {
    try {
        const bot = await Bot.findOne({ userID: req.user.id });

        if (!bot) {
            return res.status(404).json({ message: "Bot Not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File is Needed to Add document" });
        }
        const text = await extractText(req.file.path, req.file.mimetype);

        if (!text) {
           await fs.unlink(req.file.path).catch(() => {});
            return res.status(400).json({
                message: "Unable to read the document. Please upload a valid file.",
            });
        };

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

            if (end === text.length) {
                break;
            }

            start += STEP;

        };


        await Chunk.insertMany(chunks);
        bot.status = "processing"
        await bot.save();

        const pendingChunks = await Chunk.findOne({ chatbotID: bot._id, status: "Pending" });

        if (!pendingChunks) {
            bot.status = "ready";
            await bot.save();

            return res.status(200).json({
                message: "Your chatbot is ready to use.",
            });
        };

        await Queue.findOneAndUpdate(
            { chatbotId: bot._id },
            { chatbotId: bot._id },
            { upsert: true }
        );
        await fs.unlink(req.file.path).catch(() => {});
        res.status(202).json({
            message: "Your chatbot is being processed. It will be ready shortly.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export { deleteBot, addDoc };