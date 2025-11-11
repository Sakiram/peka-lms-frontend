import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, Dispatch } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { User, Camera, Mail, Phone, Briefcase, Building2, AlertCircle } from 'lucide-react';
import { usersAPI } from '@/api/endpoints/users';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<Dispatch>();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_no: '',
    profile_pic_url: '',
  });

  const [uploadingPic, setUploadingPic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        contact_no: user.contact_no ? user.contact_no.toString() : '',
        profile_pic_url: user.profile_pic_url || '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setUploadingPic(true);
      setError('');
      const response = await usersAPI.uploadProfilePic(file);
      setFormData((prev) => ({ ...prev, profile_pic_url: response.data }));
      const cacheBustedUrl = `${response.data}?t=${Date.now()}`;
        dispatch.auth.updateUser({
        profile_pic_url: cacheBustedUrl
        });
      setSuccess('Profile picture uploaded successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingPic(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    // Validation
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return;
    }

    if (formData.contact_no && !/^\d{10}$/.test(formData.contact_no)) {
      setError('Contact number must be 10 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim() || undefined,
        contact_no: formData.contact_no ? parseInt(formData.contact_no) : undefined,
        profile_pic_url: formData.profile_pic_url || undefined,
      };

      await usersAPI.updateUser(user.id, payload);
      
       dispatch.auth.updateUser({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        contact_no: formData.contact_no ? parseInt(formData.contact_no) : undefined,
        profile_pic_url: formData.profile_pic_url,
        });
      
      setSuccess('Profile updated successfully');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    return `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 pb-4 border-b">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={formData.profile_pic_url} alt="Profile" />
                <AvatarFallback className="text-3xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-5 w-5" />
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingPic || loading}
                  className="hidden"
                />
              </label>
            </div>
            
            {uploadingPic && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
          </div>

          {/* Read-only Info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Role
              </div>
              <p className="text-sm font-medium">{user?.role}</p>
            </div>

            <div className="space-y-1 col-span-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Organization
              </div>
              <p className="text-sm font-medium">{user?.organization?.org_name}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="contact_no">
                <Phone className="h-4 w-4 inline mr-1" />
                Contact Number
              </Label>
              <Input
                id="contact_no"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.contact_no}
                onChange={(e) => handleChange('contact_no', e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={loading}
                maxLength={10}
              />
            </div>
          </div>

          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || uploadingPic}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingPic}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}