import type { LeaveRequest } from '@/types/leaves';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { CheckCircle, XCircle, ExternalLink, User } from 'lucide-react';
import { format } from 'date-fns';

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
  isLoading: boolean;
  onApprove: (leaveId: string, leaveType: string) => void;
  onReject: (leaveId: string, leaveType: string) => void;
}

export function LeaveRequestsTable({
  requests,
  isLoading,
  onApprove,
  onReject,
}: LeaveRequestsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No leave requests found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attachment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {request.applicant.first_name} {request.applicant.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.applicant.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {request.leave_types.name}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(request.start_date), 'MMM dd')}
                {' - '}
                {format(new Date(request.end_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {request.total_days} {request.half_day && '(Half)'}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {request.reason}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(request.applied_on), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(request.status) as any}>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                {request.attachment_url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(request.attachment_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                {request.status === 'PENDING' ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onApprove(request.id, request.leave_types.name)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(request.id, request.leave_types.name)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {request.status === 'APPROVED' && 'Approved'}
                    {request.status === 'REJECTED' && 'Rejected'}
                    {request.status === 'CANCELLED' && 'Cancelled'}
                    {request.reviewed_on && (
                      <div className="text-xs">
                        {format(new Date(request.reviewed_on), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}