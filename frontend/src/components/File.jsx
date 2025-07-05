import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Map from "./components/Map";
import ChatHistory from "./components/ChatHistory";

function Chat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState(null);
  const [geoMap, setGeoMap] = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatSessions, setChatSessions] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)

  const [allMessages, setAllMessages] = useState({});

  useEffect(() => {
    console.log("Current chat ID:", currentChatId);
    console.log("Messages:", messages);
  }, [currentChatId, messages]);


  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`
    }

    setChatSessions([newChat, ...chatSessions])
    setCurrentChatId(newChat.id)

    setAllMessages((prev) => ({ ...prev, [newChat.id]: [] }));
  }

  const handleSelectChat = (id) => {
    setCurrentChatId(id)
    setMessages(allMessages[id] || []);
  }

  const handleLocationSelect = (latlng) => {
    setLocation(latlng);
    setQuery(`What data is available for location ${latlng.lat}, ${latlng.lng}?`);
  };

  const handleSend = () => {
    if (!query.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: query
    };

    const updatedMessages = [...(allMessages[currentChatId] || []), newMessage];

    setAllMessages((prev) => ({
      ...prev,
      [currentChatId]: updatedMessages
    }));

    setMessages(updatedMessages); // show in UI
    setQuery("");
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "This is a simulated response."
      };

      const newMessages = [...updatedMessages, botMessage];

      setAllMessages((prev) => ({
        ...prev,
        [currentChatId]: newMessages
      }));

      setMessages(newMessages);
      setIsLoading(false);
    }, 1000);
  };



  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChatHistory
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex items-center">
          <button
            className="mr-4 text-white text-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <img width="30" height="30" src="https://img.icons8.com/fluency/48/menu--v1.png" alt="menu--v1"/>
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-xl">🛰️</span> MOSDAC Chatbot
          </h1>
        </header>

        {/* Main Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Geo Map */}
          {geoMap && (
            <div className="w-1/3 p-4 border-r bg-white overflow-auto">
              <Map onLocationSelect={handleLocationSelect} />
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-gray-400 italic text-center mt-20">
                🛰️ Welcome to MOSDAC Chatbot<br />
                Ask a question to get started.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 p-3 rounded-lg shadow max-w-md ${
                    msg.sender === "user"
                      ? "bg-blue-100 ml-auto text-right"
                      : "bg-white text-left"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.sender === "bot" && (
                    <button
                      className="text-xs text-blue-500 mt-1"
                      onClick={() => handleFlag(msg.id, msg.text)}
                    >
                      Flag
                    </button>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="text-gray-500 mt-2">Loading...</div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about MOSDAC data..."
            className="flex-1 p-2 border rounded shadow-sm w-full"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Send
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded shadow"
            onClick={() => setGeoMap(!geoMap)}
          >
            🗺️ Geo Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;