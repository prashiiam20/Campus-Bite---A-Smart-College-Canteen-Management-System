import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaHeart, FaClock, FaExclamationTriangle } from 'react-icons/fa';

function ProductCard({ product, isOrderingAvailable = true }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOrderingAvailable) {
      alert('Ordering is currently closed. Please order before 11:30 AM.');
      return;
    }
    
    addToCart(product);
    setIsAdded(true);
    
    // Reset the "Added" status after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const discountPercentage = product.discounted_price 
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100) 
    : 0;

  return (
    <div 
      className="card product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.product_id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="product-image"
          />
          
          {discountPercentage > 0 && (
            <span className="badge badge-accent discount-badge">
              {discountPercentage}% OFF
            </span>
          )}

          {!isOrderingAvailable && (
            <div className="ordering-closed-overlay">
              <FaExclamationTriangle />
              <span>Ordering Closed</span>
            </div>
          )}
          
          <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
            <button 
              className={`btn ${isAdded ? 'btn-secondary' : isOrderingAvailable ? 'btn-primary' : 'btn-disabled'}`}
              onClick={handleAddToCart}
              disabled={!isOrderingAvailable}
            >
              {!isOrderingAvailable ? (
                <>
                  <FaClock className="icon-cart" /> 
                  <span>Ordering Closed</span>
                </>
              ) : isAdded ? 'Added!' : (
                <>
                  <FaShoppingCart className="icon-cart" /> 
                  <span>Add to Order</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          
          <div className="product-price">
            {product.discounted_price ? (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="discounted-price">₹{product.discounted_price}</span>
              </>
            ) : (
              <span className="regular-price">₹{product.price}</span>
            )}
          </div>
          
          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <p className="stock-warning">Only {product.stock_quantity} left today!</p>
          )}
          
          {product.stock_quantity === 0 && (
            <p className="out-of-stock">Sold out today</p>
          )}

          {product.category && (
            <p className="product-category" style={{
              fontSize: '0.875rem',
              color: '#6C757D',
              marginTop: '0.5rem'
            }}>
              {product.category}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;