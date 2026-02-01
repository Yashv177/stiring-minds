import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.error || 'An error occurred';
      const details = error.response.data?.details;

      const apiError = new Error(message) as Error & { details?: ApiError['details'] };
      apiError.details = details;

      return Promise.reject(apiError);
    }

    if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

// API methods
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const dealsApi = {
  list: (params?: { q?: string; tags?: string; page?: number; limit?: number }) =>
    api.get('/deals', { params }),

  get: (id: string) =>
    api.get(`/deals/${id}`),
};

export const claimsApi = {
  create: (data: { dealId: string }) =>
    api.post('/claims', data),

  list: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/claims/me', { params }),
};

export const verificationApi = {
  status: () =>
    api.get('/verification/status'),

  request: () =>
    api.post('/verification/request'),
};

export default api;

