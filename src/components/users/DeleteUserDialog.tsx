import { useState } from 'react';
import type { User } from '@/types/users';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/shadcn/alert-dialog';
import { usersAPI } from '@/api/endpoints/users';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import * as _ from '@/constants/en.json';

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteUserDialog({
  user,
  open,
  onClose,
  onSuccess,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await usersAPI.deleteUser(user.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to delete user'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{_.users.delete}</AlertDialogTitle>
          <AlertDialogDescription>
            {_.users.sure1} {user.first_name} {user.last_name}?
            {_.users.sure2}
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