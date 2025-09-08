import { API_ENDPOINTS } from '../config/api';
import useStore from '../store';
import type { 
  Book, 
  BookFormData, 
  BookFilters, 
  BookSort, 
  PaginationParams, 
  BookListResponse 
} from '../types/book';

export class BookService {
  private static getAuthHeaders(): HeadersInit {
    const token = useStore.getState().getAccessToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const defaultOptions: RequestInit = {
      mode: 'cors',
      credentials: 'include',
      headers: this.getAuthHeaders(),
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    return this.handleResponse<T>(response);
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle specific 498 status code by logging out
      if (response.status === 498) {
        console.warn('🔒 Status 498 detected, logging out...', {
          status: response.status,
          url: response.url
        });
        
        // Clear session and redirect to login
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

  static async getBooks(
    filters: BookFilters = {},
    sort: BookSort = { field: 'title', direction: 'asc' },
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<BookListResponse> {
    // Enviar filtros, ordenamiento y paginación como JSON en el body
    const requestData = {
      query: {
        ...filters,
        sortBy: sort.field,
        sortDir: sort.direction,
        page: pagination.page,
        limit: pagination.limit
      }
    };

    const responseData = await this.makeRequest<any>(API_ENDPOINTS.BOOKS.SEARCH, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
    
    // Extraer el campo 'data' de la respuesta envuelta por ResponseInterceptor
    const booksData = responseData.data || responseData;
    
    return booksData;
  }

  static async getBookById(id: string): Promise<Book> {
    const response = await fetch(`${API_ENDPOINTS.BOOKS.GET_BY_ID}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Book>(response);
  }

  static async createBook(bookData: BookFormData): Promise<Book> {
    // Preparar los datos para JSON
    const jsonData = { ...bookData };
    
    // Convertir price a number si es necesario
    if (jsonData.price !== undefined) {
      jsonData.price = Number(jsonData.price);
    }

    const response = await fetch(API_ENDPOINTS.BOOKS.CREATE, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });
    
    const responseData = await this.handleResponse<any>(response);
    
    // Extract the book data from the response wrapper
    const book = responseData.data || responseData;
    
    return book;
  }

  static async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    // Preparar los datos para JSON
    const jsonData = { ...bookData };
    
    // Convertir price a number si es necesario
    if (jsonData.price !== undefined) {
      jsonData.price = Number(jsonData.price);
    }

    const response = await fetch(`${API_ENDPOINTS.BOOKS.UPDATE}/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });
    
    return this.handleResponse<Book>(response);
  }

  static async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.BOOKS.DELETE}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  static async getGenres(): Promise<string[]> {
    const headers = this.getAuthHeaders();
    
    const response = await fetch(API_ENDPOINTS.BOOKS.GET_GENRES, {
      headers,
    });
    
    const responseData = await this.handleResponse<any>(response);
    
    // Extraer el campo 'data' de la respuesta envuelta por ResponseInterceptor
    const genres = responseData.data || [];
    
    return Array.isArray(genres) ? genres : [];
  }

  static async getPublishers(): Promise<string[]> {
    const headers = this.getAuthHeaders();
    
    const response = await fetch(API_ENDPOINTS.BOOKS.GET_PUBLISHERS, {
      headers,
    });
    
    const responseData = await this.handleResponse<any>(response);
    
    // Extraer el campo 'data' de la respuesta envuelta por ResponseInterceptor
    const publishers = responseData.data || [];
    
    return Array.isArray(publishers) ? publishers : [];
  }


  static async uploadImageOnly(imageFile: File): Promise<{ success: boolean; message: string; imageUrl: string; originalName: string; size: number; mimeType: string }> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile); // 👈 Cambiar a 'file' según documentación de NestJS

      const token = useStore.getState().getAccessToken();
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // NO agregar Content-Type para FormData - el browser lo maneja automáticamente

      const response = await fetch(API_ENDPOINTS.BOOKS.UPLOAD_IMAGE_ONLY, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const responseData = await this.handleResponse<any>(response);
      
      // Extract the data from the response wrapper
      const data = responseData.data || responseData;
      
      return data;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error?.message || 'Error al subir la imagen');
    }
  }



  static async uploadImage(imageFile: File, folder?: string): Promise<{ url: string; originalName: string; size: number; mimeType: string }> {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    if (folder) {
      formData.append('folder', folder);
    }

    const token = useStore.getState().getAccessToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // NO agregar Content-Type para FormData - el browser lo maneja automáticamente

    const response = await fetch(API_ENDPOINTS.STORAGE.UPLOAD, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return this.handleResponse<{ url: string; originalName: string; size: number; mimeType: string }>(response);
  }

  static async deleteImage(imageUrl: string): Promise<boolean> {
    const response = await fetch(`${API_ENDPOINTS.STORAGE.DELETE}?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<boolean>(response);
  }

  static async getImageMetadata(imageUrl: string): Promise<any> {
    const response = await fetch(`${API_ENDPOINTS.STORAGE.METADATA}?url=${encodeURIComponent(imageUrl)}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  /**
   * Exporta todos los libros a formato CSV
   * Incluye toda la información relevante de los libros
   */
  static async exportBooksToCSV(): Promise<void> {
    try {
      const token = useStore.getState().getAccessToken();
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📥 Iniciando exportación de libros a CSV...');

      const response = await fetch(API_ENDPOINTS.BOOKS.EXPORT_CSV, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Crear un blob con el contenido CSV
      const blob = await response.blob();
      
      // Crear un enlace temporal para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo con fecha y hora
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const filename = `libros-inventario-${dateStr}-${timeStr}.csv`;
      
      link.setAttribute('download', filename);
      
      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar la URL del objeto
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Exportación de libros completada:', filename);
    } catch (error: any) {
      console.error('❌ Error exporting books to CSV:', error);
      throw new Error(error?.message || 'Error al exportar libros a CSV');
    }
  }
}
