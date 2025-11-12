import { useState, useEffect } from 'react';
import type { Holiday } from '@/types/holidays';
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
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle, Calendar } from 'lucide-react';
import { holidaysAPI } from '@/api/endpoints/holidays';

interface EditHolidayModalProps {
  holiday: Holiday | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditHolidayModal({
  holiday,
  open,
  onClose,
  onSuccess,
}: EditHolidayModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    holiday_date: '',
    recurring: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (holiday && open) {
      setFormData({
        name: holiday.name,
        holiday_date: holiday.holiday_date,
        recurring: holiday.recurring,
      });
    }
  }, [holiday, open]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!holiday) return;

    if (!formData.name.trim()) {
      setError('Holiday name is required');
      return;
    }

    if (!formData.holiday_date) {
      setError('Holiday date is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await holidaysAPI.updateHoliday(holiday.id, {
        name: formData.name,
        holiday_date: formData.holiday_date,
        recurring: formData.recurring,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to update holiday'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!holiday) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Holiday
          </DialogTitle>
          <DialogDescription>
            Update holiday information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Holiday Name <span className="text-destructive">*</span>
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="holiday_date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="holiday_date"
              type="date"
              value={formData.holiday_date}
              onChange={(e) => handleChange('holiday_date', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => handleChange('recurring', checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="recurring" className="text-sm font-medium">
              Recurring holiday (repeats every year)
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
              Cancel
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