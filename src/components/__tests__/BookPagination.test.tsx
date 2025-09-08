import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookPagination } from '../BookPagination';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('BookPagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: vi.fn(),
    onItemsPerPageChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination controls when there are multiple pages', () => {
    render(<BookPagination {...defaultProps} />);
    
    expect(screen.getByText(/Mostrando 1 a 10 de 50 libros/)).toBeInTheDocument();
    expect(screen.getByText('Por página:')).toBeInTheDocument();
  });

  it('does not render when there are no items', () => {
    const { container } = render(<BookPagination {...defaultProps} totalItems={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows simple count for small datasets', () => {
    render(<BookPagination {...defaultProps} totalItems={5} totalPages={1} itemsPerPage={10} />);
    
    expect(screen.getByText('5 libros encontrados')).toBeInTheDocument();
  });

  it('shows singular form for single item', () => {
    render(<BookPagination {...defaultProps} totalItems={1} totalPages={1} itemsPerPage={10} />);
    
    expect(screen.getByText('1 libro encontrado')).toBeInTheDocument();
  });
});