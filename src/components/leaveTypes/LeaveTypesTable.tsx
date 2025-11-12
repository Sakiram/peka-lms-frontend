import type { LeaveType } from '@/types/leaves';
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
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import * as _ from '@/constants/en.json';

interface LeaveTypesTableProps {
  leaveTypes: LeaveType[];
  isLoading: boolean;
  onEdit: (leaveType: LeaveType) => void;
  onDelete: (leaveType: LeaveType) => void;
}

export function LeaveTypesTable({
  leaveTypes,
  isLoading,
  onEdit,
  onDelete,
}: LeaveTypesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (leaveTypes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{_.leaves.noLeaveTypes}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{_.name}</TableHead>
            <TableHead>{_.description}</TableHead>
            <TableHead>{_.leaves.MaxDaysPerYear}</TableHead>
            <TableHead>{_.leaves.RequiresDocument}</TableHead>
            <TableHead>{_.leaves.CarryForward}</TableHead>
            <TableHead>{_.status}</TableHead>
            <TableHead className="text-right">{_.action}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveTypes.map((leaveType) => (
            <TableRow key={leaveType.id}>
              <TableCell className="font-medium">{leaveType.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {leaveType.description || '-'}
              </TableCell>
              <TableCell>{leaveType.max_days_per_year}</TableCell>
              <TableCell>
                {leaveType.requires_document ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {_.yes}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {_.no}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {leaveType.carry_forward ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {_.yes}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {_.no}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {leaveType.active ? (
                  <Badge variant="default">{_.active}</Badge>
                ) : (
                  <Badge variant="secondary">{_.inactive}</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(leaveType)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(leaveType)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
