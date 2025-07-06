import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">MOSDAC Chatbot</h1>
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-blue-300">Chat</Link>
          <Link to="/updates" className="hover:text-blue-300">Live Updates</Link>
          <Link to="/pdf-viewing" className="hover:text-blue-300">PDF Viewing</Link>
          <Link to="/pdf-bot" className="hover:text-blue-300">PDF Bot</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
