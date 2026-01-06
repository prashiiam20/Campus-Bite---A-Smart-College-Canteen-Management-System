import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaClock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

function Header() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if ordering is available (before 11:30 AM)
  const isOrderingAvailable = () => {
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(18, 0, 0, 0); // 11:30 AM
    return now < cutoffTime;
  };

  const getPickupTime = () => {
    const now = new Date();
    const pickupTime = new Date(now.getTime() + 30 * 60000); // Add 30 minutes
    return pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>College Canteen</h1>
            </Link>
          </div>

          <div className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className={location.pathname.includes('/products') ? 'active' : ''}>Menu</Link>
              </li>
              <li className="nav-item">
                <div className="ordering-status">
                  <FaClock />
                  {isOrderingAvailable() ? (
                    <span className="status-available">
                      Order by 6:00 PM | Pickup: {getPickupTime()}
                    </span>
                  ) : (
                    <span className="status-closed">
                      Ordering Closed - Opens Tomorrow 8:00 AM
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="user-actions">
              <Link to="/cart" className="cart-icon">
                <FaShoppingCart />
                {cart.totalItems > 0 && (
                  <span className="cart-count">{cart.totalItems}</span>
                )}
              </Link>
              
              {currentUser ? (
                <div className="user-dropdown">
                  <button className="user-button">
                    <FaUser />
                  </button>
                  <div className="dropdown-menu">
                    {isAdmin() && (
                      <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                    )}
                    <Link to="/orders" className="dropdown-item">My Orders</Link>
                    <button onClick={logout} className="dropdown-item logout-button">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
                  <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;