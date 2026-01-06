import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin()) {
    // Route requires admin but user is not admin
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has required permissions
  return children;
}

export default ProtectedRoute;