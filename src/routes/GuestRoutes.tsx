import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/common/Login';
import Register from '../views/common/Register';
import LandingPage from '../pages/LandingPage';
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
            <LandingPage />
          </ProtectedGuestRoute>
        } 
      />
      <Route 
        path="/login" 
        element={<Login />}
      />
      <Route 
        path="/register" 
        element={<Register />}
      />
    </Routes>
  );
}
