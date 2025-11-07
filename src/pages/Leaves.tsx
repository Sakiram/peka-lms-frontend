import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { FileText } from 'lucide-react';

export function Leaves() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leaves</h1>
        <p className="text-muted-foreground">Manage your leave requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Leave management page (design later)
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}