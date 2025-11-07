import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { orgAPI, type CreateOrgRequest } from '@/api/endpoints/org';
import type { OrgSignupStep1, OrgSignupStep2 } from '@/types';

export const OrgSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [step1Data, setStep1Data] = useState<OrgSignupStep1>({
    org_name: '',
    domain: '',
    org_email: '',
    password: '',
  });

  const [step2Data, setStep2Data] = useState<OrgSignupStep2>({
    firstname: '',
    lastname: '',
    username: '',
  });

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep1Data({ ...step1Data, [e.target.name]: e.target.value });
    setError('');
  };

  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2Data({ ...step2Data, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const requestData: CreateOrgRequest = {
      ...step1Data,
      ...step2Data,
    };

    try {
      await orgAPI.createOrg(requestData);
      navigate('/login', {
        state: { message: 'Organization created successfully! Please login.' },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Organization</CardTitle>
          <CardDescription>
            Step {currentStep} of 2: {currentStep === 1 ? 'Organization Details' : 'Admin User Details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <div className={`h-2 flex-1 rounded ${currentStep >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
          </div>

          {currentStep === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org_name">Organization Name</Label>
                <Input
                  id="org_name"
                  name="org_name"
                  type="text"
                  placeholder="My Company"
                  value={step1Data.org_name}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="mycompany.com"
                  value={step1Data.domain}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org_email">Organization Email</Label>
                <Input
                  id="org_email"
                  name="org_email"
                  type="email"
                  placeholder="admin@mycompany.com"
                  value={step1Data.org_email}
                  onChange={handleStep1Change}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={step1Data.password}
                  onChange={handleStep1Change}
                  required
                  minLength={8}
                />
              </div>

              <Button type="submit" className="w-full">
                Next
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  placeholder="John"
                  value={step2Data.firstname}
                  onChange={handleStep2Change}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  placeholder="Doe"
                  value={step2Data.lastname}
                  onChange={handleStep2Change}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={step2Data.username}
                  onChange={handleStep2Change}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Sign Up'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
