import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Lock, AlertCircle } from 'lucide-react';
import { authAPI } from '@/api/endpoints/auth';
import * as _ from '@/constants/en.json';

export function SetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setPasswordError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setPasswordError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setPasswordError('Last name is required');
      return false;
    }
    if (!formData.userName.trim()) {
      setPasswordError('Username is required');
      return false;
    }
    if (!formData.password) {
      setPasswordError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('No token provided');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await authAPI.setPassword(token, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        password: formData.password,
      });

      if (response.message) {
        navigate('/login', {
          state: {
            message: 'Password set successfully! Please login with your new credentials.',
          },
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to set password. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Lock className="h-6 w-6" />
            {_.login.setPassword}
          </CardTitle>
          <CardDescription>
            {_.login.setPasswordDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{_.users.firstName}</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{_.users.lastName}</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">{_.users.username}</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="johndoe"
                value={formData.userName}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{_.login.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{_.login.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Setting Password...' : 'Set Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
