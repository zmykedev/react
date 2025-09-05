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
    
    return token ? {
      'Authorization': `Bearer ${token}`,
    } : {};
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
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

    const response = await fetch(API_ENDPOINTS.BOOKS.SEARCH, {
      method: 'POST', // Cambiar a POST para enviar JSON
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    const responseData = await this.handleResponse<any>(response);
    
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
    
    return this.handleResponse<Book>(response);
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
}
