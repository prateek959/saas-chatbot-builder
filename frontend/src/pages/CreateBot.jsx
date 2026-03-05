import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateBot = () => {
   const API_LOC = "http://localhost:5004";
  const API_DEV = "https://saas-chatbot-builder-production.up.railway.app";
  const [chatbotName, setChatbotName] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingBot, setExistingBot] = useState(null);
  const [loadingBot, setLoadingBot] = useState(true);

  // ✅ lock file after upload
  const [fileLocked, setFileLocked] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBot = async () => {
      setLoadingBot(true);
      try {
        const res = await axios.get(`${API_DEV}/bot/script`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "ready" || res.data.status === "processing") {
          setExistingBot(true);
          setFileLocked(true); // bot exists → lock upload
        } else {
          setExistingBot(null);
        }
      } catch (err) {
        console.log(err.response);
      } finally {
        setLoadingBot(false);
      }
    };

    fetchBot();
  }, [token]);

  const handleFileChange = (e) => {
    if (fileLocked) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!chatbotName || !file) {
      setError("Please enter bot name and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("chatbotName", chatbotName);
    formData.append("document", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_DEV}/bot/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(res.data.message);
      setFileLocked(true); // ✅ lock after upload
      setExistingBot(true);
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loadingBot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg animate-pulse">
          Checking bot status...
        </p>
      </div>
    );
  }

  // Existing bot
  if (existingBot && fileLocked) {
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          🤖 Bot Already Exists
        </h1>
        <p className="text-yellow-600 text-lg">
          You already created a chatbot. Upload is locked.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🚀 Create Your AI Bot
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {status && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Bot Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Chatbot Name
          </label>
          <input
            type="text"
            placeholder="Enter bot name"
            value={chatbotName}
            onChange={(e) => setChatbotName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={loading || fileLocked}
          />
        </div>

        {/* Upload Box */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Upload Document
          </label>

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              fileLocked
                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                : "bg-gray-50 hover:bg-indigo-50 border-indigo-300 cursor-pointer"
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              disabled={loading || fileLocked}
              className="hidden"
              id="fileUpload"
            />

            <label htmlFor="fileUpload" className="cursor-pointer">
              {file ? (
                <p className="text-indigo-600 font-medium">
                  📄 {file.name}
                </p>
              ) : (
                <p className="text-gray-500">
                  Click to upload your document
                </p>
              )}

              {fileLocked && (
                <p className="text-sm text-red-500 mt-2">
                  🔒 Document locked after upload
                </p>
              )}
            </label>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading || fileLocked}
          className={`p-3 rounded-lg font-semibold text-white shadow-md transition ${
            loading || fileLocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading
            ? "Uploading..."
            : fileLocked
            ? "Upload Locked"
            : "Upload Bot"}
        </button>

      </form>
    </div>
  );
};

export default CreateBot;
