import { apiClient } from '../axios.config';
import type { User, SetPasswordRequest, SetPasswordResponse } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<{ user: User;}> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return { 
      user: data.user,
    };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

   setPassword: async (token: string, payload: SetPasswordRequest): Promise<SetPasswordResponse> => {
    const { data } = await apiClient.post<SetPasswordResponse>(
      `/auth/set-password/${token}`,
      payload
    );
    return data;
  },
};