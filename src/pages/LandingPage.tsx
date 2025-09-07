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
  Divider,
  Card
} from 'antd';
import { 
  BookOutlined, 
  LoginOutlined, 
  SafetyOutlined,
  ThunderboltOutlined,
  StarOutlined
} from '@ant-design/icons';
import StackIcon from 'tech-stack-icons';
import { motion } from 'framer-motion';


import { LANDING_DATA } from '../data/landingData';
import { useScrollToSection } from '../hooks/useScrollToSection';
import { FeatureCard } from '../components/FeatureCard';
import './LandingPage.css';

const { Header } = Layout;
const { Title, Paragraph, Text } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollToSection } = useScrollToSection();

  return (
    <div className="snap-container">
      {/* Header fijo */}
      <Header className="bg-fountain-blue-800/95 backdrop-blur-md shadow-lg border-b border-fountain-blue-700 px-6 fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center h-full">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Avatar 
              size={40} 
              style={{ backgroundColor: '#2da3ad' }}
              icon={<BookOutlined />}
              className="shadow-lg"
            />
            <Typography.Title 
              level={3} 
              className="ml-3 mb-0 text-white cursor-pointer hover:text-fountain-blue-200 transition-colors duration-300"
              onClick={() => navigate('/')}
            >
              CMPC-Inventario
            </Typography.Title>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Enlaces de navegación */}
            {LANDING_DATA.menuItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Button 
                  type="text" 
                  icon={item.icon}
                  className="text-white hover:text-fountain-blue-200 hover:bg-fountain-blue-700/50 transition-all duration-300"
                  onClick={() => scrollToSection(item.key)}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Button 
                type="primary" 
                icon={<LoginOutlined />} 
                size="large"
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#2da3ad', borderColor: '#2da3ad' }}
                className="hover:bg-fountain-blue-500 hover:border-fountain-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Acceder al Sistema
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Header>

      {/* Contenido principal con snap scrolling */}
      <div className="pt-16">
        {/* Hero Section */}
        <section 
          id="inicio"
          className="snap-section bg-gradient-to-br from-fountain-blue-800 via-fountain-blue-700 to-fountain-blue-600 relative overflow-hidden"
          tabIndex={0}
          role="region"
          aria-label="Sección de inicio"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-fountain-blue-400/20 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-fountain-blue-300/15 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-fountain-blue-500/25 rounded-full blur-lg"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
  
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Title level={1} className="text-6xl md:text-7xl font-bold text-white mb-6">
                Sistema de{' '}
                <span className="gradient-text-tailwind">
                  Gestión de Inventarios
                </span>
              </Title>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Paragraph className="text-xl text-fountain-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Plataforma empresarial de gestión de inventarios con control de stock en tiempo real, 
                seguimiento de movimientos, exportación a Excel y reportes detallados. Desarrollada con 
                tecnologías modernas para máxima eficiencia y seguridad.
              </Paragraph>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='mb-[-30px] '
            >
              <Space size="large" className="mb-12">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                  style={{ 
                    backgroundColor: '#2da3ad', 
                    borderColor: '#2da3ad',
                    height: '50px',
                    paddingLeft: '30px',
                    paddingRight: '30px'
                  }}
                  className="btn-gradient hover:bg-fountain-blue-500 hover:border-fountain-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 glow"
                >
                  Acceder al Sistema
                </Button>
                <Button 
                  size="large" 
                  icon={<BookOutlined />}
                  onClick={() => scrollToSection('sistema')}
                  className="border-white text-white hover:bg-white hover:text-fountain-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ height: '50px', paddingLeft: '30px', paddingRight: '30px' }}
                >
                  Ver Características
                </Button>
              </Space>
            </motion.div>
            
            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1.4 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Row
                gutter={[24, 16]}
                justify="center"
                className="mt-16 flex flex-wrap items-center justify-center px-4 py-6"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
              >
                <Col xs={12} sm={8} md={6} lg={3}>
                  <Card className="bg-fountain-blue-700/30 border-fountain-blue-500/30 backdrop-blur-sm hover-lift floating-1 flex items-center justify-center p-4">
                    <div className="flex flex-col items-center justify-center">
                      <StackIcon name="typescript" className="w-10 h-10 text-fountain-blue-300 mb-2" />
                      <div className="text-fountain-blue-200 font-medium text-sm">TypeScript</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6} lg={3}>
                  <Card className="bg-fountain-blue-700/30 border-fountain-blue-500/30 backdrop-blur-sm hover-lift floating-2 flex items-center justify-center p-4">
                    <div className="flex flex-col items-center justify-center">
                      <StackIcon name="nestjs" className="w-10 h-10 text-fountain-blue-300 mb-2" />
                      <div className="text-fountain-blue-200 font-medium text-sm">NestJS</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6} lg={3}>
                  <Card className="bg-fountain-blue-700/30 border-fountain-blue-500/30 backdrop-blur-sm hover-lift floating-3 flex items-center justify-center p-4">
                    <div className="flex flex-col items-center justify-center">
                      <StackIcon name="react" className="w-10 h-10 text-fountain-blue-300 mb-2" />
                      <div className="text-fountain-blue-200 font-medium text-sm">React</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6} lg={3}>
                  <Card className="bg-fountain-blue-700/30 border-fountain-blue-500/30 backdrop-blur-sm hover-lift floating-4 flex items-center justify-center p-4">
                    <div className="flex flex-col items-center justify-center">
                      <StackIcon name="railway" className="w-10 h-10 text-fountain-blue-300 mb-2" />
                      <div className="text-fountain-blue-200 font-medium text-sm">Railway</div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6} lg={3}>
                  <Card className="bg-fountain-blue-700/30 border-fountain-blue-500/30 backdrop-blur-sm hover-lift floating-5 flex items-center justify-center p-4">
                    <div className="flex flex-col items-center justify-center">
                      <StackIcon name="gcloud" className="w-10 h-10 text-fountain-blue-300 mb-2" />
                      <div className="text-fountain-blue-200 font-medium text-sm">GCP</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          id="sistema"
          className="snap-section bg-gradient-to-b from-white to-fountain-blue-50 relative overflow-hidden"
          tabIndex={0}
          role="region"
          aria-label="Sección del sistema"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-fountain-blue-200 to-fountain-blue-300 transform rotate-12 scale-150"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            
            <Row gutter={[32, 32]} justify="center">
              {LANDING_DATA.features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <FeatureCard 
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>
            
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
             
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          id="contacto"
          className="snap-section bg-gradient-to-r from-fountain-blue-700 to-fountain-blue-600 relative overflow-hidden"
          tabIndex={0}
          role="region"
          aria-label="Sección de contacto"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-40 h-40 bg-fountain-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-fountain-blue-300/25 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fountain-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
         
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Title level={2} className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para{' '}
                <span className="gradient-text-tailwind">
                  optimizar tu inventario?
                </span>
              </Title>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Paragraph className="text-xl text-fountain-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Accede al sistema de gestión de inventarios y mejora la administración de tu empresa con 
                herramientas profesionales de control de stock, exportación a Excel y reportes avanzados.
              </Paragraph>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Space size="large" className="mb-12">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<LoginOutlined />}
                  style={{ 
                    backgroundColor: 'white', 
                    color: '#288592',
                    height: '50px',
                    paddingLeft: '30px',
                    paddingRight: '30px'
                  }}
                  onClick={() => navigate('/login')}
                  className="hover:bg-fountain-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Acceder al Sistema
                </Button>
                <Button 
                  size="large" 
                  icon={<BookOutlined />}
                  style={{ 
                    borderColor: 'white', 
                    color: 'white',
                    height: '50px',
                    paddingLeft: '30px',
                    paddingRight: '30px'
                  }}
                  onClick={() => navigate('/register')}
                  className="hover:bg-white hover:text-fountain-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Crear Cuenta
                </Button>
              </Space>
            </motion.div>
            
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-4">
                <Button 
                  type="text" 
                  icon={<BookOutlined />}
                  onClick={() => scrollToSection('inicio')}
                  className="text-fountain-blue-200 hover:text-white transition-colors duration-300"
                >
                  Volver al Inicio
                </Button>
                
                {/* Trust Indicators */}
                <div className="flex items-center gap-6 text-fountain-blue-200 text-sm">
                  <div className="flex items-center gap-2">
                    <SafetyOutlined />
                    <span>100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThunderboltOutlined />
                    <span>Acceso Rápido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarOutlined />
                    <span>5/5 Estrellas</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="snap-section bg-fountain-blue-950 text-white relative overflow-hidden" tabIndex={0} role="region" aria-label="Pie de página">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-fountain-blue-900 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-fountain-blue-600/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-6">
                <Avatar 
                  size={60} 
                  style={{ backgroundColor: '#2da3ad' }}
                  icon={<BookOutlined />}
                  className="mr-4"
                />
                <Title level={3} className="text-white mb-0">
                  CMPC-Inventario
                </Title>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Paragraph className="text-fountain-blue-200 mb-8 max-w-2xl mx-auto text-lg">
                Sistema profesional de gestión de inventarios desarrollado con tecnologías modernas para 
                optimizar la administración empresarial con máxima eficiencia y seguridad.
              </Paragraph>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Space size="large" className="mb-8">
                <Button 
                  type="link" 
                  className="text-fountain-blue-200 hover:text-white transition-colors duration-300"
                >
                  Política de Privacidad
                </Button>
                <Button 
                  type="link" 
                  className="text-fountain-blue-200 hover:text-white transition-colors duration-300"
                >
                  Términos de Uso
                </Button>
                <Button 
                  type="link" 
                  className="text-fountain-blue-200 hover:text-white transition-colors duration-300"
                >
                  Soporte Técnico
                </Button>
                <Button 
                  type="link" 
                  className="text-fountain-blue-200 hover:text-white transition-colors duration-300"
                  onClick={() => scrollToSection('inicio')}
                >
                  Volver al Inicio
                </Button>
              </Space>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Divider className="border-fountain-blue-800" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Text className="text-fountain-blue-300">
                  © 2024 CMPC-Inventario. Sistema profesional de gestión de inventarios.
                </Text>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-fountain-blue-300">
                    <SafetyOutlined />
                    <span>Desarrollado con ❤️ para empresas innovadoras</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage; 