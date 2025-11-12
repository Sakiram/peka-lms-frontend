import { apiClient } from '../axios.config';
import type { CreateLeaveTypePayload, LeaveType, UpdateLeaveTypePayload } from '@/types/leaves';

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
