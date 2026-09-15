import { useState, useEffect } from 'react';
import { placeBid, getBidsByProduct, getHighestBid } from '../services/api';

export default function BidSection({ products, users, showNotification, preselectedProductId }) {
  const [selectedProductId, setSelectedProductId] = useState(preselectedProductId || '');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [productBids, setProductBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [loadingBids, setLoadingBids] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);

  // Sync when preselectedProductId changes
  useEffect(() => {
    if (preselectedProductId) {
      setSelectedProductId(preselectedProductId);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].productId);
    }
  }, [preselectedProductId, products]);

  // Fetch bids and highest bid when selectedProductId changes
  useEffect(() => {
    if (selectedProductId) {
      loadProductBids(selectedProductId);
    } else {
      setProductBids([]);
      setHighestBid(null);
    }
  }, [selectedProductId]);

  const loadProductBids = async (productId) => {
    setLoadingBids(true);
    try {
      const bids = await getBidsByProduct(productId);
      setProductBids(bids);

      try {
        const highest = await getHighestBid(productId);
        setHighestBid(highest);
      } catch {
        setHighestBid(null);
      }
    } catch (err) {
      showNotification(err.message, 'error');
      setProductBids([]);
      setHighestBid(null);
    } finally {
      setLoadingBids(false);
    }
  };

  const selectedProduct = products.find((p) => String(p.productId) === String(selectedProductId));

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      showNotification('Please select a product to bid on', 'error');
      return;
    }

    if (!selectedUserId) {
      showNotification('Please select a user placing the bid', 'error');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Bid amount must be a positive number', 'error');
      return;
    }

    if (selectedProduct && amount < selectedProduct.basePrice) {
      showNotification(`Bid amount cannot be less than the product base price ($${selectedProduct.basePrice.toFixed(2)})`, 'error');
      return;
    }

    setSubmittingBid(true);
    try {
      await placeBid({
        userId: Number(selectedUserId),
        productId: Number(selectedProductId),
        bidAmount: amount,
      });

      showNotification(`Bid of $${amount.toFixed(2)} placed successfully!`, 'success');
      setBidAmount('');
      // Reload bids and highest bid
      await loadProductBids(selectedProductId);
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setSubmittingBid(false);
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>🔨 Bids & Auction Management</h2>
        <p className="section-description">
          Select a product to view active bids, see the highest bid, and place new bids.
        </p>
      </div>

      {/* Product Selector Bar */}
      <div className="card product-selector-card">
        <div className="form-group mb-0">
          <label htmlFor="productSelect" className="font-semibold">
            🎯 Choose Product for Auction:
          </label>
          <select
            id="productSelect"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="select-input"
          >
            <option value="">-- Select an auction item --</option>
            {products.map((p) => (
              <option key={p.productId} value={p.productId}>
                #{p.productId} - {p.productName} (Base: ${Number(p.basePrice).toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProduct && (
        <div className="auction-overview-grid">
          {/* Product Info & Highest Bid Banner */}
          <div className="card highlight-card">
            <div className="card-header flex-between">
              <div>
                <span className="badge badge-primary">Active Item</span>
                <h3 className="mt-1">{selectedProduct.productName}</h3>
              </div>
              <div className="text-right">
                <span className="text-muted text-small">Base Starting Price</span>
                <div className="base-price-display">${Number(selectedProduct.basePrice).toFixed(2)}</div>
              </div>
            </div>

            <div className="highest-bid-box">
              <span className="highest-bid-label">🏆 Current Highest Bid</span>
              {highestBid ? (
                <div className="highest-bid-content">
                  <span className="highest-bid-amount">${Number(highestBid.bidAmount).toFixed(2)}</span>
                  <span className="highest-bid-user">
                    Placed by <strong>{highestBid.user?.userName}</strong> ({highestBid.user?.email})
                  </span>
                </div>
              ) : (
                <div className="no-bids-message">
                  <span>No bids placed yet. Minimum starting bid is ${Number(selectedProduct.basePrice).toFixed(2)}.</span>
                </div>
              )}
            </div>
          </div>

          {/* Place Bid Form */}
          <div className="card">
            <div className="card-header">
              <h3>Place a New Bid</h3>
            </div>
            <form onSubmit={handlePlaceBid} className="form">
              <div className="form-group">
                <label htmlFor="bidUser">Select Bidder (User) *</label>
                <select
                  id="bidUser"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="select-input"
                  required
                >
                  <option value="">-- Choose User --</option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      #{u.userId} - {u.userName} ({u.email})
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <small className="field-warning">⚠️ Please add a user first in the Users section.</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="bidAmount">Bid Amount ($) *</label>
                <input
                  id="bidAmount"
                  type="number"
                  step="0.01"
                  min={selectedProduct.basePrice}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: $${Number(selectedProduct.basePrice).toFixed(2)}`}
                  required
                />
                <small className="field-hint">
                  Must be at least the base price of ${Number(selectedProduct.basePrice).toFixed(2)}
                  {highestBid && ` (current highest: $${Number(highestBid.bidAmount).toFixed(2)})`}
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-success"
                disabled={submittingBid || users.length === 0}
              >
                {submittingBid ? 'Submitting Bid...' : '🚀 Place Bid'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bids Table for Selected Product */}
      {selectedProductId && (
        <div className="card mt-4">
          <div className="card-header flex-between">
            <h3>Bidding History for Selected Product</h3>
            <span className="badge badge-info">
              {productBids.length} {productBids.length === 1 ? 'bid' : 'bids'} placed
            </span>
          </div>

          {loadingBids ? (
            <div className="loading-state">Loading bids...</div>
          ) : productBids.length === 0 ? (
            <div className="empty-state">
              <p>No bids have been recorded for this item yet.</p>
              <span className="hint">Be the first to place a bid using the form above!</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bid ID</th>
                    <th>Bidder Name</th>
                    <th>Bidder Email</th>
                    <th>Bid Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {productBids.map((bid, index) => {
                    const isHighest = index === 0;
                    return (
                      <tr key={bid.bidId} className={isHighest ? 'highest-row' : ''}>
                        <td><span className="id-badge">#{bid.bidId}</span></td>
                        <td className="font-semibold">{bid.user?.userName || 'User #' + bid.user?.userId}</td>
                        <td className="text-muted">{bid.user?.email || 'N/A'}</td>
                        <td>
                          <span className="price-tag">${Number(bid.bidAmount).toFixed(2)}</span>
                        </td>
                        <td>
                          {isHighest ? (
                            <span className="badge badge-success">🏆 Highest Bid</span>
                          ) : (
                            <span className="badge badge-secondary">Outbid</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedProduct && products.length === 0 && (
        <div className="card empty-state-card">
          <p>No auction products available yet.</p>
          <span className="hint">Go to the Products section to add items before bidding.</span>
        </div>
      )}
    </div>
  );
}
