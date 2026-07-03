'use client';

import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

type Position = { lat: number; lng: number };

function PickerEvents({ onPick }: { onPick: (position: Position) => void }) {
  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });
  return null;
}

export default function LocationPicker({ onChange }: { onChange?: (position: Position) => void }) {
  const [position, setPosition] = useState<Position>({ lat: 35.7219, lng: 51.3347 });

  function pick(next: Position) {
    setPosition(next);
    onChange?.(next);
  }

  return (
    <div>
      <div className="h-80 overflow-hidden rounded-2xl border">
        <MapContainer center={[position.lat, position.lng]} zoom={13} className="h-full w-full">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <PickerEvents onPick={pick} />
          <Marker position={[position.lat, position.lng]} draggable eventHandlers={{ dragend: (event) => {
            const marker = event.target;
            const latlng = marker.getLatLng();
            pick({ lat: latlng.lat, lng: latlng.lng });
          } }} />
        </MapContainer>
      </div>
      <p className="mt-2 text-sm text-gray-600">Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
    </div>
  );
}
