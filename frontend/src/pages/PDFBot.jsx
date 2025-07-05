import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation, Link } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

function PDFBot() {
  const { chatSessions, setChatSessions, currentChatId, setCurrentChatId, query, setQuery } = useOutletContext();
  const [pdfText, setPdfText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useLocation();
  const resource = state?.resource;

  // Mock PDF data for testing without backend
  const mockPdfText = "This is a sample MOSDAC PDF content about INSAT-3D satellite data...";

  useEffect(() => {
    if (resource) {
      const newChat = {
        id: Date.now().toString(),
        title: `PDF Chat: ${resource.title}`,
        messages: [],
      };
      setChatSessions([...chatSessions, newChat]);
      setCurrentChatId(newChat.id);

      // Load PDF or use mock data
      const loadPDF = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const pdf = await pdfjsLib.getDocument(resource.url).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map((item) => item.str).join(" ");
          }
          setPdfText(fullText);
          setQuery(`Summarize: ${fullText.slice(0, 500)}...`);
        } catch (err) {
          console.error("PDF loading failed:", err);
          setPdfText(mockPdfText); // Fallback to mock data
          setQuery(`Summarize: ${mockPdfText.slice(0, 500)}...`);
          setError("Failed to load PDF. Using sample data.");
        } finally {
          setIsLoading(false);
        }
      };
      loadPDF();
    } else {
      setError("No PDF selected. Please choose a PDF from the PDF Viewing page.");
    }
  }, [resource, setQuery, setChatSessions, setCurrentChatId]);

  const handleSend = async () => {
    if (!query.trim() || !currentChatId) return;

    const userMessage = { sender: "user", text: query, id: Date.now() };
    updateChatMessages(userMessage);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/query",
        { text: query, user_id: "mosdac_user" },
        { timeout: 10000 }
      );
      const botMessage = { sender: "bot", text: response.data.response, id: Date.now() };
      updateChatMessages(botMessage);
    } catch (error) {
      // Mock response if backend isn't ready
      const botMessage = {
        sender: "bot",
        text: query.includes("summarize")
          ? "Summary: This PDF contains INSAT-3D satellite data (mock response)."
          : "Mock response: Please provide more details about your query.",
        id: Date.now(),
      };
      updateChatMessages(botMessage);
      setError(`Backend not ready: ${error.message}. Using mock response.`);
    } finally {
      setIsLoading(false);
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

  const handleProcess = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:8000/analyze_pdf",
        { url: resource?.url, user_id: "mosdac_user" },
        { timeout: 10000 }
      );
      alert("PDF processed with Qdrant (mock success)!");
    } catch (error) {
      alert("Mock: PDF indexed in Qdrant. Backend not ready.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-gray-100 min-h-screen text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">PDF Bot</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {resource ? (
        <div className="flex gap-4">
          <div className="w-1/2 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">{resource.title}</h3>
            {isLoading ? (
              <div className="text-gray-500 text-center flex items-center justify-center h-96">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading PDF...
              </div>
            ) : (
              <iframe src={resource.url} className="w-full h-96" title={resource.title} />
            )}
            <Link to="/pdf-viewing" className="mt-4 inline-block p-2 bg-blue-600 text-white rounded">
              Back to PDFs
            </Link>
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
              {chatSessions
                .find((chat) => chat.id === currentChatId)
                ?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 p-2 rounded-lg max-w-md ${
                      msg.sender === "user" ? "bg-blue-200 ml-auto" : "bg-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              {isLoading && (
                <div className="text-gray-500 text-center flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-blue-600"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Loading...
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t">
              <button
                onClick={handleProcess}
                className="mb-2 p-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                disabled={isLoading || !resource}
              >
                Process with Qdrant
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this PDF..."
                className="w-full p-2 border rounded disabled:bg-gray-200"
                disabled={isLoading}
                aria-label="Chat input for PDF queries"
              />
              <button
                onClick={handleSend}
                className="mt-2 bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center">
          Select a PDF from the PDF Viewing page to start.
          <Link to="/pdf-viewing" className="ml-2 text-blue-500">Go to PDF Viewing</Link>
        </div>
      )}
    </div>
  );
}

export default PDFBot;