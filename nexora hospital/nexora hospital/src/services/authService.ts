import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role?: {
    id: number;
    name: string; // 'admin' | 'doctor' | etc.
  };
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

// POST /api/login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', credentials);
  const { token, user } = response.data;
  // Persist token and user in localStorage
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  return response.data;
};

// POST /api/logout
export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
};

// GET /api/me
export const getMe = async (): Promise<AuthUser> => {
  const response = await api.get<{ user: AuthUser }>('/me');
  return response.data.user;
};

// Helpers for reading locally stored auth state
export const getStoredToken = (): string | null => localStorage.getItem('auth_token');
export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem('auth_user');
  return raw ? JSON.parse(raw) : null;
};

// Check if role is admin
export const isAdmin = (user: AuthUser | null): boolean =>
  user?.role?.name?.toLowerCase() === 'admin';

// Check if role is doctor
export const isDoctor = (user: AuthUser | null): boolean =>
  user?.role?.name?.toLowerCase() === 'doctor';
