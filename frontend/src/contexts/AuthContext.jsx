import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token) {
      setCurrentUser({
        token,
        role: userRole || 'user'
      });
    }
    
    setLoading(false);
  }, []);

  // Register new user
  const register = async (name, email, password, phone) => {
    try {
      setError('');
      const response = await api.post('/signup', {
        name,
        email,
        password,
        phone
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'user');
      
      setCurrentUser({
        token,
        role: 'user'
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create an account');
      return { success: false, error: error };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError('');
      const response = await api.post('/signin', {
        email,
        password
      });
      
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role || 'user');
      
      setCurrentUser({
        token,
        role: role || 'user'
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
      return { success: false, error: error };
    }
  };

  const adminlogin = async (email, password, secretKey) => {
    try {
      setError('');
      const response = await api.post('/admin_signup', {
        email,
        password,
        secretKey
      });
      
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role || 'user');
      
      setCurrentUser({
        token,
        role: role || 'user'
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
      return { success: false, error: error };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
    navigate('/');
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    isAdmin,
    adminlogin,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}