(function () {
  // ==============================
  // CONFIG
  // ==============================

  const script = document.currentScript;
  const BOT_ID = script.dataset.botId;
  const API_URL = "https://saas-chatbot-builder-production.up.railway.app/bot/ask"; // change later

  if (!BOT_ID) {
    console.error("Chatbot widget: Missing data-bot-id");
    return;
  }

  // ==============================
  // SESSION HANDLING
  // ==============================

  let sessionID = localStorage.getItem("chatbot_session");

  if (!sessionID) {
    sessionID = crypto.randomUUID();
    localStorage.setItem("chatbot_session", sessionID);
  }

  // ==============================
  // STYLE INJECTION (NEXT LEVEL UI)
  // ==============================

  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    #chatbot-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      border-radius: 50%;
      width: 65px;
      height: 65px;
      border: none;
      cursor: pointer;
      font-size: 26px;
      box-shadow: 0 8px 25px rgba(79,70,229,0.4);
      transition: all 0.3s ease;
      z-index: 9999;
    }

    #chatbot-button:hover {
      transform: scale(1.08);
    }

    #chatbot-window {
      position: fixed;
      bottom: 95px;
      right: 20px;
      width: 360px;
      height: 500px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      z-index: 9999;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    #chatbot-header {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      padding: 15px;
      font-weight: 600;
      font-size: 15px;
      text-align: center;
      letter-spacing: 0.5px;
    }

    #chatbot-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      background: #f9fafb;
      font-size: 14px;
    }

    #chatbot-messages::-webkit-scrollbar {
      width: 5px;
    }

    #chatbot-messages::-webkit-scrollbar-thumb {
      background: #c7d2fe;
      border-radius: 10px;
    }

    .chatbot-msg-user,
    .chatbot-msg-bot {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 15px;
      margin: 8px 0;
      line-height: 1.4;
      word-wrap: break-word;
      font-size: 13px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chatbot-msg-user {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }

    .chatbot-msg-bot {
      background: white;
      color: #333;
      border: 1px solid #eee;
      margin-right: auto;
      border-bottom-left-radius: 4px;
    }

    #chatbot-input {
      display: flex;
      padding: 12px;
      background: white;
      border-top: 1px solid #eee;
    }

    #chatbot-input input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 25px;
      border: 1px solid #ddd;
      outline: none;
      font-size: 13px;
      transition: border 0.2s ease;
    }

    #chatbot-input input:focus {
      border-color: #6366f1;
    }

    #chatbot-input button {
      margin-left: 8px;
      padding: 10px 16px;
      border-radius: 25px;
      border: none;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: transform 0.2s ease;
    }

    #chatbot-input button:hover {
      transform: scale(1.05);
    }

    .typing {
      font-size: 12px;
      color: #666;
      margin: 6px 0;
    }
  `;
  document.head.appendChild(style);

  // ==============================
  // UI CREATION
  // ==============================

  const button = document.createElement("button");
  button.id = "chatbot-button";
  button.innerText = "💬";

  const windowEl = document.createElement("div");
  windowEl.id = "chatbot-window";

  windowEl.innerHTML = `
    <div id="chatbot-header">AI Assistant</div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input">
      <input type="text" placeholder="Type your message..." />
      <button>Send</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(windowEl);

  const messagesEl = windowEl.querySelector("#chatbot-messages");
  const inputEl = windowEl.querySelector("input");
  const sendBtn = windowEl.querySelector("button");

  // ==============================
  // UI EVENTS
  // ==============================

  button.onclick = () => {
    windowEl.style.display =
      windowEl.style.display === "flex" ? "none" : "flex";
  };

  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className =
      type === "user" ? "chatbot-msg-user" : "chatbot-msg-bot";
    msg.innerText = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const question = inputEl.value.trim();
    if (!question) return;

    addMessage(question, "user");
    inputEl.value = "";

    const typingEl = document.createElement("div");
    typingEl.className = "typing";
    typingEl.innerText = "AI is typing...";
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botID: BOT_ID,
          question,
          sessionID,
        }),
      });

      const data = await res.json();

      typingEl.remove();

      if (data.sessionID) {
        sessionID = data.sessionID;
        localStorage.setItem("chatbot_session", sessionID);
      }

      addMessage(data.answer || "No response", "bot");
    } catch (err) {
      typingEl.remove();
      addMessage("Error connecting to chatbot.", "bot");
    }
  }

  sendBtn.onclick = sendMessage;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

})();