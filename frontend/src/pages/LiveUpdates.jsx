import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

function LocationMarker({ setQuery }) {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setQuery(`Query for lat: ${lat.toFixed(2)}, lng: ${lng.toFixed(2)}`);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function LiveUpdates() {
  const { chatSessions, setChatSessions, currentChatId, setCurrentChatId, query, setQuery } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/events", { timeout: 10000 });
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        // Mock events if backend isn't ready
        setEvents([
          {
            id: "1",
            title: "Cyclone Alert",
            summary: "Cyclone in Bay of Bengal (mock data).",
            lat: 13.08,
            lng: 80.27,
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            title: "INSAT-3D Launch",
            summary: "Successful launch of INSAT-3D (mock data).",
            lat: 13.03,
            lng: 77.56,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!query.trim()) return;

    // Create a new chat session for location-based query
    const newChat = {
      id: Date.now().toString(),
      title: `Location Query ${chatSessions.length + 1}`,
      messages: [{ sender: "user", text: query, id: Date.now() }],
    };
    setChatSessions([...chatSessions, newChat]);
    setCurrentChatId(newChat.id);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/chat",
        { message: query },
        { timeout: 10000 }
      );
      const botMessage = { sender: "bot", text: response.data.response, id: Date.now() };
      updateChatMessages(botMessage, newChat.id);
    } catch (error) {
      // Mock response if backend isn't ready
      const botMessage = {
        sender: "bot",
        text: `Mock response: Weather data for ${query} is unavailable.`,
        id: Date.now(),
      };
      updateChatMessages(botMessage, newChat.id);
    } finally {
      setIsLoading(false);
    }
    setQuery("");
  };

  const updateChatMessages = (message, chatId) => {
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) handleSend();
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-gray-100 min-h-screen text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">Live Updates</h2>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-80 w-full rounded-lg shadow-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {events.map((event) => (
          <Marker key={event.id} position={[event.lat, event.lng]} />
        ))}
        <LocationMarker setQuery={setQuery} />
      </MapContainer>
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Click map to query coordinates (e.g., 'Weather at lat: 13.08, lng: 80.27')..."
          className="w-full p-2 border rounded disabled:bg-gray-200"
          disabled={isLoading}
          aria-label="Chat input for location queries"
        />
        <button
          onClick={handleSend}
          className="mt-2 bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <div className="mt-6 grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-blue-600">{event.title}</h3>
            <p className="text-gray-600">{event.summary}</p>
            <p className="text-sm text-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveUpdates;