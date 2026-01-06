import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaChartBar, FaPlus, FaTachometerAlt } from 'react-icons/fa';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductList from '../components/admin/ProductList';
import ProductForm from '../components/admin/ProductForm';
import OrderList from '../components/admin/OrderList';
import OrderDetail from '../components/admin/OrderDetail';
import UserList from '../components/admin/UserList';

function Admin() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {sidebarOpen ? '×' : '☰'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className={isActive('/admin/dashboard') ? 'active' : ''}>
              <Link to="/admin/dashboard">
                <FaTachometerAlt /> 
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/admin/products') ? 'active' : ''}>
              <Link to="/admin/products">
                <FaBox /> 
                <span className="nav-text">Products</span>
              </Link>
            </li>
            <li className={isActive('/admin/orders') ? 'active' : ''}>
              <Link to="/admin/orders">
                <FaShoppingCart /> 
                <span className="nav-text">Orders</span>
              </Link>
            </li>
            <li className={isActive('/admin/users') ? 'active' : ''}>
              <Link to="/admin/users">
                <FaUsers /> 
                <span className="nav-text">Users</span>
              </Link>
            </li>
            <li className={isActive('/admin/analytics') ? 'active' : ''}>
              <Link to="/admin/analytics">
                <FaChartBar /> 
                <span className="nav-text">Analytics</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <div className="admin-title">
            {location.pathname.includes('/products/new') && (
              <h1>Add New Product</h1>
            )}
            {location.pathname.includes('/products/edit') && (
              <h1>Edit Product</h1>
            )}
            {location.pathname === '/admin/products' && (
              <h1>Products</h1>
            )}
            {location.pathname === '/admin/orders' && (
              <h1>Orders</h1>
            )}
            {location.pathname.includes('/orders/') && !location.pathname.includes('/admin/orders') && (
              <h1>Order Details</h1>
            )}
            {location.pathname === '/admin/users' && (
              <h1>Users</h1>
            )}
            {location.pathname === '/admin/dashboard' && (
              <h1>Dashboard</h1>
            )}
            {location.pathname === '/admin/analytics' && (
              <h1>Analytics</h1>
            )}
          </div>
          
          <div className="admin-actions">
            {location.pathname === '/admin/products' && (
              <Link to="/admin/products/new" className="btn btn-primary">
                <FaPlus /> Add Product
              </Link>
            )}
          </div>
        </div>
        
        <div className="admin-main">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/analytics" element={<div>Analytics Content</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;