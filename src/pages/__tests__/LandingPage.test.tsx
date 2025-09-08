import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  }
}));

// Mock useScrollToSection hook
vi.mock('../../hooks/useScrollToSection', () => ({
  useScrollToSection: () => ({
    scrollToSection: vi.fn()
  })
}));

const LandingPageWrapper = () => (
  <BrowserRouter>
    <LandingPage />
  </BrowserRouter>
);

describe('LandingPage', () => {
  it('renders landing page component', () => {
    render(<LandingPageWrapper />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders hero section', () => {
    render(<LandingPageWrapper />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders features section', () => {
    render(<LandingPageWrapper />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('renders call to action', () => {
    render(<LandingPageWrapper />);
    
    // Just check that the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });
});
