import axios, {
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const serverApi = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor for server-side
serverApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers = config.headers || ({} as AxiosRequestHeaders);

    // For server-side calls, we might need to pass auth token differently
    // This will be handled by the calling function
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  error => {
    console.error('Server Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor for server-side
serverApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Server-side error handling - just log, no toast
    console.error('Server API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export { serverApi };
