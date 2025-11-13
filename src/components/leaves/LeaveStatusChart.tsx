import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Leave } from '@/types/leaves';
import * as _ from "@/constants/en.json";

interface LeaveStatusChartProps {
  leaves: Leave[];
}

export function LeaveStatusChart({ leaves }: LeaveStatusChartProps) {
  const statusCounts = leaves.reduce((acc, leave) => {
    acc[leave.status] = (acc[leave.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = leaves.length;

  const statusData = [
    { 
      status: 'APPROVED', 
      count: statusCounts.APPROVED || 0, 
      color: `#10b981`, 
      icon: CheckCircle 
    },
    { 
      status: 'PENDING', 
      count: statusCounts.PENDING || 0, 
      color: `#f59e0b`, 
      icon: Clock 
    },
    { 
      status: 'REJECTED', 
      count: statusCounts.REJECTED || 0, 
      color: `#ef4444`, 
      icon: XCircle 
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{_.leaves.leaveRequestStatus}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusData.map(({ status, count, color, icon: Icon }) => {
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            return (
              <div key={status} className="flex items-center gap-4">
                <Icon className="h-5 w-5" style={{ color }} />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}