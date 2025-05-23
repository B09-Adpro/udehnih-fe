import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const USER_STORAGE_KEY = 'user';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

const getCurrentUser = () => {
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
    user.token = accessToken;
    if (refreshToken) user.refreshToken = refreshToken;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

const clearUserData = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const user = getCurrentUser();
      if (user?.refreshToken) {
        try {
          const refreshApi = axios.create({ baseURL: API_URL });
          const response = await refreshApi.post('/auth/refresh-token', {
            refreshToken: user.refreshToken
          });

          const { accessToken, refreshToken } = response.data;
          updateUserTokens(accessToken, refreshToken);
          
          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          clearUserData();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
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