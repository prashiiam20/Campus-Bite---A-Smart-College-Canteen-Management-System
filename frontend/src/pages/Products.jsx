import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import api from '../services/api';
import { mockProducts } from '../services/mockData';
import { FaSearch, FaSortUp, FaSortDown, FaClock, FaExclamationTriangle } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const searchTerm = searchParams.get('q') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to mock data
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setError('Could not fetch menu from server. Showing sample menu instead.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter and sort products
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product =>
        product.category && product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, sortConfig, categoryFilter]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  // Check if ordering is available
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

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading today's menu...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
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
              <strong>Ordering Open!</strong> {getTimeUntilCutoff()} | Pickup in 30 minutes
            </span>
          ) : (
            <span>
              <FaExclamationTriangle style={{marginRight: '8px'}} />
              <strong>Ordering Closed</strong> - {getTimeUntilCutoff()}
            </span>
          )}
        </div>

        <div className="page-header">
          <h1>Today's Menu</h1>
          
          <div className="filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="category-filter">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-control"
                style={{minWidth: '150px'}}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sort-options">
              <button
                onClick={() => handleSort("name")}
                className={`flex items-center gap-1 px-4 py-2 border rounded-lg text-sm font-medium transition ${
                  sortConfig.key === "name"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`} 
              >
                Name
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? (
                    <FaSortUp className="w-4 h-4" />
                  ) : (
                    <FaSortDown className="w-4 h-4" />
                  ))}
              </button>

              <button
                onClick={() => handleSort("price")}
                className={`flex items-center gap-1 px-4 py-2 border rounded-lg text-sm font-medium transition ${
                  sortConfig.key === "price"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Price
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? (
                    <FaSortUp className="w-4 h-4" />
                  ) : (
                    <FaSortDown className="w-4 h-4" />
                  ))}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-info">{error}</div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <h2>No menu items found</h2>
            <p>Try adjusting your search criteria or check back later for today's menu</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.product_id} 
                product={product} 
                isOrderingAvailable={isOrderingAvailable()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;