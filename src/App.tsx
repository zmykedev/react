import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './views/common/Layout';
import Navbar from './components/Navbar';
import useStore from './store';
import { AntdConfigProvider } from './providers/AntdConfigProvider';
import { ProtectedGuestRoute } from './routes/GuestRoutes';

// Lazy load components for better performance
const Login = lazy(() => import('./views/common/Login'));
const Register = lazy(() => import('./views/common/Register'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const BookList = lazy(() => import('./pages/BookList'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./components/UserProfile').then(module => ({ default: module.UserProfile })));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" tip="Cargando..." />
  </div>
);

function ProtectedAuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useStore();
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}


function AppContent() {
  const { isLoggedIn } = useStore();

  return (
    <Layout>
      {isLoggedIn && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
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
            element={
              <ProtectedAuthRoute>
                <Login />
              </ProtectedAuthRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedAuthRoute>
                <Register />
              </ProtectedAuthRoute>
            } 
          />
          
          {/* Protected routes */}
          {isLoggedIn ? (
            <>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AntdConfigProvider>
          <AppContent />
        </AntdConfigProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
