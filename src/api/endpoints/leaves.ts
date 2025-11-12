import { apiClient } from '../axios.config';

export interface Leave {
  id: string;
  organization_id: string;
  user_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  half_day: boolean;
  reason: string;
  attachment_url: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applied_on: string;
  reviewed_by: string | null;
  reviewed_on: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  leave_types: {
    name: string;
  };
  approver: any;
}

export interface LeavesResponse {
  success: boolean;
  data: Leave[];
}

export interface LeaveBalance {
  type: string;
  allocated: number;
  used: number;
  remaining: number;
}

export interface LeaveBalanceResponse {
  success: boolean;
  data: LeaveBalance[];
}

export interface LeaveLog {
  action: string;
  by: string;
  role: string;
  when: string;
  remarks: string;
}

export interface LeaveLogsResponse {
  success: boolean;
  data: LeaveLog[];
}

export interface ApplyLeavePayload {
  leave_type_id: string;
  leave_type_name?: string;
  start_date: string;
  end_date: string;
  total_days: number;
  half_day: boolean;
  reason: string;
  attachment_url?: string;
}

export interface UploadProofResponse {
  success: boolean;
  data: string;
}

export interface LeaveRequest {
  id: string;
  organization_id: string;
  user_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  half_day: boolean;
  reason: string;
  attachment_url: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  applied_on: string;
  reviewed_by: string | null;
  reviewed_on: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  applicant: {
    email: string;
    last_name: string;
    first_name: string;
  };
  approver: {
    email: string;
    last_name: string;
    first_name: string;
  } | null;
  leave_types: {
    name: string;
  };
}

export interface LeaveRequestsResponse {
  success: boolean;
  data: LeaveRequest[];
}

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