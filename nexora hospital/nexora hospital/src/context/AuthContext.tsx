import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, getMe, getStoredToken, getStoredUser } from '../services/authService';
import type { AuthUser, LoginCredentials } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(!!getStoredToken()); // loading only if we have a stored token to verify
  const [error, setError] = useState<string | null>(null);

  // On mount, if a token exists, verify it is still valid by calling /me
  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    getMe()
      .then((freshUser) => {
        setUser(freshUser);
        setToken(storedToken);
      })
      .catch(() => {
        // Token invalid/expired — clear everything
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await apiLogin(credentials);
      setUser(data.user);
      setToken(data.token);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Login failed. Please check your credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        isLoading,
        user,
        token,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
