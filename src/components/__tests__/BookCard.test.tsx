import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookCard } from '../BookCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('BookCard', () => {
  const mockBook = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    publisher: 'Test Publisher',
    price: 29.99,
    stock: 10,
    description: 'Test description',
    imageUrl: 'test-image.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const defaultProps = {
    book: mockBook,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders book card component', () => {
    render(<BookCard {...defaultProps} />);
    
    // Just check that the component renders without crashing
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('renders with different book data', () => {
    const differentBook = { ...mockBook, title: 'Different Book' };
    render(<BookCard {...defaultProps} book={differentBook} />);
    
    expect(screen.getByText('Different Book')).toBeInTheDocument();
  });

  it('renders with all required props', () => {
    render(<BookCard {...defaultProps} />);
    
    // Check that the component renders with all props
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });
});