import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { FileText, AlertCircle, Plus } from 'lucide-react';
import { leaveTypesAPI } from '@/api/endpoints/leaveTypes';
import type { LeaveType } from '@/types/leaves';
import { LeaveTypesTable } from '@/components/leaveTypes/LeaveTypesTable';
import { AddLeaveTypeModal } from '@/components/leaveTypes/AddLeaveTypeModal';
import { EditLeaveTypeModal } from '@/components/leaveTypes/EditLeaveTypeModal';
import { DeleteLeaveTypeDialog } from '@/components/leaveTypes/DeleteLeaveTypeDialog';
import * as _ from '@/constants/en.json';

export function LeaveTypes() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Permission check - Only ADMIN and HR
  if (!user || !['ADMIN', 'HR'].includes(user.role)) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {_.leaves.noPermission}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingLeaveType, setDeletingLeaveType] = useState<LeaveType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadLeaveTypes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await leaveTypesAPI.getAllLeaveTypes();
      setLeaveTypes(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to load leave types'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const handleEditClick = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (leaveType: LeaveType) => {
    setDeletingLeaveType(leaveType);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{_.leaves.leaveType}</h1>
          <p className="text-muted-foreground">
            {_.leaves.description4}
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {_.leaves.addLeaveType}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Leave Types Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All {_.leaves.leaveType} ({leaveTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveTypesTable
            leaveTypes={leaveTypes}
            isLoading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Add Leave Type Modal */}
      <AddLeaveTypeModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={loadLeaveTypes}
      />

      {/* Edit Leave Type Modal */}
      <EditLeaveTypeModal
        leaveType={editingLeaveType}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingLeaveType(null);
        }}
        onSuccess={loadLeaveTypes}
      />

      {/* Delete Leave Type Dialog */}
      <DeleteLeaveTypeDialog
        leaveType={deletingLeaveType}
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingLeaveType(null);
        }}
        onSuccess={loadLeaveTypes}
      />
    </DashboardLayout>
  );
}
