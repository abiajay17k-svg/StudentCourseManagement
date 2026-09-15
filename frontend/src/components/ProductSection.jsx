import { useState } from 'react';
import { createProduct } from '../services/api';

export default function ProductSection({ products, onProductAdded, showNotification }) {
  const [productName, setProductName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      showNotification('Product name cannot be empty', 'error');
      return;
    }

    const price = parseFloat(basePrice);
    if (isNaN(price) || price <= 0) {
      showNotification('Base price must be a positive number greater than 0', 'error');
      return;
    }

    setLoading(true);
    try {
      const newProduct = await createProduct({
        productName: productName.trim(),
        basePrice: price,
      });
      showNotification(`Product "${newProduct.productName}" added successfully! (ID: ${newProduct.productId})`, 'success');
      setProductName('');
      setBasePrice('');
      if (onProductAdded) onProductAdded();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>🏷️ Product Management</h2>
        <p className="section-description">Add items up for auction and view catalog inventory.</p>
      </div>

      <div className="grid-two-columns">
        {/* Add Product Form Card */}
        <div className="card">
          <div className="card-header">
            <h3>Add Product for Auction</h3>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="productName">Product Name *</label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Vintage Mechanical Watch"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="basePrice">Base Price ($) *</label>
              <input
                id="basePrice"
                type="number"
                step="0.01"
                min="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="e.g. 150.00"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : '+ Add Product'}
            </button>
          </form>
        </div>

        {/* Products List Card */}
        <div className="card">
          <div className="card-header flex-between">
            <h3>Auction Catalog</h3>
            <span className="badge badge-info">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products available for auction yet.</p>
              <span className="hint">Use the form to list your first item.</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Base Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId}>
                      <td><span className="id-badge">#{product.productId}</span></td>
                      <td className="font-semibold">{product.productName}</td>
                      <td>
                        <span className="price-tag">${Number(product.basePrice).toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
