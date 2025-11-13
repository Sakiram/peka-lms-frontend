import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { TrendingUp } from 'lucide-react';
import type { Leave } from '@/types/leaves';
import * as _ from "@/constants/en.json";

interface MonthlyLeaveTrendsChartProps {
  leaves: Leave[];
}

export function MonthlyLeaveTrendsChart({ leaves }: MonthlyLeaveTrendsChartProps) {
  const monthlyData = leaves.reduce((acc, leave) => {
    const month = new Date(leave.start_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const data = Object.entries(monthlyData).slice(-6);
  const maxValue = Math.max(...data.map(([_, count]) => count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {_.MonthlyLeaveTrends}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map(([month, count]) => {
            const percentage = (count / maxValue) * 100;
            return (
              <div key={month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{month}</span>
                  <span className="text-muted-foreground">{count} {_.leaves.name}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}