import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { mockProducts, mockOrders } from '../../services/mockData';
import { FaUtensils, FaShoppingCart, FaUsers, FaDollarSign, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { MdCurrencyRupee } from "react-icons/md";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalStudents: 0,
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real application, you'd have API endpoints for these stats
        // For now, we'll use mock data
        const productsResponse = await api.get('/products');
        const products = productsResponse.data;
        
        const ordersResponse = await api.get('/orders');
        const orders = ordersResponse.data;

        const userResponse = await api.get('/users');
        const users = userResponse.data;
        
        // Calculate statistics
        const totalMenuItems = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
        const totalStudents = users.length-1; // Mock value
        
        // Find items with low stock (less than 10 items)
        const lowStockItems = products.filter(product => product.stock_quantity < 10);
        
        // Get recent orders (last 5)
        const recent = [...orders].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        
        setStats({
          totalMenuItems,
          totalOrders,
          totalRevenue,
          totalStudents,
          lowStockItems
        });
        
        setRecentOrders(recent);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Fallback to mock data
        const totalMenuItems = mockProducts.length;
        const totalOrders = mockOrders.length;
        const totalRevenue = mockOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
        const totalStudents = 156;
        const lowStockItems = mockProducts.filter(product => product.stock_quantity < 10);
        
        setStats({
          totalMenuItems,
          totalOrders,
          totalRevenue,
          totalStudents,
          lowStockItems
        });
        
        setRecentOrders(mockOrders.slice(0, 5));
        setError('Could not fetch dashboard data. Showing sample data instead.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Check if ordering is currently available
  const isOrderingAvailable = () => {
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(18, 0, 0, 0); // 11:30 AM
    return now < cutoffTime;
  };

  const getTimeUntilCutoff = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(18, 0, 0, 0);
    
    if (now > cutoff) {
      // Past cutoff, show next day
      cutoff.setDate(cutoff.getDate() + 1);
      cutoff.setHours(8, 0, 0, 0); // 8:00 AM next day
      return `Ordering opens tomorrow at 8:00 AM`;
    }
    
    const diff = cutoff - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m until ordering closes`;
    }
    return `${minutes}m until ordering closes`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <>
    <style>{`
    body {
  background: #f7f7f7;
  color: #333;
  font-family: 'Segoe UI', sans-serif;
}
    /* Dashboard Stats Grid */

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

/* Stat Card */

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Icon Box */

.stat-icon {
  font-size: 1.8rem;
  padding: 0.8rem;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.products {
  background: #42a5f5;
}

.stat-icon.orders {
  background: #66bb6a;
}

.stat-icon.revenue {
  background: #ffa726;
}

.stat-icon.users {
  background: #ab47bc;
}

/* Stat Content */

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.4rem;
}

/* Stat Change */

.stat-change {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stat-change.positive {
  color: #43a047;
}

.stat-change.negative {
  color: #e53935;
}

    `}</style>
    <div className="admin-dashboard">
      {error && (
        <div className="alert alert-info">{error}</div>
      )}

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
            <strong>Ordering Open!</strong> {getTimeUntilCutoff()}
          </span>
        ) : (
          <span>
            <strong>Ordering Closed</strong> - {getTimeUntilCutoff()}
          </span>
        )}
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon products">
            <FaUtensils />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Menu Items</h3>
            <div className="stat-value">{stats.totalMenuItems}</div>
            <div className="stat-change positive">
              <FaArrowUp /> 3 new items this week
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Today's Orders</h3>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-change positive">
              <FaArrowUp /> 15% from yesterday
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <MdCurrencyRupee />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Today's Revenue</h3>
            <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-change positive">
              <FaArrowUp /> 12% from yesterday
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Active Students</h3>
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-change positive">
              <FaArrowUp /> 8 new registrations
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <Link to="/admin/orders" className="view-all">View All</Link>
          </div>
          
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Time</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td>Student {order.user_id}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status === 'placed' ? 'Preparing' : 
                         order.status === 'shipped' ? 'Ready' : 
                         order.status}
                      </span>
                    </td>
                    <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td>
                      <Link to={`/admin/orders/${order.order_id}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaExclamationTriangle className="warning-icon" /> Low Stock Items
            </h2>
            <Link to="/admin/products" className="view-all">Manage Menu</Link>
          </div>
          
          {stats.lowStockItems.length === 0 ? (
            <div className="empty-state">
              <p>All menu items are well stocked.</p>
            </div>
          ) : (
            <div className="low-stock-products">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>ID</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockItems.map(product => (
                    <tr key={product.product_id}>
                      <td className="product-cell">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="product-thumbnail"
                        />
                        <span className="product-name">{product.name}</span>
                      </td>
                      <td>#{product.product_id}</td>
                      <td className="stock-cell">
                        <span className={`stock-badge ${product.stock_quantity === 0 ? 'out-of-stock' : 'low-stock'}`}>
                          {product.stock_quantity === 0 ? 'Sold Out' : `${product.stock_quantity} left`}
                        </span>
                      </td>
                      <td>₹{parseFloat(product.price).toFixed(2)}</td>
                      <td>
                        <Link 
                          to={`/admin/products/edit/${product.product_id}`} 
                          className="btn btn-sm btn-outline"
                        >
                          Update Stock
                        </Link>
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
    </>
  );
}

export default AdminDashboard;