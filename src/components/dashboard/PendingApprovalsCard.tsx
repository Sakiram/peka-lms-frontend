import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Clock, Calendar, ChevronRight } from 'lucide-react';
import { leavesAPI } from '@/api/endpoints/leaves';
import type { Leave } from '@/types/leaves';
import { format } from 'date-fns';
import * as _ from "@/constants/en.json";

export function PendingApprovalsCard() {
  const navigate = useNavigate();
  const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const data = await leavesAPI.getPendingApprovals();
      setPendingLeaves(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClick = () => {
    navigate(`/leaves`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {_.leaves.pending}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {_.leaves.pending}
          {pendingLeaves.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingLeaves.length}
            </Badge>
          )}
        </CardTitle>
        {pendingLeaves.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => navigate('/leaves')}>
            {_.leaves.viewAll}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {pendingLeaves.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{_.leaves.noPending}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingLeaves.map((leave) => (
              <div
                key={leave.id}
                onClick={() => handleLeaveClick()}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {leave.leave_types.name} Leave
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {leave.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(leave.start_date), 'MMM dd')} - 
                      {format(new Date(leave.end_date), 'MMM dd, yyyy')}
                    </span>
                    <span>
                      {leave.total_days} {leave.total_days === 1 ? 'day' : 'days'}
                      {leave.half_day && ' (Half day)'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}