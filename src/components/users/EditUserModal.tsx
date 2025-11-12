import { useState, useEffect } from 'react';
import type { User, UpdateUserPayload } from '@/types/users';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import { usersAPI } from '@/api/endpoints/users';
import * as _ from '@/constants/en.json';

interface EditUserModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  managers: User[];
  isLoadingManagers: boolean;
}

export function EditUserModal({
  user,
  open,
  onClose,
  onSuccess,
  managers,
  isLoadingManagers,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    status: '',
    manager_id: '',
  });

  const [originalData, setOriginalData] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && open) {
      const initialData = {
        email: user.email,
        role: user.role,
        status: user.status,
        manager_id: user.manager_id || '',
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const payload: UpdateUserPayload = {};

    if (formData.email !== originalData.email) {
      payload.email = formData.email;
    }
    if (formData.role !== originalData.role) {
      payload.role = formData.role.toUpperCase();
    }
    if (formData.status !== originalData.status) {
      payload.status = formData.status.toUpperCase();
    }
    if (formData.manager_id !== originalData.manager_id) {
      payload.manager_id = formData.manager_id || null;
    }

    if (Object.keys(payload).length === 0) {
      setError('No changes made');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await usersAPI.updateUser(user.id, payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to update user'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{_.users.edit}</DialogTitle>
          <DialogDescription>
            {_.users.editDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{_.email}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{_.role}</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">{_.roles[3]}</SelectItem>
                <SelectItem value="HR">{_.roles[2]}</SelectItem>
                <SelectItem value="MANAGER">{_.roles[1]}</SelectItem>
                <SelectItem value="EMPLOYEE">{_.roles[0]}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{_.status}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">{_.active}</SelectItem>
                <SelectItem value="INACTIVE">{_.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">{_.users.Manager}</Label>
            <Select
              value={formData.manager_id}
              onValueChange={(value) => handleChange('manager_id', value)}
              disabled={loading || isLoadingManagers}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{_.users.noManger}</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {_.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}