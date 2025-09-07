import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from '../store';

interface ProtectedGuestRouteProps {
  children: React.ReactNode;
}

export function ProtectedGuestRoute({ children }: ProtectedGuestRouteProps) {
  const { isLoggedIn } = useStore();
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

export function GuestRoutes() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedGuestRoute>
            <div>Landing Page Placeholder</div>
          </ProtectedGuestRoute>
        } 
      />
      <Route 
        path="/login" 
        element={<div>Login Placeholder</div>}
      />
      <Route 
        path="/register" 
        element={<div>Register Placeholder</div>}
      />
    </Routes>
  );
}
