import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Protected Route Guard
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
};

// Anonymous Route Guard (Prevents logged-in users from accessing Login/Signup)
export const AnonymousRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};
