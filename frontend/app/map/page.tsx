import dynamic from 'next/dynamic';

const MapSearch = dynamic(() => import('../../components/MapSearch'), { ssr: false });

export default function MapPage() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Map search</h1>
      <p className="mb-6 text-gray-600">Browse published listings by visible OpenStreetMap area. Moving or zooming the map reloads pins from the backend bounding-box endpoint.</p>
      <MapSearch />
    </main>
  );
}
