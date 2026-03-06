import Bot from "../models/chatbot.model.js";


const getscript = async (req, res) => {
    try {

        const bot = await Bot.findOne({ userID: req.user.id });

        if (!bot) {
            return res.status(404).json({
                success: false,
                message: "Chatbot not found",
            });
        }

        if (bot.status !== "ready") {
            return res.status(200).json({
                success: true,
                status: "processing",
                message: "Your chatbot is still being prepared. Please try again in a few moments.",
                data: null,
            });
        }

        // const API = `http://localhost:5004/widget.js`;
        const API = "https://saas-chatbot-builder-production.up.railway.app/widget.js";


        return res.status(200).json({
            success: true,
            status: "ready",
            message: "Chatbot script generated successfully.",
            data: {
                API,
                botID:bot._id
            },
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {getscript}