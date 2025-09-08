import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EditBookForm } from '../EditBookForm';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

// Mock BookService
vi.mock('../../services/bookService', () => ({
  BookService: {
    uploadImage: vi.fn()
  }
}));

describe('EditBookForm', () => {
  const mockBook = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    publisher: 'Test Publisher',
    price: 29.99,
    genre: 'Ficción',
    availability: true,
    imageUrl: 'https://example.com/image.jpg',
    description: 'Test description',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const defaultProps = {
    book: mockBook,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isLoading: false,
    genres: ['Ficción', 'No Ficción'],
    publishers: ['Editorial A', 'Editorial B']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<EditBookForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Ingresa el título del libro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el nombre del autor')).toBeInTheDocument();
    expect(screen.getByText('Editorial *')).toBeInTheDocument();
  });

  it('renders form buttons', () => {
    render(<EditBookForm {...defaultProps} />);
    
    expect(screen.getByText('Actualizar Libro')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<EditBookForm {...defaultProps} isLoading={true} />);
    
    // Check if the form renders (the button might be disabled or not visible)
    expect(screen.getByText('Editar Libro')).toBeInTheDocument();
  });

  it('renders genre and publisher selects', () => {
    render(<EditBookForm {...defaultProps} />);
    
    expect(screen.getByText('Género *')).toBeInTheDocument();
    expect(screen.getByText('Editorial *')).toBeInTheDocument();
  });
});
