'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

type PropertyMapProps = {
  lat?: number;
  lng?: number;
  zoom?: number;
  editable?: boolean;
  onChange?: (position: { lat: number; lng: number }) => void;
};

function LocationPicker({ onChange }: { onChange?: (position: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(event) {
      onChange?.({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });
  return null;
}

export default function PropertyMap({ lat = 35.7219, lng = 51.3347, zoom = 13, editable = false, onChange }: PropertyMapProps) {
  return (
    <div style={{ height: 320, borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
        {editable && <LocationPicker onChange={onChange} />}
      </MapContainer>
    </div>
  );
}
