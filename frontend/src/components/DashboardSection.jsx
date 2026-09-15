export default function DashboardSection({ users, products, setActiveTab }) {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2>📊 System Overview</h2>
        <p className="section-description">Quick snapshot of registered users, auction items, and activity.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActiveTab('users')}>
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Registered Users</span>
          </div>
          <span className="stat-action">Manage Users &rarr;</span>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('products')}>
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <span className="stat-value">{products.length}</span>
            <span className="stat-label">Auction Products</span>
          </div>
          <span className="stat-action">Manage Products &rarr;</span>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('bids')}>
          <div className="stat-icon">🔨</div>
          <div className="stat-info">
            <span className="stat-value">Live</span>
            <span className="stat-label">Bidding System</span>
          </div>
          <span className="stat-action">Place & View Bids &rarr;</span>
        </div>
      </div>

      <div className="grid-two-columns mt-4">
        <div className="card">
          <div className="card-header flex-between">
            <h3>Recent Products</h3>
            <button className="btn-link" onClick={() => setActiveTab('products')}>View All</button>
          </div>
          {products.length === 0 ? (
            <p className="text-muted p-3">No products created yet.</p>
          ) : (
            <ul className="quick-list">
              {products.slice(-5).reverse().map((p) => (
                <li key={p.productId} className="quick-item">
                  <span className="font-semibold">{p.productName}</span>
                  <span className="price-tag">${Number(p.basePrice).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="card-header flex-between">
            <h3>Recent Users</h3>
            <button className="btn-link" onClick={() => setActiveTab('users')}>View All</button>
          </div>
          {users.length === 0 ? (
            <p className="text-muted p-3">No users registered yet.</p>
          ) : (
            <ul className="quick-list">
              {users.slice(-5).reverse().map((u) => (
                <li key={u.userId} className="quick-item">
                  <span className="font-semibold">{u.userName}</span>
                  <span className="text-muted">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
