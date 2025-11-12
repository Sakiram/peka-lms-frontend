import type { Leave } from '@/types/leaves';
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
import { History, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import * as _ from '@/constants/en.json';

interface LeavesTableProps {
  leaves: Leave[];
  isLoading: boolean;
  onViewLogs: (leaveId: string) => void;
}

export function LeavesTable({ leaves, isLoading, onViewLogs }: LeavesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (leaves.length === 0) {
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
            <TableHead>{_.leaves.tableHeader[1]}</TableHead>
            <TableHead>{_.leaves.tableHeader[2]}</TableHead>
            <TableHead>{_.leaves.tableHeader[3]}</TableHead>
            <TableHead>{_.leaves.tableHeader[4]}</TableHead>
            <TableHead>{_.leaves.tableHeader[6]}</TableHead>
            <TableHead>{_.leaves.tableHeader[5]}</TableHead>
            <TableHead>{_.leaves.tableHeader[7]}</TableHead>
            <TableHead className="text-right">{_.leaves.tableHeader[8]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell className="font-medium">
                {leave.leave_types.name}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(leave.start_date), 'MMM dd, yyyy')}
                {' - '}
                {format(new Date(leave.end_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {leave.total_days} {leave.half_day && '(Half)'}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {leave.reason}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(leave.status) as any}>
                  {leave.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(leave.applied_on), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {leave.attachment_url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(leave.attachment_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewLogs(leave.id)}
                >
                  <History className="h-4 w-4 mr-1" />
                  {_.logs}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}