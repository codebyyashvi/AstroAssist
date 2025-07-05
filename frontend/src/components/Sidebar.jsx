import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ chatSessions, setChatSessions, currentChatId, setCurrentChatId }) {
  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
    };
    setChatSessions([...chatSessions, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="w-1/4 bg-blue-900 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">MOSDAC Portal</h2>
      <Link to="/" className="mb-2 p-2 bg-blue-700 rounded hover:bg-blue-600">Chat</Link>
      <Link to="/updates" className="mb-2 p-2 bg-blue-700 rounded hover:bg-blue-600">Live Updates</Link>
      <Link to="/pdf-viewing" className="mb-2 p-2 bg-blue-700 rounded hover:bg-blue-600">PDF Viewing</Link>
      <Link to="/pdf-bot" className="mb-2 p-2 bg-blue-700 rounded hover:bg-blue-600">PDF Bot</Link>
      <button
        onClick={handleNewChat}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Create New Chat
      </button>
      <h3 className="text-lg font-semibold">Chat History</h3>
      <div className="flex-1 overflow-y-auto">
        {chatSessions.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat.id)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              chat.id === currentChatId ? "bg-blue-600" : "bg-blue-700 hover:bg-blue-600"
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}


export default Sidebar;