"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Rešavanje problema sa ikonicom u Next.js-u
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center: [number, number] = [44.7866, 20.4489]; // Koordinate Beograda

export default function ServiceLocation() {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 mt-6 h-[300px] w-full">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup>
            Naša lokacija <br /> Beograd, Srbija
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}