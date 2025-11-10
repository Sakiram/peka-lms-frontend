import { apiClient } from '../axios.config';

export interface LeaveType {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  max_days_per_year: number;
  requires_document: boolean;
  carry_forward: boolean;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaveTypePayload {
  name: string;
  description: string;
  max_days_per_year: number;
  requires_document: boolean;
  carry_forward: boolean;
}

export interface UpdateLeaveTypePayload {
  name: string;
  description: string;
  max_days_per_year: number;
  requires_document: boolean;
  carry_forward: boolean;
}

export const leaveTypesAPI = {
  // Get all leave types
  getAllLeaveTypes: async (): Promise<LeaveType[]> => {
    const { data } = await apiClient.get<LeaveType[]>('/leave-types/');
    return data;
  },

  // Create leave type
  createLeaveType: async (payload: CreateLeaveTypePayload) => {
    const { data } = await apiClient.post('/leave-types', payload);
    return data;
  },

  // Update leave type
  updateLeaveType: async (id: string, payload: UpdateLeaveTypePayload) => {
    const { data } = await apiClient.put(`/leave-types/${id}`, payload);
    return data;
  },

  // Delete leave type
  deleteLeaveType: async (id: string) => {
    const { data } = await apiClient.delete(`/leave-types/${id}`);
    return data;
  },
};
