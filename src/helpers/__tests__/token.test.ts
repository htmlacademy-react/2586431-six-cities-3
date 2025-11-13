import { describe, it, expect, beforeEach, vi } from 'vitest';
import token from '../token';
import { AUTH_TOKEN_KEY } from '../../constants';

describe('token', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('should return empty string when token is not in localStorage', () => {
      const result = token.get();
      expect(result).toBe('');
    });

    it('should return token from localStorage', () => {
      const testToken = 'test-token-123';
      localStorage.setItem(AUTH_TOKEN_KEY, testToken);
      const result = token.get();
      expect(result).toBe(testToken);
    });
  });

  describe('save', () => {
    it('should save token to localStorage', () => {
      const testToken = 'test-token-456';
      token.save(testToken);
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(testToken);
    });

    it('should overwrite existing token', () => {
      const firstToken = 'first-token';
      const secondToken = 'second-token';
      token.save(firstToken);
      token.save(secondToken);
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(secondToken);
    });
  });

  describe('purge', () => {
    it('should remove token from localStorage', () => {
      const testToken = 'test-token-789';
      localStorage.setItem(AUTH_TOKEN_KEY, testToken);
      token.purge();
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    });

    it('should not throw error when token does not exist', () => {
      expect(() => token.purge()).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should work with get, save, and purge together', () => {
      const testToken = 'integration-token';

      expect(token.get()).toBe('');

      token.save(testToken);
      expect(token.get()).toBe(testToken);

      token.purge();
      expect(token.get()).toBe('');
    });
  });
});
