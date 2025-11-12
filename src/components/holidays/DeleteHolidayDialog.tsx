import { useState } from 'react';
import type { Holiday } from '@/types/holidays';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/shadcn/alert-dialog';
import { holidaysAPI } from '@/api/endpoints/holidays';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import * as _ from '@/constants/en.json';

interface DeleteHolidayDialogProps {
  holiday: Holiday | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteHolidayDialog({
  holiday,
  open,
  onClose,
  onSuccess,
}: DeleteHolidayDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!holiday) return;

    setLoading(true);
    setError('');

    try {
      await holidaysAPI.deleteHoliday(holiday.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to delete holiday'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!holiday) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{_.delete} {_.holidays.holidays}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{holiday.name}"?
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