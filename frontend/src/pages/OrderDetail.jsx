import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { mockOrders } from '../services/mockData';
import { FaBox, FaTruck, FaCheckCircle, FaArrowLeft, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        
        // Fallback to mock data if API fails
        const mockOrder = mockOrders.find(o => o.order_id === parseInt(id));
        if (mockOrder) {
          setOrder(mockOrder);
        } else {
          setError('Order not found');
        }
        
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          {error || 'Order not found'}
        </div>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const expectedDeliveryDate = order.expected_delivery_date
    ? new Date(order.expected_delivery_date).toLocaleDateString()
    : 'Not available';

  const getOrderStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'status-placed';
      case 'processed':
        return 'status-processed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  const renderStatusSteps = () => {
    const steps = [
      { status: 'placed', label: 'Order Placed', icon: <FaBox /> },
      { status: 'processed', label: 'Processing', icon: <FaBox /> },
      { status: 'shipped', label: 'Shipped', icon: <FaTruck /> },
      { status: 'delivered', label: 'Delivered', icon: <FaCheckCircle /> }
    ];
    
    const currentStep = steps.findIndex(step => 
      step.status.toLowerCase() === order.status.toLowerCase()
    );
    
    return (
      <div className="order-status-steps">
        {steps.map((step, index) => (
          <div 
            key={step.status} 
            className={`status-step ${index <= currentStep ? 'active' : ''}`}
          >
            <div className="step-icon">
              {step.icon}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>

    <style>{`

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-title {
  font-size: 1.75rem;
  color: #222;
}

.order-detail-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

/* Left-side details section */
.order-detail-info {
  flex: 1 1 300px;
}

.order-status-section, .order-meta-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
}

.order-status {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 5px;
  display: inline-block;
}

.order-status.placed {
  background-color: #e0f3ff;
  color: #007bff;
}

.order-status.processing {
  background-color: #fff5e5;
  color: #ff9800;
}

.order-status.completed {
  background-color: #e8f5e9;
  color: #43a047;
}

.tracking-info {
  margin-top: 1rem;
}

.tracking-number {
  font-weight: 600;
  margin: 0.5rem 0;
}

.meta-block {
  margin-bottom: 1.5rem;
}

.meta-info {
  margin-top: 0.5rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.meta-label {
  font-weight: 500;
  color: #555;
}

.meta-value {
  color: #222;
}

.payment-status-pending {
  color: #ff9800;
}

.payment-status-paid {
  color: #43a047;
}

.address-box {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.address-icon {
  color: #007bff;
  margin-top: 0.2rem;
}

.address-text {
  color: #333;
}

/* Right-side order items section */
.order-items-section {
  flex: 1 1 450px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.order-items-list {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.order-item-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.item-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  font-size: 1rem;
  margin: 0 0 0.25rem;
  color: #333;
}

.item-price, .item-quantity {
  font-size: 0.9rem;
  color: #555;
}

.item-total {
  font-weight: 600;
  color: #222;
}

/* Order summary */
.order-summary {
  margin-top: 1rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.summary-row.subtotal, 
.summary-row.shipping, 
.summary-row.tax {
  border-bottom: 1px solid #eee;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.15rem;
  margin-top: 0.5rem;
}

/* Action buttons */
.order-actions {
  margin-top: 2rem;
}

.order-actions .btn {
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
}

.order-actions .btn-outline {
  border: 1px solid #007bff;
  color: #007bff;
  background: #fff;
}

.order-actions .btn-outline:hover {
  background: #007bff;
  color: #fff;
}

    `}</style>

    <div className="order-detail-page">
      <div className="container">
        <div className="page-header">
          <Link to="/orders" className="back-link">
            <FaArrowLeft /> Back to Orders
          </Link>
          <h1 className="page-title">Order #{order.order_id}</h1>
        </div>
        
        <div className="order-detail-content">
          <div className="order-detail-info">
            <div className="order-status-section">
              <h3>Order Status</h3>
              <div className={`order-status ${getOrderStatusClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              
              
              
              {order.tracking_number && (
                <div className="tracking-info">
                  <h4>Tracking Number</h4>
                  <div className="tracking-number">{order.tracking_number}</div>
                  <a href="#" className="btn btn-sm btn-secondary">Track Package</a>
                </div>
              )}
            </div>
            
            <div className="order-meta-section">
              <div className="meta-block">
                <h3>Order Information</h3>
                <div className="meta-info">
                  <div className="meta-row">
                    <div className="meta-label">Order Date:</div>
                    <div className="meta-value">{orderDate}</div>
                  </div>
                  <div className="meta-row">
                    <div className="meta-label">Payment Method:</div>
                    <div className="meta-value">
                      <FaCreditCard /> {order.payment_method}
                    </div>
                  </div>
                  <div className="meta-row">
                    <div className="meta-label">Payment Status:</div>
                    <div className={`meta-value payment-status-${order.payment_status}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="meta-block">
                <h3>Pickup Address</h3>
                <div className="address-box">
                  <FaMapMarkerAlt className="address-icon" />
                  <div className="address-text">
                    {order.shipping_address}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-items-section">
            <h3>Order Items</h3>
            
            <div className="order-items-list">
              {order.OrderItems?.map((item) => (
                <div key={item.item_id} className="order-item-detail">
                  <div className="item-image">
                    <img 
                      src={item.Product?.image_url} 
                      alt={item.Product?.name} 
                    />
                  </div>
                  
                  <div className="item-info">
                    <h4 className="item-name">{item.Product?.name}</h4>
                    <div className="item-price">₹{parseFloat(item.price).toFixed(2)}</div>
                    <div className="item-quantity">Quantity: {item.quantity}</div>
                  </div>
                  
                  <div className="item-total">
                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row subtotal">
                <div className="summary-label">Subtotal</div>
                <div className="summary-value">₹{parseFloat(order.total_amount).toFixed(2)}</div>
              </div>
              
              <div className="summary-row shipping">
                <div className="summary-label">Shipping</div>
                <div className="summary-value">Free</div>
              </div>
              
              <div className="summary-row tax">
                <div className="summary-label">Tax</div>
                <div className="summary-value">Included</div>
              </div>
              
              <div className="summary-row total">
                <div className="summary-label">Total</div>
                <div className="summary-value">₹{parseFloat(order.total_amount).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="order-actions">
            <Link to="/contact" className="btn btn-outline">
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default OrderDetail;