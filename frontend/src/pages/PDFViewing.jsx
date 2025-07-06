import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";

function PDFViewing() {
  const { setQuery } = useOutletContext();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/resources?search=${search}&topic=${selectedTopic}`);
        setResources(res.data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        // Mock data if backend isn't ready
        setResources([
          {
            id: "1",
            title: "INSAT-3D Data",
            url: "https://mosdac.gov.in/insat3d.pdf",
            type: "PDF",
            topic: "Satellite Manuals",
            description: "Technical data for INSAT-3D (mock data).",
          },
          {
            id: "2",
            title: "Weather Dataset",
            url: "https://mosdac.gov.in/weather.xlsx",
            type: "Excel",
            topic: "Weather Data",
            description: "Weather data for India (mock data).",
          },
        ]);
      }
    };
    fetchResources();
  }, [search, selectedTopic]);

  const topics = ["All", "Weather Data", "Satellite Manuals", "Mission Reports"];

  const handleAICChat = (resource) => {
    setQuery(`Analyze: ${resource.title}`);
    navigate(`/pdf-bot/${resource.id}`, { state: { resource } });
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-gray-100 min-h-screen text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">PDF Viewing</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search PDFs..."
        className="w-full p-2 border rounded mb-4"
        aria-label="Search PDFs"
      />
      <div className="flex gap-2 mb-4">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`p-2 rounded ${
              topic === selectedTopic ? "bg-blue-600 text-white" : "bg-blue-100"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-blue-600">{resource.title}</h3>
            <p className="text-gray-600">{resource.description}</p>
            <div className="mt-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 mr-4"
              >
                Read
              </a>
              <button
                onClick={() => handleAICChat(resource)}
                className="text-blue-500"
              >
                AI Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PDFViewing;