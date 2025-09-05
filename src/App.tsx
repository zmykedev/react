import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Login  from './views/common/Login';
import Register from './views/common/Register';
import LandingPage from './pages/LandingPage';
import BookList from './pages/BookList';
import Dashboard from './pages/Dashboard';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Layout } from './views/common/Layout';
import Navbar from './components/Navbar';
import { UserProfile } from './components/UserProfile';
import useStore from './store';

// Componente que protege las rutas de autenticación para usuarios loggeados
function ProtectedAuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useStore();
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Componente que solo permite acceso a usuarios no loggeados
function ProtectedGuestRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useStore();
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Componente que usa el tema para configurar Ant Design
function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useTheme();
  
  const isDark = currentTheme === 'dark';
  
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          // Colores de texto principales
          colorText: isDark ? '#ffffff' : '#1e293b', // fountain-blue-900 en claro, blanco en oscuro
          colorTextHeading: isDark ? '#ffffff' : '#288592', // fountain-blue-600 en claro, blanco en oscuro
          colorTextSecondary: isDark ? '#83d9dd' : '#288592', // fountain-blue-600 en ambos
          colorTextTertiary: isDark ? '#3ab7bf' : '#266c78', // fountain-blue-400 en oscuro, fountain-blue-700 en claro
          colorTextQuaternary: isDark ? '#2da3ad' : '#275963', // fountain-blue-500 en oscuro, fountain-blue-800 en claro
          
          // Colores de fondo
          colorBgContainer: isDark ? '#254a54' : '#ffffff', // fountain-blue-900 en oscuro, blanco en claro
          colorBgElevated: isDark ? '#275963' : '#f0fbfa', // fountain-blue-800 en oscuro, fountain-blue-50 en claro
          colorBgLayout: isDark ? '#133139' : '#f0fbfa', // fountain-blue-950 en oscuro, fountain-blue-50 en claro
          
          // Colores de borde
          colorBorder: isDark ? '#3ab7bf' : '#b5eaec', // fountain-blue-400 en oscuro, fountain-blue-200 en claro
          colorBorderSecondary: isDark ? '#2da3ad' : '#83d9dd', // fountain-blue-500 en oscuro, fountain-blue-300 en claro
          
          // Colores primarios
          colorPrimary: '#288592', // fountain-blue-600
          colorPrimaryHover: '#266c78', // fountain-blue-700
          colorPrimaryActive: '#275963', // fountain-blue-800
          
          // Colores de éxito, error, warning
          colorSuccess: '#10b981', // green-500
          colorError: '#ef4444', // red-500
          colorWarning: '#f59e0b', // amber-500
          colorInfo: '#288592', // fountain-blue-600
          
          // Radio del border radius
          borderRadius: 8,
          
          // Espaciado
          padding: 16,
          margin: 16,
        },
        components: {
          Typography: {
            // Override específico para Typography
            colorText: isDark ? '#ffffff' : '#1e293b',
            colorTextHeading: isDark ? '#ffffff' : '#288592',
            colorTextSecondary: isDark ? '#83d9dd' : '#288592',
          },
          Button: {
            // Override para botones
            borderRadius: 8,
            controlHeight: 40,
          },
          Input: {
            // Override para inputs
            borderRadius: 8,
            controlHeight: 40,
          },
          Layout: {
            // Override específico para Layout (navbar)
            colorBgContainer: isDark ? '#254a54' : '#ffffff',
            colorBgHeader: isDark ? '#254a54' : '#ffffff',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function AppContent() {
  const { getUser, isLoggedIn } = useStore();
  const user = getUser();

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
