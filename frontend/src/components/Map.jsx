import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";


function Map({ events }) {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-80 w-full rounded-lg shadow-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]} />
      ))}
    </MapContainer>
  );
}

export default Map;