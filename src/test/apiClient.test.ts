import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, loginApi } from '../../Components/api/apiClient';

// Mock fetch
global.fetch = vi.fn();

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('api.get', () => {
    it('should make a GET request', async () => {
      const mockResponse = { data: 'test' };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockResponse,
      });

      const result = await api.get('/test');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include authorization header when token exists', async () => {
      localStorage.setItem('heatseaker_admin_token', 'test-token');
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({}),
      });

      await api.get('/test');
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ error: 'Not found' }),
      });

      await expect(api.get('/test')).rejects.toThrow();
    });
  });

  describe('api.post', () => {
    it('should make a POST request with body', async () => {
      const mockBody = { test: 'data' };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ success: true }),
      });

      await api.post('/test', mockBody);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockBody),
        })
      );
    });
  });

  describe('loginApi', () => {
    it('should make a login request', async () => {
      const mockResponse = { success: true, token: 'token', user: {} };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await loginApi('user', 'pass');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'user', password: 'pass' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed login', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: 'Invalid credentials' }),
      });

      await expect(loginApi('user', 'pass')).rejects.toThrow();
    });
  });
});
