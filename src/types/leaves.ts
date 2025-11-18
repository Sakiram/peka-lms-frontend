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
  data: {
    data: LeaveRequest[];
    totalPages: number;
    total: number;
    limit: number;
    page: number;
  };
}

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