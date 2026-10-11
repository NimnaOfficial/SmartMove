import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '@/services/authService';

interface ProtectedRouteProps {
  allowedRoles?: ('ADMIN' | 'DRIVER' | 'PASSENGER')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated || !currentUser) {
    // Redirect to login page and preserve attempted path in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (currentUser.role || '').toUpperCase();
    const hasRole = allowedRoles.some((role) => role.toUpperCase() === userRole);

    if (!hasRole) {
      // Redirect to user's assigned dashboard or 403 page
      if (userRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (userRole === 'DRIVER') return <Navigate to="/driver/dashboard" replace />;
      if (userRole === 'PASSENGER') return <Navigate to="/passenger/dashboard" replace />;
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
}
