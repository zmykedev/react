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
    <Header className="shadow-sm border-b border-solid border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      {/* Logo y Título */}
      <Space align="center">
        <Avatar 
          size={40} 
          style={{ backgroundColor: '#288592' }}
          icon={<BookOutlined />}
        />
        <Typography.Title 
          level={3} 
          className="ml-3 mb-0 cursor-pointer text-fountain-blue-900 dark:text-fountain-blue-100 hover:text-fountain-blue-600 dark:hover:text-fountain-blue-200 transition-colors"
          onClick={() => navigate('/')}
        >
          CMPC <span className="font-light">Inventario</span>
        </Typography.Title>
      </Space>

      {/* Navegación Desktop */}
      <div className="hidden md:flex items-center">
        {/* Enlaces de navegación para usuarios no logueados */}
        {!user && (
          <Space size="large">
            <Button 
              type="text" 
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Inicio
            </Button>
            <Button 
              type="text" 
              icon={<BookOutlined />}
              onClick={() => navigate('/books')}
            >
              Catálogo
            </Button>
            <Button 
              type="text" 
              icon={<UserOutlined />}
              onClick={() => navigate('/about')}
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
              >
                {item.label}
              </Button>
            ))}
          </Space>
        )}
        
        {/* Switch de tema */}
        <Space className="ml-6">
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Space>

        {/* Usuario y acciones */}
        <Space size="middle" className="ml-6">
          {user ? (
            <>
              {/* Notificaciones */}
              <Badge count={5} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                />
              </Badge>
              
              {/* Información del usuario */}
              <Space direction="vertical" size={0} className="text-right">
                <Text strong className="block">
                  {userName || user?.firstName || 'Usuario'}
                </Text>
                <Text type="secondary" className="text-xs block">
                  {userEmail || user?.email || 'usuario@cmpc.com'}
                </Text>
              </Space>
              
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
              >
                Registrarse
              </Button>
              
              {/* Botón de login */}
              <Button 
                type="primary" 
                icon={<UserOutlined />}
                onClick={() => navigate('/login')}
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
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
