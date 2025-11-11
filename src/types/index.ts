export interface User {
  id: string;
  org_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  manager_id: string | null;
  profile_pic_url: string;
  contact_no: number;
  join_date: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  organization: {
    org_name: string;
  }
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface OrgSignupStep1 {
  org_name: string;
  domain: string;
  org_email: string;
  password: string;
}

export interface OrgSignupStep2 {
  firstname: string;
  lastname: string;
  username: string;
}

export interface SetPasswordRequest {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
}

export interface SetPasswordResponse {
  message: string;
  success?: boolean;
}