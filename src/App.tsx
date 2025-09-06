import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login  from './views/common/Login';
import Register from './views/common/Register';
import LandingPage from './pages/LandingPage';
import BookList from './pages/BookList';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './views/common/Layout';
import Navbar from './components/Navbar';
import { UserProfile } from './components/UserProfile';
import useStore from './store';
import { AntdConfigProvider } from './providers/AntdConfigProvider';
import { ProtectedGuestRoute } from './routes/GuestRoutes';

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
