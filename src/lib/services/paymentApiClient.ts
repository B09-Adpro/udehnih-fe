import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL_PAYMENT = process.env.NEXT_PUBLIC_API_URL_PAYMENT || 'http://localhost:8081';
const USER_STORAGE_KEY = 'user';

interface StoredUser {
  token?: string;
  refreshToken?: string;
}

const getCurrentUser = (): StoredUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const updateUserTokens = (accessToken: string, refreshToken?: string) => {
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, token: accessToken };
    if (refreshToken) {
      (updatedUser as any).refreshToken = refreshToken;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  }
};

const clearUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

const api = axios.create({
  baseURL: API_URL_PAYMENT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshingPaymentToken = false;
let failedPaymentQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processPaymentQueue = (error: unknown, token: string | null = null) => {
  failedPaymentQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedPaymentQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  
  (error) => {
    console.error("PAYMENT API CLIENT INTERCEPTOR - Request error:", error);
    return Promise.reject(error)
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig<any> & { _retry?: boolean };

    const API_URL_AUTH = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshingPaymentToken) {
        return new Promise((resolve, reject) => {
          failedPaymentQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshingPaymentToken = true;

      const user = getCurrentUser();
      if (user?.refreshToken) {
        try {
          const refreshApi = axios.create({ baseURL: API_URL_AUTH });
          const response = await refreshApi.post<{ accessToken: string; refreshToken?: string }>(
            '/api/auth/refresh',
            { refreshToken: user.refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          updateUserTokens(accessToken, newRefreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          processPaymentQueue(null, accessToken);
          return api(originalRequest);
        } catch (err) {
          processPaymentQueue(err, null);
          clearUserData();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(err);
        } finally {
          isRefreshingPaymentToken = false;
        }
      } else {
        clearUserData();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;