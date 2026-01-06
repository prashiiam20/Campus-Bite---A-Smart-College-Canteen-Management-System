import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { mockOrders } from '../../services/mockData';
import { FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

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
        // Fallback to mock data
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setError('Could not fetch orders from server. Showing sample data instead.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders;
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(order => 
        order.order_id.toString().includes(searchTerm) ||
        order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Sort orders
    const sortedOrders = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredOrders(sortedOrders);
  }, [searchTerm, statusFilter, orders, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading orders...</p>
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
    .admin-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-box {
  position: relative;
  max-width: 280px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.5rem;
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
  border-radius: 6px;
  outline: none;
}

.search-input::placeholder {
  color: #aaa;
}

.search-input:focus {
  border-color: #42a5f5;
  box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.2);
}

/* Filter Dropdown */

.filter-dropdown {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-icon {
  color: #888;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
  border-radius: 6px;
  outline: none;
}

.filter-select:focus {
  border-color: #42a5f5;
  box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.15);
}

/* Orders Table */

.orders-table table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.orders-table th, 
.orders-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
}

.orders-table th {
  background: #f3f3f3;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.orders-table th.sortable:hover {
  background: #ededed;
}

.orders-table tbody tr:hover {
  background: #fafafa;
}

.orders-table td {
  color: #444;
}

/* Status and Payment Badges */

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  color: #fff;
}

.status-badge.placed {
  background: #42a5f5;
}

.status-badge.processed {
  background: #ab47bc;
}

.status-badge.shipped {
  background: #ffa726;
}

.status-badge.delivered {
  background: #66bb6a;
}

.status-badge.cancelled {
  background: #ef5350;
}

.payment-status {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  color: #fff;
}

.payment-status.paid {
  background: #66bb6a;
}

.payment-status.pending {
  background: #ffa726;
}

.payment-status.failed {
  background: #ef5350;
}

/* Buttons */

.btn {
  padding: 0.45rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #f5f5f5;
}

.btn-sm {
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
}

.btn-outline {
  border: 1px solid #42a5f5;
  color: #42a5f5;
}

.btn-outline:hover {
  background: rgba(66, 165, 245, 0.07);
}

/* Empty State */

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #777;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1rem;
}

    `}
    </style>
    <div className="order-list-admin">
      {error && (
        <div className="alert alert-info">{error}</div>
      )}
      
      <div className="admin-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders by ID or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-dropdown">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="processed">Processed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders found</h3>
          <p>Try adjusting your search criteria or filter settings.</p>
        </div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('order_id')}>
                  Order ID {getSortIcon('order_id')}
                </th>
                <th className="sortable" onClick={() => handleSort('createdAt')}>
                  Date {getSortIcon('createdAt')}
                </th>
                <th className="sortable" onClick={() => handleSort('user_id')}>
                  Customer {getSortIcon('user_id')}
                </th>
                <th className="sortable" onClick={() => handleSort('total_amount')}>
                  Total {getSortIcon('total_amount')}
                </th>
                <th className="sortable" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="sortable" onClick={() => handleSort('payment_status')}>
                  Payment {getSortIcon('payment_status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>Customer {order.user_id}</td>
                  <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-status ${order.payment_status.toLowerCase()}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/admin/orders/${order.order_id}`} 
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}

export default OrderList;