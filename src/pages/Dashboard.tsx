import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Typography,
  Tooltip,
  Modal,
  message,
  Spin,
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
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import { auditLogService } from '../services/auditLogService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
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
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    entity_type: '',
    status: '',
    level: '',
    start_date: '',
    end_date: '',
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      fetchStats();
    }
  }, [logs]);

  useEffect(() => {
    console.log('Current logs state:', logs);
    console.log('Current total state:', total);
  }, [logs, total]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await auditLogService.getStats();
      console.log('Stats response:', response);
      if (response.status === true && response.data?.status === 'success') {
        setStats(response.data.data);
      } else {
        console.log('Stats response not successful:', response);
        // Generar estadísticas básicas a partir de los logs si no hay stats
        if (logs.length > 0) {
          generateStatsFromLogs();
        }
      }
    } catch (error) {
      message.error('Error al cargar estadísticas');
      console.error('Error fetching stats:', error);
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
      const response = await auditLogService.getLogs({
        page: currentPage,
        limit: pageSize,
        ...filters,
      });
      console.log('Logs response:', response);
      if (response.status === true && response.data?.status === 'success') {
        const logsData = response.data.data.logs;
        const totalData = response.data.data.total;
        
        console.log('Raw logs data:', logsData);
        console.log('Raw total data:', totalData);
        
        if (Array.isArray(logsData)) {
          setLogs(logsData);
          setTotal(totalData);
          console.log('Logs set successfully:', logsData.length, 'logs');
          console.log('Total set successfully:', totalData);
        } else {
          console.error('Logs data is not an array:', logsData);
          message.error('Formato de datos incorrecto');
        }
      } else {
        console.log('Logs response not successful:', response);
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
      entity_type: '',
      status: '',
      level: '',
      start_date: '',
      end_date: '',
    });
    setCurrentPage(1);
    fetchLogs();
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      await auditLogService.exportLogs(filters);
      message.success('Exportación completada');
    } catch (error) {
      message.error('Error al exportar logs');
      console.error('Error exporting logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const showLogDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setLogDetailVisible(true);
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
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
      title: 'Usuario',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text: string | null) => text || 'Sistema',
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={getActionColor(action)}>{action}</Tag>
      ),
    },
    {
      title: 'Entidad',
      dataIndex: 'entity_type',
      key: 'entity_type',
      render: (text: string | null) => text || 'N/A',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || 'Sin descripción',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Nivel',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>{level}</Tag>
      ),
    },
    {
      title: 'Tiempo Respuesta',
      dataIndex: 'response_time_ms',
      key: 'response_time_ms',
      render: (time: number) => `${time}ms`,
    },
    {
      title: 'IP',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es }),
    },
    {
      title: 'Acciones',
      key: 'actions',
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

          {/* Estadísticas */}
          {stats && (
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total de Logs"
                    value={stats.totalLogs}
                    prefix={<SafetyOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Actividad Reciente"
                    value={stats.recentActivity.length}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Usuarios Activos"
                    value={stats.logsByAction.find(l => l.action === 'LOGIN')?.count || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Errores"
                    value={stats.logsByLevel.find(l => l.level === 'ERROR')?.count || 0}
                    prefix={<BugOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Gráficos de distribución */}
          {stats && (
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} lg={8}>
                <Card title="Distribución por Acción" size="small">
                  {stats.logsByAction.map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <Text>{item.action}</Text>
                        <Text strong>{item.count}</Text>
                      </div>
                      <Progress
                        percent={Math.round((item.count / stats.totalLogs) * 100)}
                        size="small"
                        strokeColor={getActionColor(item.action)}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Distribución por Estado" size="small">
                  {stats.logsByStatus.map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <Text>{item.status}</Text>
                        <Text strong>{item.count}</Text>
                      </div>
                      <Progress
                        percent={Math.round((item.count / stats.totalLogs) * 100)}
                        size="small"
                        strokeColor={getStatusColor(item.status)}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Distribución por Nivel" size="small">
                  {stats.logsByLevel.map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <Text>{item.level}</Text>
                        <Text strong>{item.count}</Text>
                      </div>
                      <Progress
                        percent={Math.round((item.count / stats.totalLogs) * 100)}
                        size="small"
                        strokeColor={getLevelColor(item.level)}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          )}

          {/* Filtros */}
          <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Buscar..."
                  prefix={<SearchOutlined />}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onPressEnter={handleSearch}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder="Acción"
                  allowClear
                  value={filters.action}
                  onChange={(value) => handleFilterChange('action', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="CREATE">Crear</Option>
                  <Option value="READ">Leer</Option>
                  <Option value="UPDATE">Actualizar</Option>
                  <Option value="DELETE">Eliminar</Option>
                  <Option value="LOGIN">Iniciar Sesión</Option>
                  <Option value="EXPORT">Exportar</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder="Entidad"
                  allowClear
                  value={filters.entity_type}
                  onChange={(value) => handleFilterChange('entity_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="Book">Libro</Option>
                  <Option value="User">Usuario</Option>
                  <Option value="Auth">Autenticación</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder="Estado"
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="SUCCESS">Éxito</Option>
                  <Option value="FAILURE">Fallo</Option>
                  <Option value="PENDING">Pendiente</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={handleSearch}
                  >
                    Filtrar
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Limpiar
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    loading={loading}
                  >
                    Exportar
                  </Button>
                </Space>
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
      </Content>
    </Layout>
  );
};

export default Dashboard;
