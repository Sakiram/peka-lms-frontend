import { useState } from 'react';
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
import { AlertCircle, Plus } from 'lucide-react';
import { leaveTypesAPI } from '@/api/endpoints/leaveTypes';
import * as _ from '@/constants/en.json';

interface AddLeaveTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLeaveTypeModal({ open, onClose, onSuccess }: AddLeaveTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_days_per_year: '',
    requires_document: false,
    carry_forward: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await leaveTypesAPI.createLeaveType({
        name: formData.name,
        description: formData.description,
        max_days_per_year: parseInt(formData.max_days_per_year),
        requires_document: formData.requires_document,
        carry_forward: formData.carry_forward,
      });

      setFormData({
        name: '',
        description: '',
        max_days_per_year: '',
        requires_document: false,
        carry_forward: false,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to create leave type'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      max_days_per_year: '',
      requires_document: false,
      carry_forward: false,
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {_.leaves.addLeaveType}
          </DialogTitle>
          <DialogDescription>
            {_.leaves.createOrg}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {_.name} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Sick Leave"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this leave type"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Max Days Per Year */}
          <div className="space-y-2">
            <Label htmlFor="max_days_per_year">
              {_.leaves.maxDays} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="max_days_per_year"
              type="number"
              min="0"
              placeholder="e.g., 12"
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
              onClick={handleClose}
              disabled={loading}
            >
              {_.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Leave Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
