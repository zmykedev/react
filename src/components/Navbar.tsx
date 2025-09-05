import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Button, 
  Avatar, 
  Dropdown, 
  Space, 
  Typography,
  Switch,
  Divider,
  Badge
} from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import useStore from '../store';
import { useTheme } from '../contexts/ThemeContext';

const { Header } = Layout;
const { Text } = Typography;

interface NavbarProps {
  userName?: string;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userEmail }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, getUser } = useStore();
  const { theme, toggleTheme } = useTheme();
  
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Mi Perfil',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      label: 'Configuración',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const navigationItems = [
    {
      key: 'books',
      label: 'Libros',
      icon: <BookOutlined />,
      onClick: () => navigate('/books')
    },
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <BarChartOutlined />,
      onClick: () => navigate('/dashboard')
    }
  ];

  return (
    <Header className="shadow-sm border-b border-primary px-6 flex items-center justify-between">
      {/* Logo y Título */}
      <div className="flex items-center">
        <Avatar 
          size={40} 
          style={{ backgroundColor: '#288592' }}
          icon={<BookOutlined />}
        />
        <Typography.Title 
          level={3} 
          className="ml-3 mb-0 cursor-pointer hover:text-fountain-blue-600 dark:hover:text-fountain-blue-200 transition-colors"
          onClick={() => navigate('/')}
        >
          CMPC <span className="font-light">Inventario</span>
        </Typography.Title>
      </div>

      {/* Navegación Desktop */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Enlaces de navegación para usuarios no logueados */}
        {!user && (
          <Space size="large">
            <Button 
              type="text" 
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
            >
              Inicio
            </Button>
            <Button 
              type="text" 
              icon={<BookOutlined />}
              onClick={() => navigate('/books')}
              className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
            >
              Catálogo
            </Button>
            <Button 
              type="text" 
              icon={<UserOutlined />}
              onClick={() => navigate('/about')}
              className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
            >
              Acerca de
            </Button>
          </Space>
        )}
        
        {/* Enlaces de navegación para usuarios logueados */}
        {user && (
          <Space size="middle">
            {navigationItems.map(item => (
              <Button 
                key={item.key}
                type="text" 
                icon={item.icon}
                onClick={item.onClick}
                className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
              >
                {item.label}
              </Button>
            ))}
          </Space>
        )}
        
        {/* Switch de tema */}
        <div className="flex items-center">
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            className="bg-fountain-blue-300 dark:bg-fountain-blue-600"
          />
        </div>

        {/* Usuario y acciones */}
        <Space size="middle">
          {user ? (
            <>
              {/* Notificaciones */}
              <Badge count={5} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
                />
              </Badge>
              
              {/* Información del usuario */}
              <div className="text-right">
                <Text strong className="block">
                  {userName || user?.firstName || 'Usuario'}
                </Text>
                <Text type="secondary" className="text-xs block">
                  {userEmail || user?.email || 'usuario@cmpc.com'}
                </Text>
              </div>
              
              {/* Menú de usuario */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar 
                  size={32} 
                  icon={<UserOutlined />}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Dropdown>
            </>
          ) : (
            <Space size="middle">
              {/* Botón de registro */}
              <Button 
                type="text"
                icon={<UserOutlined />}
                onClick={() => navigate('/register')}
                className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
              >
                Registrarse
              </Button>
              
              {/* Botón de login */}
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={() => navigate('/login')}
                className="btn-primary hover:bg-fountain-blue-700 transition-all"
                size="middle"
              >
                Iniciar Sesión
              </Button>
            </Space>
          )}
        </Space>
      </div>

      {/* Botón de menú móvil */}
      <div className="md:hidden flex items-center space-x-3">
        {/* Switch de tema móvil */}
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          size="small"
          className="bg-fountain-blue-300 dark:bg-fountain-blue-600"
        />
        
        {/* Botón de menú */}
        <Dropdown
          menu={{ 
            items: [
              // Enlaces para usuarios no logueados
              ...(user ? [] : [
                {
                  key: 'home',
                  label: 'Inicio',
                  icon: <HomeOutlined />,
                  onClick: () => navigate('/')
                },
                {
                  key: 'catalog',
                  label: 'Catálogo',
                  icon: <BookOutlined />,
                  onClick: () => navigate('/books')
                },
                {
                  key: 'about',
                  label: 'Acerca de',
                  icon: <UserOutlined />,
                  onClick: () => navigate('/about')
                },
                { type: 'divider' as const },
                {
                  key: 'register',
                  label: 'Registrarse',
                  icon: <UserOutlined />,
                  onClick: () => navigate('/register')
                },
                {
                  key: 'login',
                  label: 'Iniciar Sesión',
                  icon: <UserOutlined />,
                  onClick: () => navigate('/login')
                }
              ]),
              // Enlaces para usuarios logueados
              ...(user ? [
                ...navigationItems,
                { type: 'divider' as const },
                ...userMenuItems
              ] : [])
            ]
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button 
            type="text" 
            icon={<MenuOutlined />}
            className="hover:bg-fountain-blue-50 dark:hover:bg-fountain-blue-800/50 transition-all"
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
