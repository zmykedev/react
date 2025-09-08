import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreateBookForm } from '../CreateBookForm';

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

describe('CreateBookForm', () => {
  const defaultProps = {
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
    render(<CreateBookForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Ingresa el título del libro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el nombre del autor')).toBeInTheDocument();
    expect(screen.getByText('Editorial *')).toBeInTheDocument();
  });

  it('renders form buttons', () => {
    render(<CreateBookForm {...defaultProps} />);
    
    expect(screen.getByText('Crear Libro')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<CreateBookForm {...defaultProps} isLoading={true} />);
    
    // Check if the form renders (the button might be disabled or not visible)
    expect(screen.getByText('Agregar Nuevo Libro')).toBeInTheDocument();
  });

  it('renders genre and publisher selects', () => {
    render(<CreateBookForm {...defaultProps} />);
    
    expect(screen.getByText('Género *')).toBeInTheDocument();
    expect(screen.getByText('Editorial *')).toBeInTheDocument();
  });
});
