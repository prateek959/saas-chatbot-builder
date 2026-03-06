import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateBot = () => {

  const API_LOC = "http://localhost:5004";
  const API_DEV = "https://saas-chatbot-builder-production.up.railway.app";

  const API = API_DEV;

  const token = localStorage.getItem("token");

  const [chatbotName, setChatbotName] = useState("");
  const [file, setFile] = useState(null);

  const [existingBot, setExistingBot] = useState(false);
  const [loadingBot, setLoadingBot] = useState(true);

  const [addFile, setAddFile] = useState(null);
  const [addingDoc, setAddingDoc] = useState(false);

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const res = await axios.get(`${API}/bot/script`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          res.data.status === "ready" ||
          res.data.status === "processing"
        ) {
          setExistingBot(true);
        }
      } catch (err) {
        console.log(err.response);
      } finally {
        setLoadingBot(false);
      }
    };

    fetchBot();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddFileChange = (e) => {
    setAddFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setStatus("");

    if (!chatbotName || !file) {
      setError("Please enter bot name and upload a document.");
      return;
    }

    const formData = new FormData();
    formData.append("chatbotName", chatbotName);
    formData.append("document", file);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/bot/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus(res.data.message);
      setExistingBot(true);

    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async () => {
    setError("");
    setStatus("");

    if (!addFile) {
      setError("Please select a document.");
      return;
    }

    const formData = new FormData();
    formData.append("document", addFile);

    try {
      setAddingDoc(true);

      const res = await axios.post(`${API}/bot/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus(res.data.message);
      setAddFile(null);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add document.");
    } finally {
      setAddingDoc(false);
    }
  };

  const handleDeleteBot = async () => {

    const confirmDelete = window.confirm(
      "Delete chatbot permanently?"
    );

    if (!confirmDelete) return;

    try {

      const res = await axios.delete(`${API}/bot/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus(res.data.message);
      setExistingBot(false);
      setChatbotName("");
      setFile(null);
      setAddFile(null);

    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loadingBot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading bot...
        </p>
      </div>
    );
  }

  // EXISTING BOT UI
  if (existingBot) {
    return (

      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white shadow-lg rounded-xl p-6 border">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🤖 Your AI Chatbot
          </h2>

          <p className="text-gray-500">
            Add more documents to improve chatbot knowledge.
          </p>

        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {status && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg">
            {status}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl p-8 border text-center">

          <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8">

            <p className="text-gray-600 mb-3">
              Upload a document to train your chatbot
            </p>

            <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">

              Select Document

              <input
                type="file"
                onChange={handleAddFileChange}
                className="hidden"
              />

            </label>

            {addFile && (
              <p className="mt-3 text-gray-500 text-sm">
                {addFile.name}
              </p>
            )}

          </div>

          <button
            onClick={handleAddDocument}
            disabled={addingDoc}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {addingDoc ? "Uploading..." : "Add Document"}
          </button>

        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Danger Zone
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Deleting your chatbot will remove all documents and data permanently.
          </p>

          <button
            onClick={handleDeleteBot}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Chatbot
          </button>

        </div>

      </div>
    );
  }

  // CREATE BOT UI
  return (

    <div className="max-w-3xl mx-auto">

      <div className="bg-white shadow-xl rounded-xl p-8 border">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Create AI Chatbot
        </h1>

        <p className="text-gray-500 mb-6">
          Upload documents and create your own AI assistant.
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>

            <label className="block text-sm font-medium mb-2">
              Chatbot Name
            </label>

            <input
              type="text"
              placeholder="Customer Support Bot"
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />

          </div>

          <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center">

            <p className="text-gray-600 mb-3">
              Upload training document
            </p>

            <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">

              Select File

              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

            {file && (
              <p className="mt-3 text-gray-500 text-sm">
                {file.name}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Creating Bot..." : "Create Chatbot"}
          </button>

        </form>

      </div>

    </div>

  );
};

export default CreateBot;