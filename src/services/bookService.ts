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

  static async uploadBookImage(imageFile: File, bookId: string): Promise<{ success: boolean; message: string; originalName: string; size: number; mimeType: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('bookId', bookId);

    const response = await fetch(API_ENDPOINTS.BOOKS.UPLOAD_IMAGE, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type header, let the browser set it with boundary for FormData
      },
      body: formData,
    });
    
    const responseData = await this.handleResponse<any>(response);
    
    // Extract the data from the response wrapper
    const data = responseData.data || responseData;
    
    return data;
  }

  static async uploadImage(imageFile: File, folder?: string): Promise<{ url: string; originalName: string; size: number; mimeType: string }> {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(API_ENDPOINTS.STORAGE.UPLOAD, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type header, let the browser set it with boundary for FormData
      },
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
}
