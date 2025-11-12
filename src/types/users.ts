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
  contact_no: number | null;
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
  profile_pic_url?: string;
  contact_no?: number | null;
  first_name?: string;
  last_name?: string;
}

export interface UploadPicResponse {
  success: boolean;
  data: string;
}