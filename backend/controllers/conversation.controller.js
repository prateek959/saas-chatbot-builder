import Conversation from "../models/conversation.schema.js";


const chatHistory = async (req, res) => {
    try {
        const { sessionID, botID } = req.body;

        const history = await Conversation.find({ sessionID, botID });

        res.status(200).json({ history });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export { chatHistory };