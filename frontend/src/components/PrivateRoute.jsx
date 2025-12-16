import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole, allowedRoles }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" />;
  }

  const roleAllowed = () => {
    if (requiredRole) {
      return admin.role === requiredRole;
    }
    if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
      return allowedRoles.includes(admin.role);
    }
    return true;
  };

  if (!roleAllowed()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
