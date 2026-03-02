import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GetScript = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);

  // ✅ bot status
  const [botStatus, setBotStatus] = useState("checking");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchScript = async () => {
      setLoading(true);

      try {
        const res = await axios.get("http://localhost:5004/bot/script", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "processing") {
          setBotStatus("processing");
          setMessage(res.data.message);
        } else if (res.data.status === "ready") {
          const botID = res.data.data.botID;
          const API = res.data.data.API;
          const scriptTag = `<script src="${API}" data-bot-id="${botID}"></script>`;

          setScript(scriptTag);
          setMessage(res.data.message);
          setBotStatus("ready");
        } else {
          setBotStatus("none");
        }
      } catch (err) {
        // ✅ If bot not found
        setBotStatus("none");
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Checking state
  if (loading && botStatus === "checking") {
    return (
      <div className="p-6 text-center text-gray-500">
        Checking chatbot status...
      </div>
    );
  }

  // ✅ Chatbot not found
  if (botStatus === "none") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            ❌ Chatbot Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            You need to create a chatbot first.
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

  // ✅ Processing
  if (botStatus === "processing") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">
            ⏳ Chatbot is Processing
          </h2>
          <p className="text-gray-500">
            Please wait while we generate your script...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Ready state
  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 to-blue-100 p-6">

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📜 Get Your Bot Script
        </h1>
        <p className="text-gray-500 text-sm">
          Copy and paste this script into your website
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

        {message && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-green-100 text-green-700">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">

          <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
            <textarea
              className="w-full h-28 bg-gray-900 text-green-400 font-mono text-sm resize-none outline-none"
              value={script}
              readOnly
            />
          </div>

          <button
            onClick={handleCopy}
            className={`p-3 rounded-lg font-medium text-white ${
              copied
                ? "bg-green-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            }`}
          >
            {copied ? "✅ Copied!" : "Copy Script"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetScript;
