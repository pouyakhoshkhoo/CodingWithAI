'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 320, borderRadius: 18, border: '1px solid var(--border)', display: 'grid', placeItems: 'center' }}>
      Loading map...
    </div>
  )
});

type ClientPropertyMapProps = {
  lat?: number;
  lng?: number;
  zoom?: number;
  editable?: boolean;
};

export default function ClientPropertyMap(props: ClientPropertyMapProps) {
  return <PropertyMap {...props} />;
}
