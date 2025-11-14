import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute } from '../../../constants';
import { usePageSuffix } from '../hooks';

describe('usePageSuffix', () => {
  it('should return "login" for login route', () => {
    const { result } = renderHook(() => usePageSuffix(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current).toBe('login');
  });

  it('should return "favorites" for favorites route', () => {
    const { result } = renderHook(() => usePageSuffix(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current).toBe('favorites');
  });

  it('should return "offer" for offer route', () => {
    const { result } = renderHook(() => usePageSuffix(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/offer/123']}>{children}</MemoryRouter>
      ),
    });

    expect(result.current).toBe('offer');
  });

  it('should return "index" for root route', () => {
    const { result } = renderHook(() => usePageSuffix(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[AppRoute.Root]}>{children}</MemoryRouter>
      ),
    });

    expect(result.current).toBe('index');
  });

  it('should return undefined for unknown route', () => {
    const { result } = renderHook(() => usePageSuffix(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/some-unknown-route']}>
          {children}
        </MemoryRouter>
      ),
    });

    expect(result.current).toBeUndefined();
  });

  it('should update when route changes', () => {
    const { result, rerender } = renderHook(() => usePageSuffix(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[AppRoute.Root]}>{children}</MemoryRouter>
      ),
    });

    expect(result.current).toBe('index');

    rerender();
  });
});
