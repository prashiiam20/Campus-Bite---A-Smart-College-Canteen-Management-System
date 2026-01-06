import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import api from '../services/api';
import { mockProducts } from '../services/mockData';
import { FaUtensils, FaClock, FaLeaf, FaHeart } from 'react-icons/fa';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
        setError('Could not fetch menu from server. Showing sample menu instead.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Today's specials (first 4 items)
  const todaysSpecials = products.slice(0, 4);
  
  // Popular items (items with discounts)
  const popularItems = [...products]
    .filter(product => product.discounted_price)
    .slice(0, 4);

  // Check if ordering is available
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
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{
        background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title slide-up">Fresh Meals, Zero Wait</h1>
            <p className="hero-subtitle fade-in">
              Pre-order your lunch and pick it up in 30 minutes. Beat the lunch rush!
            </p>
            
            {isOrderingAvailable() ? (
              <div className="hero-cta">
                <Link to="/products" className="btn btn-lg btn-primary">
                  Order Now - Pickup at {getPickupTime()}
                </Link>
                <div style={{marginTop: '10px', color: 'white'}}>
                  <FaClock /> Order deadline: 6:00 PM
                </div>
              </div>
            ) : (
              <div className="hero-cta">
                <div className="btn btn-lg btn-secondary" style={{opacity: 0.7}}>
                  Ordering Closed - Opens Tomorrow 8:00 AM
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3 className="feature-title">Quick Pickup</h3>
              <p className="feature-text">
                Order before 6:00 PM, pickup in 30 minutes
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FaUtensils />
              </div>
              <h3 className="feature-title">Fresh Daily</h3>
              <p className="feature-text">
                All meals prepared fresh every morning
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FaLeaf />
              </div>
              <h3 className="feature-title">Healthy Options</h3>
              <p className="feature-text">
                Nutritious meals for busy students
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FaHeart />
              </div>
              <h3 className="feature-title">Student Friendly</h3>
              <p className="feature-text">
                Affordable prices for college budgets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Specials Section */}
      <section className="product-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Today's Specials</h2>
            <Link to="/products" className="view-all">View Full Menu</Link>
          </div>
          
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading today's menu...</p>
            </div>
          ) : error ? (
            <div className="alert alert-info">{error}</div>
          ) : (
            <div className="product-grid">
              {todaysSpecials.map(product => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Items Section */}
      {popularItems.length > 0 && (
        <section className="product-section bg-light">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Student Favorites</h2>
              <Link to="/products" className="view-all">View All</Link>
            </div>
            
            <div className="product-grid">
              {popularItems.map(product => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ordering Info Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">How It Works</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', marginBottom: '1rem'}}>1️⃣</div>
                <h3>Browse Menu</h3>
                <p>Check out today's fresh offerings</p>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', marginBottom: '1rem'}}>2️⃣</div>
                <h3>Place Order</h3>
                <p>Order before 6:00 PM deadline</p>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', marginBottom: '1rem'}}>3️⃣</div>
                <h3>Quick Pickup</h3>
                <p>Collect your meal in 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;