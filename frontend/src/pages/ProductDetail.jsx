import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { mockProducts } from '../services/mockData';
import { FaShoppingCart, FaHeart, FaTruck, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Related products will be populated based on similar category/attributes
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setAdded(false);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        
        // Get related products (could be from same category or similar products)
        const allProducts = await api.get('/products');
        // Filter out current product and take up to 4 related products
        // In a real app, you'd have a more sophisticated recommendation algorithm
        const related = allProducts.data
          .filter(p => p.product_id !== parseInt(id))
          .slice(0, 4);
        
        setRelatedProducts(related);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        
        // Fallback to mock data if API fails
        const mockProduct = mockProducts.find(p => p.product_id === parseInt(id));
        if (mockProduct) {
          setProduct(mockProduct);
          
          // Get mock related products
          const mockRelated = mockProducts
            .filter(p => p.product_id !== parseInt(id))
            .slice(0, 4);
          
          setRelatedProducts(mockRelated);
        } else {
          setError('Product not found');
        }
        
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock_quantity || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock_quantity || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      
      // Reset the "Added" status after 3 seconds
      setTimeout(() => {
        setAdded(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          {error || 'Product not found'}
        </div>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const discountPercentage = product.discounted_price 
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100) 
    : 0;

  return (
    <>
    <style>{`
    /* Product Info Detail Container */
.product-info-detail {
  max-width: 600px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}

/* Product Title */
.product-title-large {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-transform: capitalize;
}

/* Product Price Section */
.product-price-detail {
  margin-bottom: 2rem;
}

.discounted-price-large {
  font-size: 2rem;
  font-weight: 600;
  color: #e74c3c;
  text-decoration: none;
}

.regular-price-large {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Product Meta Information */
.product-meta {
  margin-bottom: 2rem;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;
  padding: 1.5rem 0;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-weight: 500;
  color: #2c3e50;
  font-size: 1rem;
}

/* Stock Status */
.in-stock {
  color: #27ae60 !important;
  font-weight: 600;
}

.out-of-stock {
  color: #e74c3c !important;
  font-weight: 600;
}

/* Product Description */
.product-description {
  margin-bottom: 2rem;
}

.product-description h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.product-description p {
  color: #555;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}

/* Product Actions */
.product-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

/* Quantity Control */
.quantity-control {
  display: flex;
  align-items: center;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.quantity-btn {
  width: 45px;
  height: 45px;
  border: none;
  background: #f8f9fa;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover {
  background: #e9ecef;
  color: #3498db;
}

.quantity-btn:active {
  transform: scale(0.95);
}

.quantity-input {
  width: 60px;
  height: 45px;
  border: none;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  background: #fff;
  outline: none;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input[type=number] {
  -moz-appearance: textfield;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  min-width: 180px;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2980b9, #1f5f8b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.btn-success:hover {
  background: linear-gradient(135deg, #229954, #1e8449);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
}

.btn:disabled {
  background: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn:disabled:hover {
  background: #bdc3c7;
  transform: none;
  box-shadow: none;
}

/* Icon Styling */
.icon-cart {
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-info-detail {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .product-title-large {
    font-size: 2rem;
  }
  
  .discounted-price-large,
  .regular-price-large {
    font-size: 1.5rem;
  }
  
  .product-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quantity-control {
    justify-content: center;
    width: fit-content;
    margin: 0 auto;
  }
  
  .btn-lg {
    width: 100%;
    margin-top: 1rem;
  }
  
  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .product-info-detail {
    padding: 1rem;
  }
  
  .product-title-large {
    font-size: 1.8rem;
  }
  
  .discounted-price-large,
  .regular-price-large {
    font-size: 1.3rem;
  }
}
`}</style>
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/products">Products</Link> / 
          <span>{product.name}</span>
        </nav>
        
        <div className="product-detail" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
          <div className="product-gallery">
            <img
              src={product.image_url}
              alt={product.name}
              className="product-detail-image"
              style={{height: '380px'}}
            />
            
            {discountPercentage > 0 && (
              <span className="badge badge-accent discount-badge-large">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
          
          <div className="product-info-detail">
            <h1 className="product-title-large">{product.name}</h1>
            
            <div className="product-price-detail">
              {product.discounted_price ? (
                <>
                  <span className="discounted-price-large">₹{product.discounted_price}</span>
                </>
              ) : (
                <span className="regular-price-large">₹{product.price}</span>
              )}
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`meta-value ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock_quantity > 0 
                    ? `In Stock (${product.stock_quantity} available)` 
                    : 'Out of Stock'}
                </span>
              </div>
              
              {product.size && (
                <div className="meta-item">
                  <span className="meta-label">Size:</span>
                  <span className="meta-value">{product.size}</span>
                </div>
              )}
              
              {product.color && (
                <div className="meta-item">
                  <span className="meta-label">Color:</span>
                  <span className="meta-value">{product.color}</span>
                </div>
              )}
            </div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            {product.stock_quantity > 0 && (
              <div className="product-actions">
                <div className="quantity-control">
                  <button onClick={decrementQuantity} className="quantity-btn">-</button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button onClick={incrementQuantity} className="quantity-btn">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart} 
                  className={`btn btn-lg ${added ? 'btn-success' : 'btn-primary'}`}
                  disabled={product.stock_quantity === 0}
                >
                  {added ? 'Added to Cart!' : (
                    <>
                      <FaShoppingCart className="icon-cart" /> 
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProductDetail;