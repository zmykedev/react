import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Space,
  Avatar,
  Divider
} from 'antd';
import { BookOutlined, LoginOutlined } from '@ant-design/icons';

import { LANDING_DATA } from '../data/landingData';
import { useScrollToSection } from '../hooks/useScrollToSection';
import { FeatureCard } from '../components/FeatureCard';

const { Header } = Layout;
const { Title, Paragraph, Text } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollToSection } = useScrollToSection();

  return (
    <div className="snap-container">
      {/* Header fijo */}
      <Header className="bg-fountain-blue-800 shadow-lg border-b border-fountain-blue-700 px-6 fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Avatar 
              size={40} 
              style={{ backgroundColor: '#2da3ad' }}
              icon={<BookOutlined />}
            />
            <Typography.Title 
              level={3} 
              className="ml-3 mb-0 text-white cursor-pointer"
              onClick={() => navigate('/')}
            >
              CMPC-Inventario
            </Typography.Title>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* Enlaces de navegación */}
            {LANDING_DATA.menuItems.map(item => (
              <Button 
                key={item.key}
                type="text" 
                icon={item.icon}
                className="text-white hover:text-fountain-blue-200 hover:bg-fountain-blue-700"
                onClick={() => scrollToSection(item.key)}
              >
                {item.label}
              </Button>
            ))}
            
            <Button 
              type="primary" 
              icon={<LoginOutlined />} 
              size="large"
              onClick={() => navigate('/login')}
              style={{ backgroundColor: '#2da3ad', borderColor: '#2da3ad' }}
              className="hover:bg-fountain-blue-500 hover:border-fountain-blue-500"
            >
              Acceder al Sistema
            </Button>
          </div>
        </div>
      </Header>

      {/* Contenido principal con snap scrolling */}
      <div className="pt-16">
        {/* Hero Section */}
        <section 
          id="inicio"
          className="snap-section bg-gradient-to-br from-fountain-blue-800 via-fountain-blue-700 to-fountain-blue-600"
          tabIndex={0}
          role="region"
          aria-label="Sección de inicio"
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Title level={1} className="text-6xl font-bold text-white mb-6">
              Sistema de{' '}
              <span className="text-fountain-blue-200">Inventario de Libros</span>
            </Title>
            <Paragraph className="text-xl text-fountain-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Gestiona eficientemente el inventario de libros de CMPC con control de stock en tiempo real, 
              seguimiento de movimientos, exportación a Excel y reportes detallados en una plataforma moderna, 
              segura y fácil de usar.
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#2da3ad', borderColor: '#2da3ad' }}
                className="hover:bg-fountain-blue-500 hover:border-fountain-blue-500 shadow-lg"
              >
                Acceder al Sistema
              </Button>
              <Button 
                size="large" 
                icon={<BookOutlined />}
                onClick={() => scrollToSection('sistema')}
                className="border-white text-white hover:bg-white hover:text-fountain-blue-700 shadow-lg"
              >
                Ver Características
              </Button>
            </Space>
          </div>
        </section>

        {/* Features Section */}
        <section 
          id="sistema"
          className="snap-section bg-gradient-to-b from-white to-fountain-blue-50"
          tabIndex={0}
          role="region"
          aria-label="Sección del sistema"
        >
          <div className="max-w-7xl mx-auto px-6">
            <Title level={2} className="text-center mb-16 text-fountain-blue-800">
              ¿Por qué usar CMPC-Inventario?
            </Title>
            
            <Row gutter={[32, 32]} justify="center">
              {LANDING_DATA.features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <FeatureCard 
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </Col>
              ))}
            </Row>
            
            <div className="text-center mt-12">
              <Button 
                type="primary" 
                size="large" 
                icon={<LoginOutlined />}
                onClick={() => scrollToSection('contacto')}
                style={{ backgroundColor: '#288592', borderColor: '#288592' }}
                className="hover:bg-fountain-blue-700 hover:border-fountain-blue-700 shadow-lg"
              >
                Solicitar Acceso
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          id="contacto"
          className="snap-section bg-gradient-to-r from-fountain-blue-700 to-fountain-blue-600"
          tabIndex={0}
          role="region"
          aria-label="Sección de contacto"
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Title level={2} className="text-white mb-6">
              ¿Listo para optimizar tu inventario?
            </Title>
            <Paragraph className="text-xl text-fountain-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Accede al sistema de inventario de libros de CMPC y mejora la gestión de tu biblioteca con 
              herramientas profesionales de control de stock, exportación a Excel y reportes avanzados.
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                icon={<LoginOutlined />}
                style={{ backgroundColor: 'white', color: '#288592' }}
                onClick={() => navigate('/login')}
                className="hover:bg-fountain-blue-50 shadow-lg"
              >
                Acceder al Sistema
              </Button>
              <Button 
                size="large" 
                icon={<BookOutlined />}
                style={{ borderColor: 'white', color: 'white' }}
                onClick={() => navigate('/register')}
                className="hover:bg-white hover:text-fountain-blue-700 shadow-lg"
              >
                Crear Cuenta
              </Button>
            </Space>
            
            <div className="mt-12">
              <Button 
                type="text" 
                icon={<BookOutlined />}
                onClick={() => scrollToSection('inicio')}
                className="text-fountain-blue-200 hover:text-white"
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="snap-section bg-fountain-blue-950 text-white" tabIndex={0} role="region" aria-label="Pie de página">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Title level={3} className="text-white mb-4">
              CMPC-Inventario
            </Title>
            <Paragraph className="text-fountain-blue-200 mb-6">
              Sistema profesional de gestión de inventario de libros para CMPC con exportación a Excel, 
              control de stock y auditoría completa.
            </Paragraph>
            <Space size="large" className="mb-6">
              <Button type="link" className="text-fountain-blue-200 hover:text-white">
                Política de Privacidad
              </Button>
              <Button type="link" className="text-fountain-blue-200 hover:text-white">
                Términos de Uso
              </Button>
              <Button type="link" className="text-fountain-blue-200 hover:text-white">
                Soporte Técnico
              </Button>
              <Button 
                type="link" 
                className="text-fountain-blue-200 hover:text-white"
                onClick={() => scrollToSection('inicio')}
              >
                Volver al Inicio
              </Button>
            </Space>
            <Divider className="border-fountain-blue-800" />
            <Text className="text-fountain-blue-300">
              © 2024 CMPC-Inventario. Sistema interno de gestión de inventario.
            </Text>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 