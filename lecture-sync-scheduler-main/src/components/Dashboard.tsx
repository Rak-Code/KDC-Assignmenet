
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to the appropriate dashboard based on role
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (role === 'instructor') {
    return <Navigate to="/instructor" replace />;
  }
  
  // Fallback (shouldn't reach here if roles are properly set)
  return <Navigate to="/login" replace />;
};

export default Dashboard;
