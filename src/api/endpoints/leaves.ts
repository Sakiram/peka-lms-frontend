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

export const leavesAPI = {
  getPendingApprovals: async (): Promise<Leave[]> => {
    const { data } = await apiClient.get<LeavesResponse>('/leaves?status=pending');
    return data.data;
  },
  
  getAllLeaves: async (): Promise<Leave[]> => {
    const { data } = await apiClient.get<LeavesResponse>('/leaves');
    return data.data;
  },
};