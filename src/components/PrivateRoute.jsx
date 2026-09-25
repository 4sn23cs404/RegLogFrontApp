import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../api/auth';

// Protects routes that need authentication
const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
