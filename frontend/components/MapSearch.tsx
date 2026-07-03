'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

type Pin = { id: string; lat: number; lng: number; price: string; title: string; thumbnailUrl?: string };

function BoundsLoader({ onPins }: { onPins: (pins: Pin[]) => void }) {
  const map = useMapEvents({
    async moveend() {
      const b = map.getBounds();
      const params = new URLSearchParams({
        swLat: String(b.getSouthWest().lat),
        swLng: String(b.getSouthWest().lng),
        neLat: String(b.getNorthEast().lat),
        neLng: String(b.getNorthEast().lng),
        zoom: String(map.getZoom())
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api'}/listings/map?${params}`);
      if (res.ok) onPins(await res.json());
    }
  });

  useEffect(() => {
    map.fire('moveend');
  }, [map]);

  return null;
}

export default function MapSearch() {
  const [pins, setPins] = useState<Pin[]>([]);
  const center = useMemo<[number, number]>(() => [35.7219, 51.3347], []);

  return (
    <div className="h-[70vh] overflow-hidden rounded-2xl border">
      <MapContainer center={center} zoom={12} className="h-full w-full" scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <BoundsLoader onPins={setPins} />
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} />
        ))}
      </MapContainer>
    </div>
  );
}
