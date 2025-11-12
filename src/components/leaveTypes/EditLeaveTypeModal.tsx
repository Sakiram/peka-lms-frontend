import { useState, useEffect } from 'react';
import type { LeaveType } from '@/types/leaves';
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
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import { Textarea } from '@/components/ui/shadcn/textarea';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle, Edit } from 'lucide-react';
import { leaveTypesAPI } from '@/api/endpoints/leaveTypes';
import * as _ from '@/constants/en.json';

interface EditLeaveTypeModalProps {
  leaveType: LeaveType | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLeaveTypeModal({
  leaveType,
  open,
  onClose,
  onSuccess,
}: EditLeaveTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_days_per_year: '',
    requires_document: false,
    carry_forward: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (leaveType && open) {
      setFormData({
        name: leaveType.name,
        description: leaveType.description,
        max_days_per_year: leaveType.max_days_per_year.toString(),
        requires_document: leaveType.requires_document,
        carry_forward: leaveType.carry_forward,
      });
    }
  }, [leaveType, open]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveType) return;

    if (!formData.name.trim()) {
      setError('Leave type name is required');
      return;
    }

    if (!formData.max_days_per_year || parseInt(formData.max_days_per_year) < 0) {
      setError('Valid max days per year is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await leaveTypesAPI.updateLeaveType(leaveType.id, {
        name: formData.name,
        description: formData.description,
        max_days_per_year: parseInt(formData.max_days_per_year),
        requires_document: formData.requires_document,
        carry_forward: formData.carry_forward,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to update leave type'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!leaveType) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {_.leaves.edit}
          </DialogTitle>
          <DialogDescription>
            {_.leaves.editDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {_.name} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{_.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Max Days Per Year */}
          <div className="space-y-2">
            <Label htmlFor="max_days_per_year">
              Max Days Per Year <span className="text-destructive">*</span>
            </Label>
            <Input
              id="max_days_per_year"
              type="number"
              min="0"
              value={formData.max_days_per_year}
              onChange={(e) => handleChange('max_days_per_year', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Requires Document */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requires_document"
              checked={formData.requires_document}
              onCheckedChange={(checked) => handleChange('requires_document', checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="requires_document" className="text-sm font-medium">
              {_.leaves.docRequired}
            </Label>
          </div>

          {/* Carry Forward */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="carry_forward"
              checked={formData.carry_forward}
              onCheckedChange={(checked) => handleChange('carry_forward', checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="carry_forward" className="text-sm font-medium">
              {_.leaves.canCarryForward}
            </Label>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
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
