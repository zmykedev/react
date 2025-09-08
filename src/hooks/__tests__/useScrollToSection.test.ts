import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollToSection } from '../useScrollToSection';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

// Mock document.getElementById
Object.defineProperty(document, 'getElementById', {
  value: vi.fn(),
  writable: true
});

describe('useScrollToSection', () => {
  it('should return scrollToSection function', () => {
    const { result } = renderHook(() => useScrollToSection());
    
    expect(typeof result.current.scrollToSection).toBe('function');
  });

  it('should handle scrollToSection call', () => {
    const mockElement = {
      offsetTop: 100,
      scrollIntoView: vi.fn()
    };
    
    (document.getElementById as any).mockReturnValue(mockElement);
    
    const { result } = renderHook(() => useScrollToSection());
    
    act(() => {
      result.current.scrollToSection('test-section');
    });
    
    expect(document.getElementById).toHaveBeenCalledWith('test-section');
  });

  it('should handle missing element', () => {
    (document.getElementById as any).mockReturnValue(null);
    
    const { result } = renderHook(() => useScrollToSection());
    
    act(() => {
      result.current.scrollToSection('non-existent-section');
    });
    
    expect(document.getElementById).toHaveBeenCalledWith('non-existent-section');
  });
});