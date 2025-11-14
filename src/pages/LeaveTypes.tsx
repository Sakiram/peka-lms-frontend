import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { FileText, AlertCircle, Plus, LayoutGrid, Table as TableIcon, CheckCircle, XCircle } from 'lucide-react';
import { leaveTypesAPI } from '@/api/endpoints/leaveTypes';
import type { LeaveType } from '@/types/leaves';
import { LeaveTypesTable } from '@/components/leaveTypes/LeaveTypesTable';
import { LeaveTypesCardView } from '@/components/leaveTypes/LeaveTypesCardView';
import { AddLeaveTypeModal } from '@/components/leaveTypes/AddLeaveTypeModal';
import { EditLeaveTypeModal } from '@/components/leaveTypes/EditLeaveTypeModal';
import { DeleteLeaveTypeDialog } from '@/components/leaveTypes/DeleteLeaveTypeDialog';
import * as _ from '@/constants/en.json';

export function LeaveTypes() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

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

  const activeTypes = leaveTypes.filter(lt => lt.active).length;
  const inactiveTypes = leaveTypes.length - activeTypes;

  return (
    <DashboardLayout>
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

      {!loading && leaveTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Types</p>
                  <p className="text-2xl font-bold mt-2">{leaveTypes.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold mt-2">{activeTypes}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold mt-2">{inactiveTypes}</p>
                </div>
                <XCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All {_.leaves.leaveType} ({leaveTypes.length})
            </CardTitle>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('card')}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Card View
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <TableIcon className="h-4 w-4 mr-1" />
                Table View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <LeaveTypesTable
              leaveTypes={leaveTypes}
              isLoading={loading}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ) : (
            <LeaveTypesCardView
              leaveTypes={leaveTypes}
              isLoading={loading}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </CardContent>
      </Card>

      <AddLeaveTypeModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={loadLeaveTypes}
      />

      <EditLeaveTypeModal
        leaveType={editingLeaveType}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingLeaveType(null);
        }}
        onSuccess={loadLeaveTypes}
      />

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
