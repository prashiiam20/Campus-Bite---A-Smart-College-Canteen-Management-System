import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { mockOrders } from '../services/mockData';
import { FaBox, FaTruck, FaCheckCircle, FaFileAlt, FaSearch } from 'react-icons/fa';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Fallback to mock data if API fails
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setError('Could not fetch orders from server. Showing sample orders instead.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search term
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.order_id.toString().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return <FaBox className="status-icon placed" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      default:
        return <FaFileAlt className="status-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <>

    <style>{`

    .orders-toolbar {
  margin: 1rem 0;
}

.search-box {
  position: relative;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #777;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.5rem; /* left padding to make room for icon */
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s ease;
}

.search-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

    .orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

/* Order Card */
.order-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.1);
}

/* Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #444;
}

.order-number {
  font-weight: 600;
}

.order-date {
  color: #777;
  font-size: 0.85rem;
}

/* Status */
.order-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-text {
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.status-text.placed {
  color: #1976d2;
}

.status-text.processing {
  color: #ff9800;
}

.status-text.completed {
  color: #43a047;
}

/* Order Summary */
.order-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  flex: 1;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #eaeaea;
  padding: 0.5rem;
  border-radius: 5px;
  background: #fafafa;
  max-width: 240px;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #ccc;
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.item-meta {
  font-size: 0.8rem;
  color: #666;
}

.more-items {
  font-size: 0.85rem;
  color: #555;
  align-self: center;
  padding: 0.5rem;
}

/* Total */
.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
}

.total-label {
  font-size: 0.9rem;
  color: #777;
}

.total-amount {
  font-size: 1.15rem;
  font-weight: 600;
  color: #222;
}

/* Footer */
.order-footer {
  text-align: right;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-outline {
  border: 1px solid #1976d2;
  color: #1976d2;
  background: #fff;
}

.btn-outline:hover {
  background: #1976d2;
  color: #fff;
}

/* Responsiveness */
@media (max-width: 768px) {
  .order-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-total {
    align-items: flex-start;
  }
}

    `}</style>

    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        
        {error && (
          <div className="alert alert-info">{error}</div>
        )}
        
        <div className="orders-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <h3>No Orders Found</h3>
            {searchTerm ? (
              <p>No orders match your search criteria. Try a different search term.</p>
            ) : (
              <div>
                <p>You haven't placed any orders yet.</p>
                <Link to="/" className="btn btn-primary">
                  Go To Menu
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    Order #{order.order_id}
                  </div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span className={`status-text ${order.status.toLowerCase()}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="order-summary">
                  <div className="order-items">
                    {order.OrderItems && order.OrderItems.map((item, index) => (
                      <div key={item.item_id} className="order-item">
                        <img
                          src={item.Product?.image_url}
                          alt={item.Product?.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <div className="item-name">
                            {item.Product?.name}
                          </div>
                          <div className="item-meta">
                            Qty: {item.quantity} x ₹{parseFloat(item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {order.OrderItems?.length > 2 && (
                      <div className="more-items">
                        +{order.OrderItems.length - 2} more items
                      </div>
                    )}
                  </div>
                  
                  <div className="order-total">
                    <div className="total-label">Total:</div>
                    <div className="total-amount">₹{parseFloat(order.total_amount).toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="order-footer">
                  <Link to={`/orders/${order.order_id}`} className="btn btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default Orders;