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
          title: "INSAT-3D COTS Manual",
          url: "https://www.mosdac.gov.in/docs/INSAT3D_COTS.pdf",
          type: "PDF",
          topic: "Satellite Manuals",
          description: "INSAT-3D Commercial Off-The-Shelf (COTS) documentation.",
        },
        {
          id: "2",
          title: "INSAT-3D ATBD (May 2015)",
          url: "https://www.mosdac.gov.in/docs/INSAT_3D_ATBD_MAY_2015.pdf",
          type: "PDF",
          topic: "Algorithm Theoretical Basis Document",
          description: "ATBD for INSAT-3D data products as of May 2015.",
        },
        {
          id: "3",
          title: "ATBD for INSAT-3D Sea Surface Temperature (SST)",
          url: "https://www.mosdac.gov.in/docs/ATBD_INSAT-3D_SST_REV_V1.1.pdf",
          type: "PDF",
          topic: "Algorithm Theoretical Basis Document",
          description: "Detailed algorithm documentation for SST retrieval from INSAT-3D.",
        },
        {
          id: "4",
          title: "Incremental ATBD (Feb 2020)",
          url: "https://www.mosdac.gov.in/docs/Incremental-ATBD-12Feb2020.pdf",
          type: "PDF",
          topic: "Algorithm Updates",
          description: "Incremental updates to the ATBDs released in February 2020.",
        },
        {
          id: "5",
          title: "INSAT-3D Products Guide",
          url: "https://www.mosdac.gov.in/docs/INSAT3D_Products.pdf",
          type: "PDF",
          topic: "Product Documentation",
          description: "INSAT-3D derived product categories and metadata reference.",
        },
        {
          id: "6",
          title: "INSAT-3D Product Types & Processing Levels",
          url: "https://www.mosdac.gov.in/docs/V1_INSAT3D_ProductTypes%20and%20ProcessingLevel.pdf",
          type: "PDF",
          topic: "Product Documentation",
          description: "List and processing level information for INSAT-3D products.",
        },
        {
          id: "7",
          title: "INSAT Product Version Information",
          url: "https://www.mosdac.gov.in/docs/INSAT_Product_Version_information_V01.pdf",
          type: "PDF",
          topic: "Versioning",
          description: "Version control documentation for INSAT satellite products.",
        },
        {
          id: "8",
          title: "HEM Rain Algorithm (ATBD)",
          url: "https://www.mosdac.gov.in/docs/HEM_rain-revised-atbd.pdf",
          type: "PDF",
          topic: "Algorithm Theoretical Basis Document",
          description: "Revised ATBD for High-Efficiency Multispectral (HEM) rain estimation.",
        },
        {
          id: "9",
          title: "INSAT AOD Algorithm (Revised)",
          url: "https://www.mosdac.gov.in/docs/INSAT_AOD_ATBD_revised.doc.pdf",
          type: "PDF",
          topic: "Algorithm Theoretical Basis Document",
          description: "Revised ATBD for Aerosol Optical Depth (AOD) from INSAT.",
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