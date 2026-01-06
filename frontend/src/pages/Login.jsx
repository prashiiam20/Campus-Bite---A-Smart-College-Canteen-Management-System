import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a redirect parameter in the URL
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/';

  useEffect(() => {
    // If user is already logged in, redirect to home or the redirect URL
    if (currentUser) {
      navigate(redirectUrl);
    }
  }, [currentUser, navigate, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(email, password);
      
      if (result.success) {
        navigate(redirectUrl);
      } else {
        setError(result.error || 'Failed to log in');
      }
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form-container">
            <h1 className="auth-title">Log In</h1>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-options">
                <div className="remember-me">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-lg btn-primary btn-block ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p className='form-label'>Don't have an account?</p>
              <Link to="/register" className={`btn btn-lg btn-primary btn-block ${loading ? 'btn-loading' : ''}`}>
                Create Account
              </Link>
            </div>

            <div className="auth-footer">
              <p className='form-label'>Admin Login</p>
              <Link to="/adminlogin" className={`btn btn-lg btn-primary btn-block ${loading ? 'btn-loading' : ''}`}>
                Login as Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;