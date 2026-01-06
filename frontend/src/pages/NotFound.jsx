import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-message">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <FaHome /> Back to Home
            </Link>
            
            <Link to="/products" className="btn btn-outline">
              <FaSearch /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;