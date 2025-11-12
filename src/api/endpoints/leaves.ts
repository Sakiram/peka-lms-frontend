import { apiClient } from '../axios.config';
import type { ApplyLeavePayload, Leave, LeaveBalanceResponse, LeavesResponse, LeaveLogsResponse, LeaveRequestsResponse, UploadProofResponse } from '@/types/leaves';

export const leavesAPI = {
  getPendingApprovals: async (): Promise<Leave[]> => {
    const { data } = await apiClient.get<LeavesResponse>('/leaves?status=pending');
    return data.data;
  },
  
  applyLeave: async (payload: ApplyLeavePayload) => {
    const { data } = await apiClient.post('/leaves', payload);
    return data;
  },

  uploadProof: async (file: File): Promise<UploadProofResponse> => {
    const formData = new FormData();
    formData.append('attachment', file);

    const { data } = await apiClient.post<UploadProofResponse>(
      '/leaves/upload-proof',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
  getLeaveBalance: async (): Promise<LeaveBalanceResponse> => {
    const { data } = await apiClient.get<LeaveBalanceResponse>('/leaves/balance');
    return data;
  },

  getLeaves: async (): Promise<LeavesResponse> => {
    const { data } = await apiClient.get<LeavesResponse>('/leaves');
    return data;
  },

  getLeaveLogs: async (leaveId: string): Promise<LeaveLogsResponse> => {
    const { data } = await apiClient.get<LeaveLogsResponse>(`/leaves/logs/${leaveId}`);
    return data;
  },
  
  getLeaveRequests: async (): Promise<LeaveRequestsResponse> => {
    const { data } = await apiClient.get<LeaveRequestsResponse>('/leaves/requests');
    return data;
  },

  approveLeave: async (leaveId: string, leaveType: string) => {
    const { data } = await apiClient.put(`/leaves/${leaveId}/approve`, { leaveType });
    return data;
  },

  rejectLeave: async (leaveId: string, leaveType: string) => {
    const { data } = await apiClient.put(`/leaves/${leaveId}/reject`, { leaveType });
    return data;
  },
};