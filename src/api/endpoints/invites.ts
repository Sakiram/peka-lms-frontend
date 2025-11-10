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
};