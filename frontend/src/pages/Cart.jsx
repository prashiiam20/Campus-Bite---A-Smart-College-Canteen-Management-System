import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaClock, FaExclamationTriangle } from 'react-icons/fa';

function Cart() {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    // Simulate coupon validation
    if (couponCode.toUpperCase() === 'STUDENT10') {
      setCouponSuccess('Student discount applied! 10% off your order.');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try STUDENT10 for 10% off.');
      setCouponSuccess('');
    }
  };

  const getCutoffTime = () => {
    const cutoffTime = new Date();
    cutoffTime.setHours(18, 0, 0, 0); // 6:00 PM
    return cutoffTime;
  };

  const isOrderingAvailable = () => {
    const now = new Date();
    return now < getCutoffTime();
  };

  const handleCheckout = () => {
    if (!isOrderingAvailable()) {
      alert('Sorry, ordering is closed for today. Please order before 6:00 PM tomorrow.');
      return;
    }

    if (currentUser) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  const getPickupTime = () => {
    const now = new Date();
    const pickupTime = new Date(now.getTime() + 30 * 60000); // Add 30 minutes
    return pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your order...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <FaShoppingBag />
            </div>
            <h2>Your order is empty</h2>
            <p>Looks like you haven't added any items to your order yet.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate subtotal, tax, and total
  const subtotal = cart.totalPrice;
  
  // No delivery charges for canteen pickup
  const tax = subtotal * 0.05; // 5% tax
  
  // Apply coupon discount if valid
  const discount = couponSuccess ? subtotal * 0.1 : 0;
  
  const total = subtotal + tax - discount;

  return (

    <>

    <style>{`
    .summary-details {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
  color: #333;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row span {
  font-weight: 500;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  margin-top: 0.5rem;
}

.summary-row.discount {
  color: #27ae60;
  font-weight: 600;
}

.summary-row.discount span:last-child {
  color: #27ae60;
}

    `}</style>


    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Order</h1>
        
        {/* Ordering Status Banner */}
        <div className={`ordering-banner ${isOrderingAvailable() ? 'available' : 'closed'}`} style={{
          padding: '1rem',
          marginBottom: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: isOrderingAvailable() ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isOrderingAvailable() ? '#c3e6cb' : '#f5c6cb'}`,
          color: isOrderingAvailable() ? '#155724' : '#721c24'
        }}>
          <FaClock style={{marginRight: '8px'}} />
          {isOrderingAvailable() ? (
            <span>
              <strong>Order Now!</strong> Pickup ready at {getPickupTime()} | Order deadline: 6:00 PM
            </span>
          ) : (
            <span>
              <FaExclamationTriangle style={{marginRight: '8px'}} />
              <strong>Ordering Closed</strong> - Please order before 6:00 PM tomorrow
            </span>
          )}
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.productId} className="cart-item">
                    <td className="cart-product">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="cart-product-image"
                      />
                      <div className="cart-product-details">
                        <h3 className="cart-product-name">
                          <Link to={`/product/${item.productId}`}>
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                    </td>
                    <td className="cart-price">₹{item.price.toFixed(2)}</td>
                    <td className="cart-quantity">
                      <div className="quantity-control">
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="quantity-btn"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                          className="quantity-input"
                        />
                        <button 
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-subtotal">₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td className="cart-actions">
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="remove-btn"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="coupon-form">
              <form onSubmit={handleCouponSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code (try STUDENT10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="form-control"
                  />
                  <button type="submit" className="btn btn-secondary">
                    Apply
                  </button>
                </div>
              </form>
              
              {couponError && (
                <div className="alert alert-danger">{couponError}</div>
              )}
              
              {couponSuccess && (
                <div className="alert alert-success">{couponSuccess}</div>
              )}
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Student Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={!isOrderingAvailable()}
              className={`btn btn-lg btn-block checkout-btn ${!isOrderingAvailable() ? 'btn-disabled' : 'btn-primary'}`}
            >
              {isOrderingAvailable() ? 'Place Order' : 'Ordering Closed'}
            </button>
            
            <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6C757D'}}>
              <FaClock style={{marginRight: '4px'}} />
              Pickup from Canteen Counter in 30 minutes
            </div>
            
            <Link to="/products" className="continue-shopping">
              <FaArrowLeft /> Continue Browsing Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Cart;