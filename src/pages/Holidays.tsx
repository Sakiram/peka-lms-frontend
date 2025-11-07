import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Calendar, AlertCircle } from 'lucide-react';

export function Holidays() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if user has permission
  if (!user || !['ADMIN', 'HR'].includes(user.role)) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Holidays</h1>
        <p className="text-muted-foreground">
          Manage company holidays
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Holiday List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Holiday management page (design later)
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}