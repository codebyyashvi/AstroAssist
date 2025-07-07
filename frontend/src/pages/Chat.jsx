import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

function Chat() {
  const { chatSessions, setChatSessions, currentChatId, setCurrentChatId, query, setQuery } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);

  // Auto-create or select a chat on mount
  useEffect(() => {
    if (!currentChatId && chatSessions.length > 0) {
      setCurrentChatId(chatSessions[chatSessions.length - 1].id); // Select latest chat
    } else if (!currentChatId && chatSessions.length === 0) {
      const newChat = {
        id: Date.now().toString(),
        title: `Chat ${chatSessions.length + 1}`,
        messages: [],
      };
      setChatSessions([...chatSessions, newChat]);
      setCurrentChatId(newChat.id);
    }
  }, [currentChatId, chatSessions, setChatSessions, setCurrentChatId]);

  const handleSend = async () => {
    if (!query.trim() || !currentChatId) return;

    const userMessage = { sender: "user", text: query, id: Date.now() };
    updateChatMessages(userMessage);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/chat",
        { message: query },
        { timeout: 10000 } // 10-second timeout
      );
      const botMessage = { sender: "bot", text: response.data.response, id: Date.now() };
      updateChatMessages(botMessage);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: `Error: ${error.message || "Failed to fetch response. Please try again."}`,
        id: Date.now(),
      };
      updateChatMessages(errorMessage);
    } finally {
      setIsLoading(false); // Always reset isLoading
    }
    setQuery("");
  };

  const updateChatMessages = (message) => {
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) handleSend();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-blue-900 to-gray-100">
      {/* Prompt at top of chat */}
      <div className="flex-1 overflow-y-auto p-4">
      {currentChatId ? (() => {
        const messages = chatSessions.find((chat) => chat.id === currentChatId)?.messages || [];
        if (messages.length === 0) {
          return (
            <div className="h-full flex items-center justify-center text-white text-xl font-semibold text-center">
              Ask about MOSDAC satellite data, missions, or documentation.
            </div>
          );
        }

        return messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-lg max-w-md ${
              msg.sender === "user" ? "bg-blue-200 ml-auto" : "bg-white"
            }`}
          >
            {msg.text}
          </div>
        ));
      })() : (
        <div className="text-gray-200 text-center">Creating a new chat...</div>
      )}

      {isLoading && (
        <div className="text-gray-200 text-center flex items-center justify-center mt-4">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-blue-300"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading...
        </div>
      )}
    </div>


    {/* Input Section - Fixed at Bottom */}
    <div className="bg-white border-t p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded disabled:bg-gray-200"
          disabled={isLoading}
          aria-label="Chat input for MOSDAC queries"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  </div>

  );
}

export default Chat;