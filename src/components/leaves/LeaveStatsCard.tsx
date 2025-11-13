import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import type { Leave, LeaveBalance } from '@/types/leaves';

interface LeaveStatsCardsProps {
  leaves: Leave[];
  leaveBalances: LeaveBalance[];
}

export function LeaveStatsCards({ leaves, leaveBalances }: LeaveStatsCardsProps) {
  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
  const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
  
  const totalDaysUsed = leaveBalances.reduce((sum, b) => sum + b.used, 0);
  
  const approvalRate = totalLeaves > 0 
    ? ((approvedLeaves / totalLeaves) * 100).toFixed(1) 
    : 0;

  const stats = [
    { label: 'Total Requests', value: totalLeaves, icon: Calendar, color: 'text-blue-500' },
    { label: 'Pending', value: pendingLeaves, icon: Clock, color: 'text-orange-500' },
    { label: 'Days Used', value: totalDaysUsed, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Approval Rate', value: `${approvalRate}%`, icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
