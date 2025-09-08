import { API_ENDPOINTS } from '../config/api';
import useStore from '../store';

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity_type?: string;
  status?: string;
  level?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface AuditLog {
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

export interface AuditLogResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogStats {
  totalLogs: number;
  logsByAction: Array<{ action: string; count: number }>;
  logsByStatus: Array<{ status: string; count: number }>;
  logsByLevel: Array<{ level: string; count: number }>;
  recentActivity: AuditLog[];
}

export interface InventoryFilterOptions {
  genres: string[];
  publishers: string[];
  authors: string[];
}

export interface ApiResponse<T> {
  status: boolean;
  data: {
    status: string;
    data: T;
    message: string;
  };
  message: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

class AuditLogService {
  private readonly baseUrl = `${API_ENDPOINTS.BOOKS.GET_ALL.replace('/books', '/audit-logs')}`;

  private static getAuthHeaders(): HeadersInit {
    const token = useStore.getState().getAccessToken();
    
    return token ? {
      'Authorization': `Bearer ${token}`,
    } : {};
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle specific 498 status code by logging out
      if (response.status === 498) {
        console.warn('🔒 Status 498 detected in audit service, logging out...', {
          status: response.status,
          url: response.url
        });
        
        // We need to import useStore here
        const { default: useStore } = await import('../store');
        const { logout } = useStore.getState();
        logout();
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  }

  async getLogs(filters: AuditLogFilters = {}): Promise<ApiResponse<AuditLogResponse>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<AuditLogResponse>>(response);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  async getInventoryLogs(filters: AuditLogFilters = {}): Promise<ApiResponse<AuditLogResponse>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/inventory?${params.toString()}`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      
      const result = await AuditLogService.handleResponse<ApiResponse<AuditLogResponse>>(response);
      return result;
    } catch (error) {
      console.error('Error fetching inventory logs:', error);
      throw error;
    }
  }

  async deleteAllLogs(): Promise<ApiResponse<number>> {
    try {
      const response = await fetch(`${this.baseUrl}/delete-all`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<number>>(response);
    } catch (error) {
      console.error('Error deleting all logs:', error);
      throw error;
    }
  }

  async getStats(): Promise<ApiResponse<AuditLogStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<AuditLogStats>>(response);
    } catch (error) {
      console.error('Error fetching audit log stats:', error);
      throw error;
    }
  }

  async getActions(): Promise<ApiResponse<{
    actions: string[];
    statuses: string[];
    levels: string[];
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/actions`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<{
        actions: string[];
        statuses: string[];
        levels: string[];
      }>>(response);
    } catch (error) {
      console.error('Error fetching audit log actions:', error);
      throw error;
    }
  }

  async exportLogs(filters: AuditLogFilters = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/export?${params.toString()}`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  }

  async exportInventoryLogs(filters: AuditLogFilters = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}/inventory/export?${params.toString()}`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-logs-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting inventory audit logs:', error);
      throw error;
    }
  }

  async cleanupOldLogs(days: number = 90): Promise<ApiResponse<{ deletedCount: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/cleanup?days=${days}`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<{ deletedCount: number }>>(response);
    } catch (error) {
      console.error('Error cleaning up old audit logs:', error);
      throw error;
    }
  }

  async getLogById(id: number): Promise<ApiResponse<AuditLog>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<AuditLog>>(response);
    } catch (error) {
      console.error('Error fetching audit log by ID:', error);
      throw error;
    }
  }

  async getInventoryFilterOptions(): Promise<ApiResponse<InventoryFilterOptions>> {
    try {
      const response = await fetch(`${this.baseUrl}/inventory/filter-options`, {
        mode: 'cors',
        credentials: 'include',
        headers: AuditLogService.getAuthHeaders(),
      });
      return await AuditLogService.handleResponse<ApiResponse<InventoryFilterOptions>>(response);
    } catch (error) {
      console.error('Error fetching inventory filter options:', error);
      throw error;
    }
  }
}

export const auditLogService = new AuditLogService();
