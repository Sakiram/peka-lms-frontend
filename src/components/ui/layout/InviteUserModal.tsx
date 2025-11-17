import { useState } from 'react';
import type { User } from '@/types/users';
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
import { AlertCircle, UserPlus, Upload, X } from 'lucide-react';
import { invitesAPI } from '@/api/endpoints/invites';
import * as _ from '@/constants/en.json';

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  managers: User[];
  isLoadingManagers: boolean;
}

export function InviteUserModal({
  open,
  onClose,
  onSuccess,
  managers,
  isLoadingManagers,
}: InviteUserModalProps) {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    reporting_to: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file');
        setCsvFile(null);
        return;
      }
      setCsvFile(file);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setCsvFile(null);
    const fileInput = document.getElementById('csv-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await invitesAPI.bulkInvite(formData);

      setSuccessMessage(
        `${response.total} invites queued for processing!`
      );
      setTimeout(() => { handleClose(); onSuccess();}, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to upload CSV file'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!formData.role) {
      setError('Role is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await invitesAPI.inviteUser({
        email: formData.email,
        role: formData.role.toUpperCase(),
        reporting_to: formData.reporting_to || null,
      });

      setFormData({
        email: '',
        role: '',
        reporting_to: '',
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to send invite'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      role: '',
      reporting_to: '',
    });
    setCsvFile(null);
    setError('');
    setSuccessMessage('');
    setIsBulkMode(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {isBulkMode ? 'Bulk Invite Users' : _.users.inviteUser}
          </DialogTitle>
          <DialogDescription>
            {isBulkMode 
              ? 'Upload a CSV file to invite multiple users at once' 
              : _.users.inviteUserDescription
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            type="button"
            variant={!isBulkMode ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => {
              setIsBulkMode(false);
              setError('');
              setCsvFile(null);
            }}
          >
            Single Invite
          </Button>
          <Button
            type="button"
            variant={isBulkMode ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => {
              setIsBulkMode(true);
              setError('');
              setFormData({ email: '', role: '', reporting_to: '' });
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>

        {isBulkMode ? (
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">
                CSV File <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
                {csvFile && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm truncate">{csvFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                CSV format: email, role, reporting_to (optional)
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-500 text-green-700">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                {_.cancel}
              </Button>
              <Button type="submit" disabled={loading || !csvFile}>
                {loading ? 'Uploading...' : 'Upload & Send Invites'}
              </Button>
            </div>
          </form>
        ) : (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {_.email} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              {_.role} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value)}
              disabled={loading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">{_.roles[0]}</SelectItem>
                <SelectItem value="MANAGER">{_.roles[1]}</SelectItem>
                <SelectItem value="HR">{_.roles[2]}</SelectItem>
                <SelectItem value="ADMIN">{_.roles[3]}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">{_.users.optionalManager}</Label>
            <Select
              value={formData.reporting_to}
              onValueChange={(value) => 
                handleChange('reporting_to', value === 'none' ? '' : value)
              }
              disabled={loading || isLoadingManagers}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{_.users.noManger}</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.username} ({manager.role})
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

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {_.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending Invite...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      )}
      </DialogContent>
    </Dialog>
  );
}