import { apiClient } from '../axios.config';

export interface InviteUserPayload {
  email: string;
  role: string;
  reporting_to: string | null;
}

export const invitesAPI = {
  inviteUser: async (payload: InviteUserPayload) => {
    const { data } = await apiClient.post('/invites/', payload);
    return data;
  },
  
  bulkInvite: async (formData: FormData) => {
    const response = await apiClient.post('/invites/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};