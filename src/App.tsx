// React Router imports for routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Ant Design provider
import { AntdConfigProvider } from './providers/AntdConfigProvider';
// Context and theme providers
import { ThemeProvider} from './contexts/ThemeContext';

// Layout and navigation components
import { Layout } from './views/common/Layout';
import Navbar from './components/Navbar';

// User-related components
import { UserProfile } from './components/UserProfile';

// Store (state management)
import useStore from './store';

// Route protection and guest routes
import { GuestRoutes } from './routes/GuestRoutes';
import { ProtectedAuthRoute } from './routes/ProtectedAuthRoute';

// Page components
import BookList from './pages/BookList';
import Dashboard from './pages/Dashboard';


function AppContent() {
  const { isLoggedIn } = useStore();
  
  return (
    <Layout>
      {isLoggedIn && <Navbar />}
      <GuestRoutes />
      <Routes>
        {/* Protected routes */}
        {isLoggedIn ? (
          <>
            <Route path="/profile" element={<ProtectedAuthRoute><UserProfile /></ProtectedAuthRoute>} />
            <Route path="/books" element={<ProtectedAuthRoute><BookList /></ProtectedAuthRoute>} />
            <Route path="/dashboard" element={<ProtectedAuthRoute><Dashboard /></ProtectedAuthRoute>} />
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
