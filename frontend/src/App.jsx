import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import UserSection from './components/UserSection';
import ProductSection from './components/ProductSection';
import BidSection from './components/BidSection';
import DashboardSection from './components/DashboardSection';
import { getUsers, getProducts } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, productsData] = await Promise.all([
        getUsers().catch(() => []),
        getProducts().catch(() => []),
      ]);
      setUsers(usersData);
      setProducts(productsData);
    } catch (err) {
      showNotification('Failed to connect to backend API: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const refreshUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      showNotification('Failed to refresh users: ' + err.message, 'error');
    }
  };

  const refreshProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      showNotification('Failed to refresh products: ' + err.message, 'error');
    }
  };

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Notification Banner */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          <span>
            {notification.type === 'success' && '✅ '}
            {notification.type === 'error' && '❌ '}
            {notification.type === 'info' && 'ℹ️ '}
            {notification.message}
          </span>
          <button className="toast-close" onClick={() => setNotification(null)}>
            &times;
          </button>
        </div>
      )}

      <main className="main-content">
        {loading && (
          <div className="loading-banner">
            <div className="spinner"></div>
            <span>Loading system data...</span>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && (
              <DashboardSection
                users={users}
                products={products}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'users' && (
              <UserSection
                users={users}
                onUserAdded={refreshUsers}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'products' && (
              <ProductSection
                products={products}
                onProductAdded={refreshProducts}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'bids' && (
              <BidSection
                products={products}
                users={users}
                showNotification={showNotification}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Mini Auction Management System &bull; Java Spring Boot + SQLite + React &bull; REST API Architecture</p>
      </footer>
    </div>
  );
}
