import {
  HomeOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import type { LandingData, ThemeColors } from '../types/landing';

export const LANDING_DATA: LandingData = {
  menuItems: [
    { key: 'inicio', label: 'Inicio', icon: <HomeOutlined /> },
    { key: 'sistema', label: 'Sistema', icon: <SettingOutlined /> },
    { key: 'contacto', label: 'Contacto', icon: <QuestionCircleOutlined /> }
  ],

  features: [
    {
      icon: <BarChartOutlined style={{ fontSize: '32px' }} />,
      title: 'Control de Stock en Tiempo Real',
      description: 'Monitoreo instantáneo del inventario con alertas automáticas de stock bajo, seguimiento de movimientos y reportes detallados de entrada/salida de libros.'
    },
    {
      icon: <DatabaseOutlined style={{ fontSize: '32px' }} />,
      title: 'Gestión Centralizada y Segura',
      description: 'Administra todo el inventario desde una sola plataforma con acceso controlado por roles (ADMIN, LIBRARIAN, USER) y sistema de auditoría completo.'
    },
    {
      icon: <FileExcelOutlined style={{ fontSize: '32px' }} />,
      title: 'Exportación a Excel y Reportes',
      description: 'Genera reportes detallados del inventario, exporta datos filtrados a Excel (.xlsx) y analiza tendencias de movimientos para toma de decisiones informadas.'
    }
  ],

  heroContent: {
    title: 'Sistema de Inventario de Libros',
    titleHighlight: 'Inventario de Libros',
    description: 'Gestiona eficientemente el inventario de libros de CMPC con control de stock en tiempo real, seguimiento de movimientos, exportación a Excel y reportes detallados en una plataforma moderna, segura y fácil de usar.',
    primaryButton: {
      text: 'Acceder al Sistema',
      action: 'login'
    },
    secondaryButton: {
      text: 'Ver Características',
      action: 'scroll',
      target: 'sistema'
    }
  },

  ctaContent: {
    title: '¿Listo para optimizar tu inventario?',
    description: 'Accede al sistema de inventario de libros de CMPC y mejora la gestión de tu biblioteca con herramientas profesionales de control de stock, exportación a Excel y reportes avanzados.',
    primaryButton: {
      text: 'Acceder al Sistema',
      action: 'login'
    },
    secondaryButton: {
      text: 'Crear Cuenta',
      action: 'register'
    }
  },

  footerContent: {
    description: 'Sistema profesional de gestión de inventario de libros para CMPC con exportación a Excel, control de stock y auditoría completa.',
    links: [
      { text: 'Política de Privacidad', action: 'privacy' },
      { text: 'Términos de Uso', action: 'terms' },
      { text: 'Soporte Técnico', action: 'support' },
      { text: 'Volver al Inicio', action: 'scroll', target: 'inicio' }
    ]
  }
};

export const THEME_COLORS: ThemeColors = {
  primary: '#2da3ad',
  secondary: '#288592',
  accent: '#fountain-blue-600',
  background: {
    dark: '#fountain-blue-800',
    medium: '#fountain-blue-700',
    light: '#fountain-blue-600'
  },
  text: {
    white: '#ffffff',
    light: '#fountain-blue-100',
    medium: '#fountain-blue-200'
  }
};
