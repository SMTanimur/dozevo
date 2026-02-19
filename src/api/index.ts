import axios, {
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';

import Cookies from 'js-cookie';
import { toast } from 'sonner';

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers = config.headers || ({} as AxiosRequestHeaders);

    const token = Cookies.get('Authentication');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  error => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Only use toast in browser environment
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        Cookies.remove('Authentication');
        // Show API message if available, otherwise generic session expired
        const message =
          error.response?.data?.message ||
          (typeof error.response?.data === 'string'
            ? error.response.data
            : null) ||
          'Session expired. Please log in again.';
        toast.error(message);
      } else {
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            toast.error(error.response.data);
          } else if (error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('An unexpected error occurred.');
          }
        } else if (error.message) {
          toast.error(error.message);
        }
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export { api };
