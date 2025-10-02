import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureCard } from '../FeatureCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('FeatureCard', () => {
  const defaultProps = {
    icon: 'book',
    title: 'Test Feature',
    description: 'This is a test feature description',
    delay: 0,
  };

  it('renders feature card with title and description', () => {
    render(<FeatureCard {...defaultProps} />);

    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('This is a test feature description')).toBeInTheDocument();
  });

  it('renders with different icon', () => {
    render(<FeatureCard {...defaultProps} icon='user' />);

    expect(screen.getByText('Test Feature')).toBeInTheDocument();
  });

  it('renders with different title', () => {
    render(<FeatureCard {...defaultProps} title='Different Title' />);

    expect(screen.getByText('Different Title')).toBeInTheDocument();
  });

  it('renders with different description', () => {
    render(<FeatureCard {...defaultProps} description='Different description' />);

    expect(screen.getByText('Different description')).toBeInTheDocument();
  });
});
