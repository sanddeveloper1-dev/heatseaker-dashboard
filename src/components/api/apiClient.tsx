// API Client configuration
// This module provides a configured fetch wrapper for API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'; // Can be overridden via .env
const API_KEY = import.meta.env.VITE_API_KEY || ''; // API key from environment variable

// Get API key from environment or localStorage (fallback for development)
function getApiKey(): string {
  if (API_KEY) {
    return API_KEY;
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem('heatseaker_api_key') || '';
  }
  return '';
}

// Main API request function
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const apiKey = getApiKey();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add API key to headers (note: backend uses 'x-api-key' per API_SCHEMAS.md)
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const config: RequestInit = {
    ...options,
    headers: headers as HeadersInit,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, config);

  // Handle 401/403 - API key errors
  if (response.status === 401 || response.status === 403) {
    throw new Error('API key authentication failed');
  }

  // Parse response
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error: any = new Error(data.message || data.error || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Convenience methods with generic type support
export const api = {
  get: <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> =>
    apiRequest(endpoint, { ...options, method: 'GET' }) as Promise<T>,

  post: <T = any>(endpoint: string, body: any, options: RequestInit = {}): Promise<T> =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    }) as Promise<T>,

  put: <T = any>(endpoint: string, body: any, options: RequestInit = {}): Promise<T> =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    }) as Promise<T>,

  delete: <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }) as Promise<T>,
};

export default api;