const listings = [
  { id: '1', title: 'Verified 85m apartment', city: 'Tehran', neighborhood: 'Saadat Abad', area: 85, rooms: 2, price: 'Price checked', badges: ['verified owner', 'manual review', 'direct owner'] },
  { id: '2', title: 'Clean rental unit', city: 'Tehran', neighborhood: 'Yousef Abad', area: 70, rooms: 1, price: 'Rent checked', badges: ['verified owner', 'price checked'] }
];

export default function ListingsPage() {
  return (
    <main className="container">
      <h1>Verified listings</h1>
      <div className="card" style={{marginBottom:16}}>
        <div className="grid">
          <input className="input" placeholder="City" />
          <input className="input" placeholder="Neighborhood" />
          <select className="select"><option>Sale or rent</option><option>Sale</option><option>Rent</option></select>
          <input className="input" placeholder="Max price" />
        </div>
      </div>
      <section className="grid">
        {listings.map(item => (
          <article className="card" key={item.id}>
            <h2>{item.title}</h2>
            <p className="muted">{item.city} · {item.neighborhood} · {item.area}m · {item.rooms} rooms</p>
            <p><b>{item.price}</b></p>
            {item.badges.map(b => <span className="badge" key={b}>{b}</span>)}
            <div style={{marginTop:16}}><button className="button secondary">View details</button></div>
          </article>
        ))}
      </section>
    </main>
  );
}
