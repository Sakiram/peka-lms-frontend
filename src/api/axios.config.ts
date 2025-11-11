import axios, { AxiosError } from 'axios';
import { store } from '@/store';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch.auth.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      // toast.error('You do not have permission to access this resource');
    }
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);