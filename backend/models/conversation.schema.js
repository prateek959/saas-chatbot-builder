import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
    botID: { type: mongoose.Schema.Types.ObjectId, ref: 'bot', required: true },
    sessionID: { type: String, required: true },
    userMessage: { type: String },
    botMessage: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 }
});


const Conversation = mongoose.model('conversation', conversationSchema);

export default Conversation;