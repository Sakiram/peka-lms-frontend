import type { LeaveBalance } from '@/api/endpoints/leaves';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

export function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  const chartData = [
    { 
      name: 'Remaining', 
      value: balance.remaining, 
      color: 'var(--chart-2)' 
    },
    { 
      name: 'Used', 
      value: balance.used, 
      color: 'var(--chart-4)' 
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {balance.type}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Donut Chart */}
        <div className="flex justify-center relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value} days`}
                contentStyle={{
                  backgroundColor: 'var(--input)',
                  border: '1px solid var(--input)',
                  borderRadius: '6px',
                  opacity: 1,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-4xl font-bold">{balance.remaining}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{balance.allocated}</div>
            <div className="text-xs text-muted-foreground">Allocated</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-destructive">{balance.used}</div>
            <div className="text-xs text-muted-foreground">Used</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{balance.remaining}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}