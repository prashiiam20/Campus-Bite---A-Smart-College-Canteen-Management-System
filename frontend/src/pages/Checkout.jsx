import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { FaLock, FaCreditCard, FaMoneyBill, FaPaypal, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

function Checkout() {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    paymentMethod: 'cash-on-pickup',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    specialInstructions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (cart.items.length === 0 && !orderSuccess) {
      navigate('/cart');
    }

    // Check if ordering is still available
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(18, 0, 0, 0); // 11:30 AM
    
    if (now > cutoffTime) {
      alert('Sorry, ordering is closed for today. Please order before 19:00 PM tomorrow.');
      navigate('/cart');
      return;
    }
    
    // Fetch user info to pre-fill form if logged in
    const fetchUserInfo = async () => {
      try {
        // In a real app, you'd fetch user details here
        // For now, we'll just set some default values
        setFormData(prevData => ({
          ...prevData,
          fullName: 'John Doe',
          email: 'john@college.edu',
          phone: '123-456-7890'
        }));
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    
    if (currentUser) {
      fetchUserInfo();
    }
  }, [cart.items.length, navigate, currentUser, orderSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Check ordering time again
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(18, 0, 0, 0); // 11:30 AM
    
    if (now > cutoffTime) {
      setError('Sorry, ordering is closed for today. Please order before 6:00 PM tomorrow.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      const cartResponse = await api.get("/cart");
      const cart_id = cartResponse.data.cart_id;

      if (!cart_id) {
      setError("No cart found for this user.");
      return;
      }
      
      // Format pickup location (always canteen counter)
      const pickupLocation = "Canteen Counter - College Campus";
      
      // Place order using API
      const response = await api.post('/cart/checkout', {
        cart_id, // This would typically come from the cart context
        payment_method: formData.paymentMethod,
        shipping_address: pickupLocation,
      });
      
      if (response.data && response.data.order_id) {
         const payment = await api.post('/payments', {
          order_id: response.data.order_id,
          amount: response.data.total_amount,
          currency: 'USD',
          payment_method: formData.paymentMethod,
        });

        setOrderSuccess(true);
        setOrderId(response.data.order_id);
        clearCart();

        navigate(`/payment/${response.data.order_id}`, {
          state: {
            amount: response.data.total_amount,
            paymentMethod: formData.paymentMethod,
          }
        });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('There was a problem processing your order. Please try again.');
      
      // For demo purposes, simulate successful order if API fails
      setOrderSuccess(true);
      setOrderId(Math.floor(Math.random() * 1000000));
      clearCart();

    } finally {
      setLoading(false);
    }
  };

  // Calculate order summary
  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  // Get pickup time (30 minutes from now)
  const getPickupTime = () => {
    const now = new Date();
    const pickupTime = new Date(now.getTime() + 30 * 60000); // Add 30 minutes
    return pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  

  return (
    <>

    <style>{`
    .cart-items-summary {
  background-color: #fafafa;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-image {
  position: relative;
  width: 60px;
  height: 60px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.item-quantity {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background-color: #007bff;
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  border: 2px solid #fff;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 1rem;
  margin: 0 0 0.25rem;
  color: #333;
}

.item-price {
  font-size: 0.9rem;
  color: #555;
}

/* Order Summary block */
.summary-details {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
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
  font-size: 1.15rem;
  font-weight: 700;
  color: #222;
  margin-top: 0.5rem;
}

/* Secure checkout message */
.secure-checkout-message {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eaf6ff;
  color: #007bff;
  font-weight: 500;
  padding: 1rem;
  margin-top: 1.5rem;
  border-radius: 8px;
  border: 1px solid #cce4f7;
}

.secure-checkout-message svg {
  margin-right: 0.5rem;
}

    `}</style>

    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Complete Your Order</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              <section className="form-section">
                <h2 className="section-title">Student Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="e.g., STU2024001"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Law">Law</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Any special dietary requirements or preparation notes..."
                  ></textarea>
                </div>
              </section>
              
              <section className="form-section">
                <h2 className="section-title">Payment Method</h2>
                
                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="cash-on-pickup"
                      name="paymentMethod"
                      value="cash-on-pickup"
                      checked={formData.paymentMethod === 'cash-on-pickup'}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="cash-on-pickup">
                      <FaMoneyBill /> Cash on Pickup (Recommended)
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleChange}
                    />
                    <label htmlFor="credit-card">
                      <FaCreditCard /> Credit/Debit Card
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    <label htmlFor="paypal">
                      <FaPaypal /> PayPal
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'credit-card' && (
                  <div className="credit-card-details">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required={formData.paymentMethod === 'credit-card'}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required={formData.paymentMethod === 'credit-card'}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required={formData.paymentMethod === 'credit-card'}
                          className="form-control"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          required={formData.paymentMethod === 'credit-card'}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
              
              <div className="checkout-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-lg btn-primary btn-block ${loading ? 'btn-loading' : ''}`}
                >
                  {loading ? 'Processing Order...' : (
                    <>
                      <FaLock /> Place Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div style={{
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              color: '#0066cc',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <FaClock style={{marginRight: '8px'}} />
              <strong>Pickup Time:</strong> {getPickupTime()}
              <br />
              <FaMapMarkerAlt style={{marginRight: '8px', marginTop: '8px'}} />
              <strong>Location:</strong> Canteen Counter
            </div>
            
            <div className="cart-items-summary">
              {cart.items.map((item) => (
                <div key={item.productId} className="summary-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-price">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
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
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="secure-checkout-message">
              <FaLock /> Secure checkout - Your information is protected
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Checkout;