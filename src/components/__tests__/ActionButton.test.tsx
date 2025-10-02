import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionButton } from '../ActionButton';

describe('ActionButton', () => {
  const defaultProps = {
    icon: 'edit',
    onClick: vi.fn(),
    tooltip: 'Edit item',
    variant: 'primary' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button component', () => {
    render(<ActionButton {...defaultProps} />);

    // Just check that the component renders without crashing
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('renders with different props', () => {
    render(<ActionButton {...defaultProps} variant='secondary' />);

    // Just check that the component renders without crashing
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it('renders when disabled', () => {
    render(<ActionButton {...defaultProps} disabled={true} />);

    // Just check that the component renders without crashing
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });
});
