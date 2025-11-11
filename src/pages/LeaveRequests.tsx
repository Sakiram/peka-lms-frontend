import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { FileText, AlertCircle, Filter } from 'lucide-react';
import { leavesAPI, type LeaveRequest } from '@/api/endpoints/leaves';
import { LeaveRequestsTable } from '@/components/leaveRequests/LeaveRequestTable';
import { LeaveActionDialog } from '@/components/leaveRequests/LeaveActionDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';

export function LeaveRequests() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Permission check - Only ADMIN, HR, MANAGER
  if (!user || !['ADMIN', 'HR', 'MANAGER'].includes(user.role)) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Action dialog state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    // Filter requests based on status
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === statusFilter));
    }
  }, [statusFilter, requests]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await leavesAPI.getLeaveRequests();
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to load leave requests'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setSelectedAction('approve');
    setActionDialogOpen(true);
  };

  const handleReject = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setSelectedAction('reject');
    setActionDialogOpen(true);
  };

  const handleSuccess = () => {
    loadRequests(); // Refresh list
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">
            Review and manage employee leave requests
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
            {pendingCount} Pending
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Leave Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveRequestsTable
            requests={filteredRequests}
            isLoading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <LeaveActionDialog
        leaveId={selectedLeaveId}
        action={selectedAction}
        open={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false);
          setSelectedLeaveId(null);
          setSelectedAction(null);
        }}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  );
}