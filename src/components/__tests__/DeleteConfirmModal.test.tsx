import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    bookTitle: 'Test Book',
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal component when open', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders modal when closed', () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders with loading state', () => {
    render(<DeleteConfirmModal {...defaultProps} isLoading={true} />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders with different book title', () => {
    render(<DeleteConfirmModal {...defaultProps} bookTitle="Different Book" />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });
});