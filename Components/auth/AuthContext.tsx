import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
	username?: string;
	[key: string]: any;
}

interface AuthContextType {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (newToken: string, userData: User | null) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'heatseaker_admin_token';
const USER_KEY = 'heatseaker_admin_user';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Initialize from localStorage
		const storedToken = localStorage.getItem(TOKEN_KEY);
		const storedUser = localStorage.getItem(USER_KEY);

		if (storedToken) {
			setToken(storedToken);
		}
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				console.error('Failed to parse stored user');
			}
		}
		setIsLoading(false);
	}, []);

	const login = useCallback((newToken: string, userData: User | null) => {
		setToken(newToken);
		setUser(userData);
		localStorage.setItem(TOKEN_KEY, newToken);
		if (userData) {
			localStorage.setItem(USER_KEY, JSON.stringify(userData));
		}
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUser(null);
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	}, []);

	const value = {
		token,
		user,
		isAuthenticated: !!token,
		isLoading,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

export default AuthContext;