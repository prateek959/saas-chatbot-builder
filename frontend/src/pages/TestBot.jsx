import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TestBot = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionID, setSessionID] = useState(null);

  // ✅ bot status states
  const [botStatus, setBotStatus] = useState("checking"); 
  // checking | none | processing | ready

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // ✅ Check bot status on load
  useEffect(() => {
    const checkBotStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5004/bot/script", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "processing") {
          setBotStatus("processing");
        } else if (res.data.status === "ready") {
          setBotStatus("ready");
        } else {
          setBotStatus("none");
        }
      } catch (err) {
        setBotStatus("none");
      }
    };

    checkBotStatus();
  }, [token]);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = question.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5004/bot/test",
        { question: userMessage, sessionID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.message) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: res.data.message },
        ]);
      } else if (res.data.answer) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: res.data.answer },
        ]);

        if (res.data.sessionID) {
          setSessionID(res.data.sessionID);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: err.response?.data?.message || "Something went wrong",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // ✅ Loading state
  if (botStatus === "checking") {
    return (
      <div className="p-6 text-center text-gray-500">
        Checking bot status...
      </div>
    );
  }

  // ✅ No bot created
  if (botStatus === "none") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            🚀 Create Your Chatbot First
          </h2>
          <p className="text-gray-500 mb-4">
            You need to create a chatbot before testing it.
          </p>
          <Link
            to="/dashboard/create-bot"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Create Chatbot
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Bot processing
  if (botStatus === "processing") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            ⏳ Your Chatbot is Processing
          </h2>
          <p className="text-gray-500">
            Please wait while we prepare your bot...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Bot ready → show chat UI
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-100 p-6">

      <div className="bg-white shadow-md rounded-xl p-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          🤖 Test Your AI Bot
        </h1>
      </div>

      <div className="flex-1 bg-white shadow-lg rounded-xl flex flex-col overflow-hidden">

        <div className="flex-1 overflow-auto p-6 space-y-3 bg-gray-50">

          {messages.length === 0 && (
            <p className="text-gray-400 text-center">
              Ask a question to start chatting...
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl shadow-sm text-sm ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white border text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-green-500 to-blue-600"
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestBot;
