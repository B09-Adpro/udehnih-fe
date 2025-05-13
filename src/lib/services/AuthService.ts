import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthService = {
  
  register: async (email: string, name: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        name,
        password,
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error during registration');
    }
  },

  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  },

  
  logout: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user && user.token) {
        await api.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }
      
      localStorage.removeItem('user');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },

  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  
  isAuthenticated: () => {
    const user = AuthService.getCurrentUser();
    return !!user && !!user.token;
  },

  //diimplementasi nanti lagi mikir
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/refresh-token', {
        refreshToken: refreshToken
      });
      
      const user = AuthService.getCurrentUser();
      if (user && response.data.accessToken) {
        user.token = response.data.accessToken;
        user.refreshToken = response.data.refreshToken;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error: any) {
      AuthService.logout();
      throw new Error('Session expired. Please login again.');
    }
  }
};

export default AuthService;