import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/shadcn/textarea';
import { Checkbox } from '@/components/ui/shadcn/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { AlertCircle, X, FileText } from 'lucide-react';
import { leavesAPI } from '@/api/endpoints/leaves';
import { leaveTypesAPI } from '@/api/endpoints/leaveTypes';
import type { LeaveType } from '@/types/leaves';
import { differenceInDays, parseISO } from 'date-fns';
import * as _ from '@/constants/en.json';

interface ApplyLeaveModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyLeaveModal({ open, onClose, onSuccess }: ApplyLeaveModalProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    total_days: 0,
    half_day: false,
    start_half: 'first',
    end_half: 'second',
    reason: '',
    attachment_url: '',
    });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadLeaveTypes();
    }
  }, [open]);

  const loadLeaveTypes = async () => {
    try {
      const data = await leaveTypesAPI.getAllLeaveTypes();
      const activeTypes = data.filter(lt => lt.active);
      setLeaveTypes(activeTypes);
    } catch (err) {
      console.error('Failed to load leave types:', err);
    }
  };

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      calculateTotalDays();
    }
  }, [formData.start_date, formData.end_date, formData.half_day, formData.start_half, formData.end_half]);

  const calculateTotalDays = () => {
    const start = parseISO(formData.start_date);
    const end = parseISO(formData.end_date);
    const daysDiff = differenceInDays(end, start) + 1;

    if (!formData.half_day) {
        setFormData(prev => ({ ...prev, total_days: daysDiff }));
    } else {
        let totalDays = daysDiff;

        if (daysDiff === 1) {
        totalDays = 0.5;
        } else {
        if (formData.start_half === 'second') {
            totalDays -= 0.5;
        }
        if (formData.end_half === 'first') {
            totalDays -= 0.5;
        }
        }

        setFormData(prev => ({ ...prev, total_days: totalDays }));
    }
    };

  const handleLeaveTypeChange = (value: string) => {
    const selected = leaveTypes.find(lt => lt.id === value);
    setSelectedLeaveType(selected || null);
    setFormData(prev => ({ ...prev, leave_type_id: value }));
    setError('');
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleHalfDayChange = (checked: boolean) => {
    if (checked) {
        setFormData(prev => ({ 
        ...prev, 
        half_day: true,
        start_half: 'first',
        end_half: 'second'
        }));
    } else {
        setFormData(prev => ({ 
        ...prev, 
        half_day: false,
        start_half: 'first',
        end_half: 'second'
        }));
    }
    };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }

    setUploadedFile(file);
    setError('');

    try {
      setUploading(true);
      const response = await leavesAPI.uploadProof(file);
      setFormData(prev => ({ ...prev, attachment_url: response.data }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, attachment_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leave_type_id) {
      setError('Please select a leave type');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError('Please select start and end dates');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Please provide a reason');
      return;
    }

    if (selectedLeaveType?.requires_document && !formData.attachment_url) {
      setError('Attachment is required for this leave type');
      return;
    }

    const start = parseISO(formData.start_date);
    const end = parseISO(formData.end_date);
    if (end < start) {
      setError('End date must be after start date');
      return;
    }

    if (formData.total_days <= 0) {
      setError('Total days must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await leavesAPI.applyLeave({
        leave_type_id: formData.leave_type_id,
        leave_type_name: selectedLeaveType?.name || '',
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_days: formData.total_days,
        half_day: formData.half_day,
        reason: formData.reason,
        attachment_url: formData.attachment_url || undefined,
      });

      setFormData({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        total_days: 0,
        half_day: false,
        start_half: 'full',
        end_half: 'full',
        reason: '',
        attachment_url: '',
      });
      setUploadedFile(null);
      setSelectedLeaveType(null);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      leave_type_id: '',
      start_date: '',
      end_date: '',
      total_days: 0,
      half_day: false,
      start_half: 'first',
      end_half: 'second',
      reason: '',
      attachment_url: '',
    });
    setUploadedFile(null);
    setSelectedLeaveType(null);
    setError('');
    onClose();
  };

  const daysDiff = formData.start_date && formData.end_date 
    ? differenceInDays(parseISO(formData.end_date), parseISO(formData.start_date)) + 1
    : 0;

  const isSingleDay = daysDiff === 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {_.leaves.applyFor}
          </DialogTitle>
          <DialogDescription>
            {_.leaves.fillIn}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leave_type">
              {_.leaves.leaveType} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.leave_type_id}
              onValueChange={handleLeaveTypeChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.max_days_per_year} days/year)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">
                {_.startDate} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_days">Total Days</Label>
              <Input
                id="total_days"
                type="number"
                step="0.5"
                value={formData.total_days}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">
                {_.endDate} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                disabled={loading}
                min={formData.start_date}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="half_day"
              checked={formData.half_day}
              onCheckedChange={handleHalfDayChange}
              disabled={loading}
            />
            <Label htmlFor="half_day" className="text-sm font-medium">
              {_.leaves.applyForHalfDay}
            </Label>
          </div>

            {formData.half_day && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                <Label htmlFor="start_half">
                    {_.startDate} ({isSingleDay ? 'Only day' : 'First day'})
                </Label>
                <Select
                    value={formData.start_half}
                    onValueChange={(value) => handleChange('start_half', value)}
                    disabled={loading}
                >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="first">First Half</SelectItem>
                    <SelectItem value="second">Second Half</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                {!isSingleDay && (
                <div className="space-y-2">
                    <Label htmlFor="end_half">End Date (Last day)</Label>
                    <Select
                    value={formData.end_half}
                    onValueChange={(value) => handleChange('end_half', value)}
                    disabled={loading}
                    >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="first">First Half</SelectItem>
                        <SelectItem value="second">Second Half</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                )}
            </div>
            )}         

          <div className="space-y-2">
            <Label htmlFor="reason">
              {_.reason} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for leave..."
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              disabled={loading}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">
              {_.attachments} {selectedLeaveType?.requires_document && <span className="text-destructive">*</span>}
              <span className="text-xs text-muted-foreground ml-2">(Max 50MB)</span>
            </Label>
            
            {!uploadedFile ? (
              <div className="flex items-center gap-2">
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading || uploading}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="cursor-pointer"
                />
                {uploading && (
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-sm truncate">{uploadedFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
              disabled={loading || uploading}
            >
              {_.cancel}
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Submitting...' : 'Apply for Leave'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}