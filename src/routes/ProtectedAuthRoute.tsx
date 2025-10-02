import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store';

interface ProtectedAuthRouteProps {
  children: React.ReactNode;
}

export function ProtectedAuthRoute({ children }: ProtectedAuthRouteProps) {

  
  return <>{children}</>;
}
