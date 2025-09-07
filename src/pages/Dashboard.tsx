import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Typography,
  Modal,
  message,
  Empty,
  Divider,
} from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SafetyOutlined,
  BugOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { auditLogService } from '../services/auditLogService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface AuditLog {
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  request_data: any;
  response_data: any;
  status: string;
  level: string;
  ip_address: string;
  user_agent: string;
  endpoint: string;
  http_method: string;
  response_time_ms: number;
  error_message: string | null;
  metadata: any;
}

interface AuditLogStats {
  totalLogs: number;
  logsByAction: Array<{ action: string; count: number }>;
  logsByStatus: Array<{ status: string; count: number }>;
  logsByLevel: Array<{ level: string; count: number }>;
  recentActivity: Array<AuditLog>;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    author: '',
    publisher: '',
    genre: '',
    start_date: '',
    end_date: '',
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  useEffect(() => {
  
  }, [logs, total]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await auditLogService.getStats();
      if (response.status === true && response.data?.status === 'success') {
        setStats(response.data.data);
      } else {
        // Generar estadísticas básicas a partir de los logs si no hay stats
        if (logs.length > 0) {
          generateStatsFromLogs();
        }
      }
    } catch (error) {
      message.error('Error al cargar estadísticas');
     
      // Generar estadísticas básicas a partir de los logs si hay error
      if (logs.length > 0) {
        generateStatsFromLogs();
      }
    } finally {
      setLoading(false);
    }
  };

  const generateStatsFromLogs = () => {
    if (logs.length === 0) return;

    const totalLogs = logs.length;
    const logsByAction = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const logsByStatus = logs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const logsByLevel = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const recentActivity = logs.slice(0, 10);

    const statsData: AuditLogStats = {
      totalLogs,
      logsByAction: Object.entries(logsByAction).map(([action, count]) => ({ action, count })),
      logsByStatus: Object.entries(logsByStatus).map(([status, count]) => ({ status, count })),
      logsByLevel: Object.entries(logsByLevel).map(([level, count]) => ({ level, count })),
      recentActivity,
    };

    setStats(statsData);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await auditLogService.getInventoryLogs({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
      if (response.status === true && response.data?.status === 'success') {
        const logsData = response.data.data.logs;
        const totalData = response.data.data.total;
        

        
        if (Array.isArray(logsData)) {
          setLogs(logsData);
          setTotal(totalData);
     
        } else {
          console.error('Logs data is not an array:', logsData);
          message.error('Formato de datos incorrecto');
        }
      } else {
        message.error('Error en la respuesta del servicio');
      }
    } catch (error) {
      message.error('Error al cargar logs de auditoría');
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      action: '',
      author: '',
      publisher: '',
      genre: '',
      start_date: '',
      end_date: '',
    });
    setCurrentPage(1);
    fetchLogs();
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      await auditLogService.exportInventoryLogs(filters);
      message.success('Exportación de inventario completada');
    } catch (error) {
      message.error('Error al exportar logs de inventario');
      console.error('Error exporting inventory logs:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAllLogs = async () => {
    try {
      setDeleteLoading(true);
      const response = await auditLogService.deleteAllLogs();
      if (response.status === true) {
        message.success('Todos los logs han sido eliminados exitosamente');
        setLogs([]);
        setTotal(0);
        setStats(null);
        setDeleteConfirmVisible(false);
      } else {
        message.error('Error al eliminar logs');
      }
    } catch (error) {
      console.error('Error deleting all logs:', error);
      message.error('Error al eliminar todos los logs');
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    setDeleteConfirmVisible(true);
  };

  const showLogDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setLogDetailVisible(true);
  };

  // Función para extraer información del libro desde metadata
  const getBookInfo = (record: AuditLog) => {
    if (!record.metadata) {
      return {
        title: '',
        author: '',
        publisher: '',
        genre: '',
        stock: '',
        price: '',
        description: '',
      };
    }
    return {
      title: record.metadata.title || '',
      author: record.metadata.author || '',
      publisher: record.metadata.publisher || '',
      genre: record.metadata.genre || '',
      stock: record.metadata.stock || '',
      price: record.metadata.price || '',
      description: record.metadata.description || '',
    };
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      INVENTORY_ADDED: 'green',
      INVENTORY_UPDATED: 'orange',
      INVENTORY_REMOVED: 'red',
      INVENTORY_VIEWED: 'blue',
      INVENTORY_SEARCHED: 'cyan',
      CREATE: 'green',
      READ: 'blue',
      UPDATE: 'orange',
      DELETE: 'red',
      LOGIN: 'cyan',
      LOGOUT: 'purple',
      EXPORT: 'geekblue',
      SEARCH: 'lime',
    };
    return colors[action] || 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'SUCCESS' ? 'success' : status === 'FAILURE' ? 'error' : 'warning';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      INFO: 'blue',
      WARNING: 'orange',
      ERROR: 'red',
      DEBUG: 'purple',
    };
    return colors[level] || 'default';
  };

  const columns = [
    {
      title: 'Operación',
      key: 'operation',
      width: 150,
      render: (_: any, record: AuditLog) => (
        <div>
          <Tag color={getActionColor(record.action)} className="mb-1">
            {record.action}
          </Tag>
          <div className="text-xs text-gray-500">
            {record.user_name || 'Sistema'}
          </div>
        </div>
      ),
    },
    {
      title: 'Libro',
      key: 'book_title',
      width: 180,
      render: (_: any, record: AuditLog) => {
        const bookInfo = getBookInfo(record);
        const hasBookData = bookInfo.title || bookInfo.author || bookInfo.publisher;
        if (!hasBookData) {
          return <div className="text-center">-</div>;
        }
        return bookInfo.title ? (
          <Tag color="green" className="text-xs" title={bookInfo.title}>
            {bookInfo.title}
          </Tag>
        ) : (
          <Tag color="default" className="text-xs">Sin título</Tag>
        );
      },
    },
    {
      title: 'Autor',
      key: 'author',
      width: 120,
      render: (_: any, record: AuditLog) => {
        const bookInfo = getBookInfo(record);
        const hasBookData = bookInfo.title || bookInfo.author || bookInfo.publisher;
        if (!hasBookData) {
          return <div className="text-center">-</div>;
        }
        return bookInfo.author ? (
          <Tag color="blue" className="text-xs" title={bookInfo.author}>
            {bookInfo.author}
          </Tag>
        ) : (
          <Tag color="default" className="text-xs">Sin autor</Tag>
        );
      },
    },
    {
      title: 'Editorial',
      key: 'publisher',
      width: 150,
      render: (_: any, record: AuditLog) => {
        const bookInfo = getBookInfo(record);
        const hasBookData = bookInfo.title || bookInfo.author || bookInfo.publisher;
        if (!hasBookData) {
          return <div className="text-center">-</div>;
        }
        return bookInfo.publisher ? (
          <Tag color="purple" className="text-xs" title={bookInfo.publisher}>
            {bookInfo.publisher}
          </Tag>
        ) : (
          <Tag color="default" className="text-xs">Sin editorial</Tag>
        );
      },
    },
    {
      title: 'Género',
      key: 'genre',
      width: 100,
      render: (_: any, record: AuditLog) => {
        const bookInfo = getBookInfo(record);
        const hasBookData = bookInfo.title || bookInfo.author || bookInfo.publisher;
        if (!hasBookData) {
          return <div className="text-center">-</div>;
        }
        return bookInfo.genre ? (
          <Tag color="orange" className="text-xs" title={bookInfo.genre}>
            {bookInfo.genre}
          </Tag>
        ) : (
          <Tag color="default" className="text-xs">Sin género</Tag>
        );
      },
    },
    {
      title: 'Acción',
      key: 'action_description',
      width: 300,
      render: (_: any, record: AuditLog) => {
        const bookInfo = getBookInfo(record);
        const hasBookData = bookInfo.title || bookInfo.author || bookInfo.publisher;
        
        // Mostrar información relevante según el tipo de acción
        let actionInfo = '';
        let actionColor = 'default';
        
        switch (record.action) {
          case 'INVENTORY_ADDED':
            actionInfo = hasBookData && bookInfo.title 
              ? `📚 Libro "${bookInfo.title}" agregado al inventario`
              : '📚 Nuevo libro agregado al inventario';
            actionColor = 'green';
            break;
          case 'INVENTORY_UPDATED':
            actionInfo = hasBookData && bookInfo.title 
              ? `📝 Libro "${bookInfo.title}" actualizado`
              : '📝 Libro actualizado en el inventario';
            actionColor = 'orange';
            break;
          case 'INVENTORY_REMOVED':
            actionInfo = hasBookData && bookInfo.title 
              ? `🗑️ Libro "${bookInfo.title}" eliminado del inventario`
              : '🗑️ Libro eliminado del inventario';
            actionColor = 'red';
            break;
          case 'INVENTORY_VIEWED':
            actionInfo = hasBookData && bookInfo.title 
              ? `👁️ Libro "${bookInfo.title}" visualizado`
              : '👁️ Consulta de inventario realizada';
            actionColor = 'blue';
            break;
          case 'INVENTORY_SEARCHED':
            actionInfo = '🔍 Búsqueda en inventario realizada';
            actionColor = 'cyan';
            break;
          default:
            actionInfo = record.description || 'Acción realizada';
            actionColor = 'default';
        }
        
        return (
          <Tag 
            color={actionColor} 
            className="text-xs max-w-full" 
            title={actionInfo}
            style={{ 
              maxWidth: '100%', 
              whiteSpace: 'normal', 
              height: 'auto', 
              lineHeight: '1.2', 
              padding: '2px 8px' 
            }}
          >
            {actionInfo}
          </Tag>
        );
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Fecha y Hora',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es }),
    },
    {
      title: 'Tiempo',
      dataIndex: 'response_time_ms',
      key: 'response_time_ms',
      width: 80,
      render: (time: number) => `${time}ms`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 80,
      render: (_: any, record: AuditLog) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => showLogDetail(record)}
          size="small"
        />
      ),
    },
  ];

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} de ${total} registros`,
    onChange: (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Title level={2} className="mb-2">
              <BarChartOutlined className="mr-2" />
              Dashboard de Auditoría
            </Title>
            <Text type="secondary">
              Monitoreo y análisis de todas las operaciones del sistema
            </Text>
          </div>

        

          {/* Gráficos de distribución */}
         

          {/* Filtros - Diseño UX Optimizado */}
          <Card 
            className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm" 
          >
            <div className="px-4 py-3">
              <Typography.Title level={5} className="text-center mb-4 text-blue-600 dark:text-blue-400 font-semibold">
                🔍 Filtros de Búsqueda
              </Typography.Title>
            </div>
            
            {/* Primera fila - Búsqueda principal y Acción */}
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={12} md={8}>
                <div style={{ position: 'relative' }}>
                  <Input
                    placeholder="🔍 Buscar en todos los campos..."
                    prefix={<SearchOutlined className="text-blue-600 dark:text-blue-400" />}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onPressEnter={handleSearch}
                    size="large"
                    className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="⚡ Seleccionar acción"
                  allowClear
                  value={filters.action}
                  onChange={(value) => handleFilterChange('action', value)}
                  size="large"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <Option value="INVENTORY_ADDED">📚 Agregado</Option>
                  <Option value="INVENTORY_UPDATED">📝 Actualizado</Option>
                  <Option value="INVENTORY_REMOVED">🗑️ Eliminado</Option>
                  <Option value="INVENTORY_VIEWED">👁️ Visualizado</Option>
                  <Option value="INVENTORY_SEARCHED">🔍 Búsqueda</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Space wrap size="small" style={{ width: '100%', justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={handleSearch}
                    size="large"
                    className="rounded-md font-medium h-10 px-6 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                  >
                    Filtrar
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleReset}
                    size="large"
                    className="rounded-md font-medium h-10 px-5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  >
                    Limpiar
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* Segunda fila - Filtros específicos del libro */}
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={8} md={8}>
                <Input
                  placeholder="👤 Autor del libro"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  onPressEnter={handleSearch}
                  size="large"
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Input
                  placeholder="🏢 Editorial"
                  value={filters.publisher}
                  onChange={(e) => handleFilterChange('publisher', e.target.value)}
                  onPressEnter={handleSearch}
                  size="large"
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </Col>
              <Col xs={24} sm={8} md={8}>
                <Input
                  placeholder="📖 Género"
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  onPressEnter={handleSearch}
                  size="large"
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </Col>
            </Row>

            {/* Tercera fila - Botones de acción */}
            <Row>
              <Col span={24}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <Button
                    success
                    icon={exportLoading ? <ReloadOutlined spin /> : <DownloadOutlined />}
                    onClick={handleExport}
                    loading={exportLoading}
                    size="large"
                    className="rounded-md font-medium h-10 px-6 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white"
                  >
                    {exportLoading ? 'Exportando...' : '📥 Exportar Datos'}
                  </Button>
                  <Button
                    danger
                    icon={deleteLoading ? <ReloadOutlined spin /> : <DeleteOutlined />}
                    onClick={showDeleteConfirm}
                    loading={deleteLoading}
                    size="large"
                    className="rounded-md font-medium h-10 px-6 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
                  >
                    {deleteLoading ? 'Eliminando...' : '🗑️ Eliminar Todos'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Tabla de Logs */}
          <Card>
            <Table
              columns={columns}
              dataSource={logs}
              rowKey="id"
              pagination={pagination}
              loading={loading}
              locale={{
                emptyText: <Empty description="No hay logs de auditoría" />,
              }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </div>

        {/* Modal de Detalle del Log */}
        <Modal
          title="Detalle del Log de Auditoría"
          open={logDetailVisible}
          onCancel={() => setLogDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setLogDetailVisible(false)}>
              Cerrar
            </Button>,
          ]}
          width={800}
        >
          {selectedLog && (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>ID:</Text>
                  <br />
                  <Text>{selectedLog.id}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Usuario:</Text>
                  <br />
                  <Text>{selectedLog.user_name || 'Sistema'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Acción:</Text>
                  <br />
                  <Tag color={getActionColor(selectedLog.action)}>
                    {selectedLog.action}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Entidad:</Text>
                  <br />
                  <Text>{selectedLog.entity_type || 'N/A'}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Descripción:</Text>
                  <br />
                  <Text>{selectedLog.description}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Estado:</Text>
                  <br />
                  <Tag color={getStatusColor(selectedLog.status)}>
                    {selectedLog.status}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Nivel:</Text>
                  <br />
                  <Tag color={getLevelColor(selectedLog.level)}>
                    {selectedLog.level}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>IP:</Text>
                  <br />
                  <Text code>{selectedLog.ip_address}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Endpoint:</Text>
                  <br />
                  <Text code>{selectedLog.endpoint}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Método HTTP:</Text>
                  <br />
                  <Text code>{selectedLog.http_method}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Tiempo Respuesta:</Text>
                  <br />
                  <Text>{selectedLog.response_time_ms}ms</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Fecha:</Text>
                  <br />
                  <Text>
                    {format(new Date(selectedLog.created_at), 'dd/MM/yyyy HH:mm:ss', {
                      locale: es,
                    })}
                  </Text>
                </Col>
                {selectedLog.error_message && (
                  <Col span={24}>
                    <Divider />
                    <Text strong type="danger">Mensaje de Error:</Text>
                    <br />
                    <Text type="danger">{selectedLog.error_message}</Text>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </Modal>

        {/* Modal de Confirmación para Eliminar Todos los Logs */}
        <Modal
          title={
            <div className="flex items-center">
              <DeleteOutlined className="text-red-500 mr-2" />
              <span>Confirmar Eliminación</span>
            </div>
          }
          open={deleteConfirmVisible}
          onCancel={() => setDeleteConfirmVisible(false)}
          footer={[
            <Button 
              key="cancel" 
              onClick={() => setDeleteConfirmVisible(false)}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>,
            <Button
              key="delete"
              danger
              icon={deleteLoading ? <ReloadOutlined spin /> : <DeleteOutlined />}
              onClick={handleDeleteAllLogs}
              loading={deleteLoading}
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar Todos'}
            </Button>,
          ]}
          width={500}
        >
          <div className="text-center py-4">
            <div className="mb-4">
              <SafetyOutlined className="text-6xl text-red-500 mb-4" />
            </div>
            <Title level={4} className="text-red-600 mb-2">
              ⚠️ Advertencia
            </Title>
            <Text className="text-lg mb-4 block">
              ¿Estás seguro de que deseas eliminar <strong>TODOS</strong> los logs de auditoría?
            </Text>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <Text type="danger" className="block mb-2">
                <strong>Esta acción es irreversible</strong>
              </Text>
              <Text type="secondary" className="text-sm">
                Se eliminarán permanentemente todos los registros de auditoría del sistema. 
                Esta operación no se puede deshacer.
              </Text>
            </div>
            <Text className="text-sm text-gray-500">
              Total de logs a eliminar: <strong>{total}</strong>
            </Text>
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Dashboard;
