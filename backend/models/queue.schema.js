import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatbot",
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Done"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue
