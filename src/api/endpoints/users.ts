import { apiClient } from '../axios.config';
import type { UpdateUserPayload, User, UserFilters, UsersResponse, UploadPicResponse} from '@/types/users';

export const usersAPI = {
  getUsers: async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    if (filters.search) params.append('search', filters.search);
    
    params.append('_t', Date.now().toString());
    const { data } = await apiClient.get<UsersResponse>(
      `/users?${params.toString()}`
    );
    
    return data;
  },
  getManagers: async (): Promise<User[]> => {
    const response = await apiClient.get<UsersResponse>(
      `/users?limit=100&role=ADMIN,MANAGER,HR&_t=${Date.now()}`
    );
    const managers = response.data.data.data;

    return [...managers];
  },

  updateUser: async (userId: string, payload: UpdateUserPayload) => {
    const { data } = await apiClient.put(
      `/users/profile/${userId}`,
      payload
    );
    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await apiClient.delete(`/users/${userId}`);
    return data;
  },

  uploadProfilePic: async (file: File): Promise<UploadPicResponse> => {
    const formData = new FormData();
    formData.append('profile_pic', file);

    const { data } = await apiClient.post<UploadPicResponse>(
      '/users/upload-pic',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
};