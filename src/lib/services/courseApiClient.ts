import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL_COURSE = process.env.NEXT_PUBLIC_API_URL_COURSE || 'http://localhost:8081';
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
  baseURL: API_URL_COURSE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshingCourseToken = false;
let failedCourseQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processCourseQueue = (error: unknown, token: string | null = null) => {
  failedCourseQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedCourseQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    console.log("COURSE API CLIENT INTERCEPTOR - User from localStorage:", user);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("COURSE API CLIENT INTERCEPTOR - Token added to header:",config.headers.Authorization);
    } else {
        console.warn("COURSE API CLIENT INTERCEPTOR - No token found in user object from localStorage.");
    }
    
    return config;
  },
  
  (error) => {
    console.error("COURSE API CLIENT INTERCEPTOR - Request error:", error);
    return Promise.reject(error)
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig<any> & { _retry?: boolean };

    const API_URL_AUTH = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshingCourseToken) {
        return new Promise((resolve, reject) => {
          failedCourseQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshingCourseToken = true;

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
          processCourseQueue(null, accessToken);
          return api(originalRequest);
        } catch (err) {
          processCourseQueue(err, null);
          clearUserData();
          if (typeof window !== 'undefined') {
            // window.location.href = '/login';
          }
          return Promise.reject(err);
        } finally {
          isRefreshingCourseToken = false;
        }
      } else {
        clearUserData();
        if (typeof window !== 'undefined') {
          // window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;