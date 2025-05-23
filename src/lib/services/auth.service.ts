import api from './api';
import { AuthUser } from './interface';

const USER_STORAGE_KEY = 'user';

export const AuthService = {
  register: async (email: string, name: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { email, name, password });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Registration failed');
    }
  },

  login: async (email: string, password: string): Promise<AuthUser> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.token) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
      }
      
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      const user = AuthService.getCurrentUser();
      if (user?.token) {
        await api.post('/auth/logout', {}, {
          params: { refreshToken: user.refreshToken },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  getCurrentUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const user = AuthService.getCurrentUser();
    return Boolean(user?.token);
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
    try {
      const res = await api.post('/auth/refresh-token', { refreshToken });
      return res.data;
    } catch {
      throw new Error('Session expired. Please login again.');
    }
  },
};