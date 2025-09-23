import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, requireRole }) {
  const location = useLocation();

  // For admin routes, check admin key instead of JWT token
  if (requireRole === 'admin') {
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('adminKey') : null;

    if (!adminKey || adminKey !== '985d638bafbb39fb') {
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
  }

  // For other protected routes, no authentication required (public access)
  return children;
}
