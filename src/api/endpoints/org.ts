import { apiClient } from '../axios.config';

export interface CreateOrgRequest {
  org_name: string;
  domain: string;
  org_email: string;
  password: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface CreateOrgResponse {
  message: string;
  org_id: string;
  user_id: string;
}

export const orgAPI = {
  createOrg: async (orgData: CreateOrgRequest): Promise<CreateOrgResponse> => {
    const { data } = await apiClient.post<CreateOrgResponse>('/org/create', orgData);
    return data;
  },
};
