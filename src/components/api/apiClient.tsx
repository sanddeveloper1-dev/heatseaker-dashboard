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

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add API key to headers
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  const config = {
    ...options,
    headers,
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

// Convenience methods
export const api = {
  get: (endpoint: string, options: RequestInit = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    }),

  put: (endpoint: string, body: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  delete: (endpoint: string, options: RequestInit = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;