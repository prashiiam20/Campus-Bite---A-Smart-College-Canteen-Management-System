import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { mockProducts } from '../../services/mockData';
import { FaEdit, FaTrash, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'product_id', direction: 'asc' });

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
        setError('Could not fetch products from server. Showing sample data instead.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id.toString().includes(searchTerm)
    );
    
    // Sort products
    const sortedProducts = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredProducts(sortedProducts);
  }, [searchTerm, products, sortConfig]);

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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(product => product.product_id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        // For demo purposes, just remove from the UI
        setProducts(products.filter(product => product.product_id !== productId));
        alert('Product was removed from the UI but the server operation failed.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading products...</p>
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
    `}</style>
    <div className="product-list-admin">
      {error && (
        <div className="alert alert-info">{error}</div>
      )}
      
      <div className="admin-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <Link to="/admin/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or add a new product.</p>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('product_id')}>
                  ID {getSortIcon('product_id')}
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Product {getSortIcon('name')}
                </th>
                <th className="sortable" onClick={() => handleSort('price')}>
                  Price {getSortIcon('price')}
                </th>
                <th className="sortable" onClick={() => handleSort('stock_quantity')}>
                  Stock {getSortIcon('stock_quantity')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.product_id}>
                  <td>#{product.product_id}</td>
                  <td className="product-cell">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-category">
                        {product.size && <span>Size: {product.size}</span>}
                        {product.color && <span>Color: {product.color}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="price-cell">
                    {product.discounted_price ? (
                      <>
                        <span className="original-price">₹{parseFloat(product.price).toFixed(2)}</span>
                        <span className="discounted-price">₹{parseFloat(product.discounted_price).toFixed(2)}</span>
                      </>
                    ) : (
                      <span>₹{parseFloat(product.price).toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span className={`stock-badge ${
                      product.stock_quantity === 0 ? 'out-of-stock' : 
                      product.stock_quantity < 10 ? 'low-stock' : 'in-stock'
                    }`}>
                      {product.stock_quantity === 0 ? 'Out of stock' : 
                       product.stock_quantity < 10 ? `${product.stock_quantity} left` : 
                       `${product.stock_quantity} in stock`}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link 
                      to={`/admin/products/edit/${product.product_id}`} 
                      className="btn btn-sm btn-outline edit-btn"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product.product_id)}
                      className="btn btn-sm btn-outline delete-btn"
                    >
                      <FaTrash /> Delete
                    </button>
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

export default ProductList;