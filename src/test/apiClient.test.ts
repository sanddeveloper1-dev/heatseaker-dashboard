import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/components/api/apiClient';

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

    it('should include API key header when API key exists', async () => {
      localStorage.setItem('heatseaker_api_key', 'test-api-key');
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
            'X-API-Key': 'test-api-key',
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

});
