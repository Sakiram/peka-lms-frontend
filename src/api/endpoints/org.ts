import { apiClient } from '../axios.config';
import type { CreateOrgRequest, CreateOrgResponse } from '@/types/org';

export const orgAPI = {
  createOrg: async (orgData: CreateOrgRequest): Promise<CreateOrgResponse> => {
    const { data } = await apiClient.post<CreateOrgResponse>('/org/create', orgData);
    return data;
  },
};
