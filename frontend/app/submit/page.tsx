import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('../../components/PropertyMap'), { ssr: false });

export default function SubmitPage() {
  return (
    <main className="container">
      <h1>Submit property for review</h1>
      <p className="muted">Listings are published only after manual admin review.</p>
      <div className="grid">
        <section className="card">
          <h2>Listing form</h2>
          <label>Listing type<select className="select"><option>Sale</option><option>Rent</option></select></label>
          <label>Title<input className="input" placeholder="Example: 85m apartment" /></label>
          <label>City<input className="input" placeholder="Tehran" /></label>
          <label>Neighborhood<input className="input" placeholder="Neighborhood" /></label>
          <label>Area<input className="input" type="number" placeholder="85" /></label>
          <label>Price or rent<input className="input" type="number" placeholder="Realistic price" /></label>
          <label>Description<textarea rows={5} placeholder="Sale or rent conditions" /></label>
          <div className="card">
            <h3>Property location</h3>
            <p className="muted">Use OpenStreetMap to choose the property location. Public pages can show approximate location to protect privacy.</p>
            <PropertyMap editable />
          </div>
          <button className="button">Submit for review</button>
        </section>
        <aside className="card warning">
          <h2>Trust workflow</h2>
          <p>1. Owner enters property information.</p>
          <p>2. Owner adds OpenStreetMap location and price.</p>
          <p>3. Admin reviews all sensitive evidence manually.</p>
          <p>4. Admin publishes, rejects, or asks for more information.</p>
          <p className="muted">AI is future-only in the MVP and cannot approve or reject automatically.</p>
        </aside>
      </div>
    </main>
  );
}
