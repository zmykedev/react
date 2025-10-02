import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookService } from '../bookService';
import type { BookFormData } from '../../types/book';

// Mock fetch
global.fetch = vi.fn();

// Mock useStore
const mockUseStore = {
  getAccessToken: vi.fn(),
  setAccessToken: vi.fn(),
  setRefreshToken: vi.fn(),
  clearTokens: vi.fn(),
};

vi.mock('../../store/authStore', () => ({
  useStore: {
    getState: () => mockUseStore,
  },
}));

describe('BookService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStore.getAccessToken.mockReturnValue('mock-token');
  });

  describe('getBooks', () => {
    it('should fetch books with default parameters', async () => {
      const mockResponse = {
        books: [
          {
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
            publisher: 'Test Publisher',
            price: 29.99,
            availability: true,
            genre: 'Fiction',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      });

      const result = await BookService.getBooks();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/search'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      expect(result).toEqual(mockResponse);
    });

    it('should fetch books with custom parameters', async () => {
      const mockResponse = {
        books: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      });

      const params = {
        page: 2,
        limit: 20,
        search: 'test',
        genre: 'Fiction',
        sort: { field: 'title', direction: 'asc' as const },
      };

      await BookService.getBooks(params);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/search'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );
    });

    it('should handle API errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal Server Error' }),
      });

      await expect(BookService.getBooks()).rejects.toThrow('Internal Server Error');
    });
  });

  describe('getBookById', () => {
    it('should fetch a single book by ID', async () => {
      const mockBook = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publisher: 'Test Publisher',
        price: 29.99,
        availability: true,
        genre: 'Fiction',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockBook }),
      });

      const result = await BookService.getBookById('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/1'),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      expect(result).toEqual({ data: mockBook });
    });

    it('should handle 404 errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Book not found' }),
      });

      await expect(BookService.getBookById('999')).rejects.toThrow('Book not found');
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const bookData: BookFormData = {
        title: 'New Book',
        author: 'New Author',
        publisher: 'New Publisher',
        price: 19.99,
        availability: true,
        genre: 'Non-Fiction',
        description: 'New book description',
      };

      const mockCreatedBook = {
        id: '2',
        ...bookData,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCreatedBook }),
      });

      const result = await BookService.createBook(bookData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(bookData),
        }),
      );

      expect(result).toEqual(mockCreatedBook);
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const bookData: BookFormData = {
        title: 'Updated Book',
        author: 'Updated Author',
        publisher: 'Updated Publisher',
        price: 24.99,
        availability: false,
        genre: 'Science Fiction',
        description: 'Updated description',
      };

      const mockUpdatedBook = {
        id: '1',
        ...bookData,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockUpdatedBook }),
      });

      const result = await BookService.updateBook('1', bookData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(bookData),
        }),
      );

      expect(result).toEqual({ data: mockUpdatedBook });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Book deleted successfully' }),
      });

      await BookService.deleteBook('1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/1'),
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );
    });
  });

  describe('exportBooksToCSV', () => {
    it('should export books as CSV', async () => {
      // Mock window.URL.createObjectURL and revokeObjectURL
      const mockCreateObjectURL = vi.fn(() => 'mock-url');
      const mockRevokeObjectURL = vi.fn();
      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: mockRevokeObjectURL,
        },
        writable: true,
      });

      const mockBlob = new Blob(['csv,data'], { type: 'text/csv' });
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      });

      await BookService.exportBooksToCSV();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/export/csv'),
        expect.objectContaining({
          method: 'GET',
          headers: {},
        }),
      );

      // The method doesn't return anything, it just downloads the file
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('getGenres', () => {
    it('should fetch available genres', async () => {
      const mockGenres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery'];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockGenres }),
      });

      const result = await BookService.getGenres();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/genres'),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      expect(result).toEqual(mockGenres);
    });
  });

  describe('getPublishers', () => {
    it('should fetch available publishers', async () => {
      const mockPublishers = ['Publisher A', 'Publisher B', 'Publisher C'];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPublishers }),
      });

      const result = await BookService.getPublishers();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/publishers'),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      expect(result).toEqual(mockPublishers);
    });
  });
});
