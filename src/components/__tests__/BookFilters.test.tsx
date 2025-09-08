import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookFilters } from '../BookFilters';
import type { BookFilters as BookFiltersType } from '../../types/book';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

// Mock usehooks-ts
vi.mock('usehooks-ts', () => ({
  useDebounceValue: vi.fn((value: any) => [value])
}));

describe('BookFilters', () => {
  const mockOnFiltersChange = vi.fn();
  const defaultProps = {
    filters: {} as BookFiltersType,
    onFiltersChange: mockOnFiltersChange,
    genres: ['Ficción', 'No Ficción', 'Ciencia'],
    publishers: ['Editorial A', 'Editorial B', 'Editorial C']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter controls', () => {
    render(<BookFilters {...defaultProps} />);
    
    expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por título...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filtrar por autor')).toBeInTheDocument();
    expect(screen.getByText('Género')).toBeInTheDocument();
    expect(screen.getByText('Editorial')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
  });

  it('shows clear filters button', () => {
    render(<BookFilters {...defaultProps} />);
    
    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
  });

  it('renders with empty genres and publishers', () => {
    render(<BookFilters {...defaultProps} genres={[]} publishers={[]} />);
    
    expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument();
  });
});