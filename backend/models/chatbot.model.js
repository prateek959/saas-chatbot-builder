import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true, trim: true },
    apiKey: { type: String, unique: true, required: true },
    status: {type: String,enum: ["processing", "ready"],default: "processing"}

}, { timestamps: true });

const Bot = mongoose.model("bot", chatbotSchema);

export default Bot;
