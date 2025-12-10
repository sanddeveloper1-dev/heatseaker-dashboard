import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../Components/auth/AuthContext';

// Test component that uses the auth context
function TestComponent() {
  const { token, user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="token">{token || 'null'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="isLoading">{isLoading ? 'true' : 'false'}</div>
      <button
        data-testid="login-btn"
        onClick={() => login('test-token', { username: 'testuser' })}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide auth context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toBeInTheDocument();
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('should load token from localStorage on mount', () => {
    localStorage.setItem('heatseaker_admin_token', 'stored-token');
    localStorage.setItem('heatseaker_admin_user', JSON.stringify({ username: 'storeduser' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for useEffect to run
    setTimeout(() => {
      expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    }, 100);
  });

  it('should allow login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByTestId('login-btn');
    act(() => {
      loginBtn.click();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('test-token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    expect(localStorage.getItem('heatseaker_admin_token')).toBe('test-token');
  });

  it('should allow logout', () => {
    localStorage.setItem('heatseaker_admin_token', 'test-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutBtn = screen.getByTestId('logout-btn');
    act(() => {
      logoutBtn.click();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    expect(localStorage.getItem('heatseaker_admin_token')).toBeNull();
  });
});
