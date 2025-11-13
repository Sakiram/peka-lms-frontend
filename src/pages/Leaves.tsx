import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { FileText, Plus, AlertCircle, TrendingUp } from 'lucide-react';
import { leavesAPI } from '@/api/endpoints/leaves';
import type { LeaveBalance, Leave } from '@/types/leaves';
import { ApplyLeaveModal } from '@/components/leaves/ApplyLeaveModal';
import { LeaveBalanceCard } from '@/components/leaves/LeaveBalanceCard';
import { LeavesTable } from '@/components/leaves/LeavesTable';
import { LeaveLogsModal } from '@/components/leaves/LeaveLogsModal';
import * as _ from '@/constants/en.json';

export function Leaves() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [balanceRes, leavesRes] = await Promise.all([
        leavesAPI.getLeaveBalance(),
        leavesAPI.getLeaves(),
      ]);

      setLeaveBalances(balanceRes.data);
      setLeaves(leavesRes.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to load leave data'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setLogsModalOpen(true);
  };

  const handleSuccess = () => {
    loadData();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{_.leaves.name}</h1>
          <p className="text-muted-foreground">{_.leaves.description}</p>
        </div>
        <Button onClick={() => setApplyModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {_.leaves.applyLeave}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {_.leaves.Balance}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leaveBalances.map((balance) => (
              <LeaveBalanceCard key={balance.type} balance={balance} />
            ))}
          </div>
        )}

        {!loading && leaveBalances.length === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <p>{_.leaves.description3}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {_.leaves.History}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeavesTable
            leaves={leaves}
            isLoading={loading}
            onViewLogs={handleViewLogs}
          />
        </CardContent>
      </Card>

      <ApplyLeaveModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <LeaveLogsModal
        leaveId={selectedLeaveId}
        open={logsModalOpen}
        onClose={() => {
          setLogsModalOpen(false);
          setSelectedLeaveId(null);
        }}
      />
    </DashboardLayout>
  );
}