import axios, { AxiosResponse } from 'axios';

import Cookies from 'js-cookie';
import { toast } from 'sonner';


export const baseURL = process.env.NEXT_PUBLIC_API_URL + '/';


const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = Cookies.get('Authentication');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        // Show error message if data is a string
        toast.error(error.response.data);
      } else if (error.response.data.message) {
        // Show error message if data has a message property
        toast.error(error.response.data.message);
      }
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      Cookies.remove('Authentication');
      // window.location.href = '/auth/login';
    }

    return Promise.reject(error.response?.data || error);
  }
);



export { api };