const queue = [
  { id: 'REQ-101', title: '85m apartment', owner: 'Pending owner review', priceRisk: 'normal', fraudRisk: 'low', status: 'pending_review' },
  { id: 'REQ-102', title: 'Large villa', owner: 'Mismatch needs check', priceRisk: 'suspicious_high', fraudRisk: 'medium', status: 'pending_review' }
];

export default function AdminPage() {
  return (
    <main className="container">
      <h1>Admin manual review</h1>
      <section className="grid" style={{marginBottom:16}}>
        <div className="card"><h2>12</h2><p className="muted">Pending listing reviews</p></div>
        <div className="card warning"><h2>4</h2><p className="muted">Suspicious price cases</p></div>
        <div className="card danger"><h2>2</h2><p className="muted">Possible broker patterns</p></div>
      </section>
      <table className="table">
        <thead><tr><th>Request</th><th>Listing</th><th>Owner Check</th><th>Price Risk</th><th>Fraud Risk</th><th>Action</th></tr></thead>
        <tbody>
          {queue.map(row => <tr key={row.id}><td>{row.id}</td><td>{row.title}</td><td>{row.owner}</td><td>{row.priceRisk}</td><td>{row.fraudRisk}</td><td><button className="button">Review</button></td></tr>)}
        </tbody>
      </table>
      <div className="card warning" style={{marginTop:16}}>
        <h2>AI suggestions - future module</h2>
        <p className="muted">AI may later extract fields and highlight mismatches, but final approval, rejection, and blocking must stay manual until explicitly changed.</p>
      </div>
    </main>
  );
}
