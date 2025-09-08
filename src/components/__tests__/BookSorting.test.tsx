import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookSorting } from '../BookSorting';
import type { BookSort } from '../../types/book';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('BookSorting', () => {
  const defaultSort: BookSort = {
    field: 'title',
    direction: 'asc'
  };

  const defaultProps = {
    sort: defaultSort,
    onSortChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sorting controls', () => {
    render(<BookSorting {...defaultProps} />);
    
    expect(screen.getByText('Ordenar por:')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Asc')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('shows correct initial values', () => {
    const customSort: BookSort = {
      field: 'price',
      direction: 'desc'
    };
    
    render(<BookSorting {...defaultProps} sort={customSort} />);
    
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});