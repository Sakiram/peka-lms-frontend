import { useState } from 'react';
import type { LeaveType } from '@/types/leaves';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/shadcn/alert-dialog';
import { leaveTypesAPI } from '@/api/endpoints/leaveTypes';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import * as _ from '@/constants/en.json';

interface DeleteLeaveTypeDialogProps {
  leaveType: LeaveType | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteLeaveTypeDialog({
  leaveType,
  open,
  onClose,
  onSuccess,
}: DeleteLeaveTypeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!leaveType) return;

    setLoading(true);
    setError('');

    try {
      await leaveTypesAPI.deleteLeaveType(leaveType.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to delete leave type'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!leaveType) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{_.leaves.delete}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{leaveType.name}"?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogCancel disabled={loading}>{_.cancel}</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={loading}
          className="bg-destructive hover:bg-destructive/90"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
