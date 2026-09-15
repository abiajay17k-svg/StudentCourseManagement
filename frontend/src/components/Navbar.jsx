export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users', label: '👤 Users' },
    { id: 'products', label: '🏷️ Products' },
    { id: 'bids', label: '🔨 Bids & Auctions' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🏛️</span>
          <div>
            <h1 className="brand-title">Mini Auction System</h1>
            <p className="brand-subtitle">Simple Full-Stack Auction Platform</p>
          </div>
        </div>

        <nav className="navbar-tabs">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
