import { apiClient } from '../axios.config';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
  contact_no: string | null;
  profile_pic_url: string | null;
  join_date: string;
  manager_id: string | null;
  manager?: {
    username: string;
  };
}

export interface UsersResponse {
  success: boolean;
  data: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: User[];
  };
}

export interface UpdateUserPayload {
  email?: string;
  role?: string;
  status?: string;
  manager_id?: string | null;
}

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
      `/users?limit=100&role=ADMIN&_t=${Date.now()}`
    );
    const admins = response.data.data.data;

    const hrs = await apiClient.get<UsersResponse>(
      `/users?limit=100&role=HR&_t=${Date.now()}`
    );
    const hrUsers = hrs.data.data.data;

    const managers = await apiClient.get<UsersResponse>(
      `/users?limit=100&role=MANAGER&_t=${Date.now()}`
    );
    const managerUsers = managers.data.data.data;

    return [...admins, ...hrUsers, ...managerUsers];
  },

  // Update user
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
};