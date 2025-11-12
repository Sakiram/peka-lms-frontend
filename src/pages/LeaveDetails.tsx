import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { FileText } from 'lucide-react';
import * as _ from '@/constants/en.json';

export function Leaves() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{_.leaves.name}</h1>
        <p className="text-muted-foreground">{_.leaves.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {_.leaves.leaveRequests}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {_.leaves.description1}
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}