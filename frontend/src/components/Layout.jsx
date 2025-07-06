import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          chatSessions={chatSessions}
          setChatSessions={setChatSessions}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
        />
        <div className="flex-1">
          <Outlet context={{ chatSessions, setChatSessions, currentChatId, setCurrentChatId, query, setQuery }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;