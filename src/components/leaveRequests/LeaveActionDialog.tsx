import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/shadcn/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import { leavesAPI } from '@/api/endpoints/leaves';

interface LeaveActionDialogProps {
  leaveId: string | null;
  action: 'approve' | 'reject' | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveActionDialog({
  leaveId,
  action,
  open,
  onClose,
  onSuccess,
}: LeaveActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!leaveId || !action) return;

    setLoading(true);
    setError('');

    try {
      if (action === 'approve') {
        await leavesAPI.approveLeave(leaveId);
      } else {
        await leavesAPI.rejectLeave(leaveId);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || `Failed to ${action} leave request`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === 'approve'
              ? 'Are you sure you want to approve this leave request? The employee will be notified.'
              : 'Are you sure you want to reject this leave request? The employee will be notified.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleAction}
          disabled={loading}
          className={action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
        >
          {loading ? 'Processing...' : action === 'approve' ? 'Approve' : 'Reject'}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}