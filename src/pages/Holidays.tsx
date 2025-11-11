import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Calendar, AlertCircle, CalendarPlus } from 'lucide-react';
import { holidaysAPI, type Holiday } from '@/api/endpoints/holidays';
import { HolidaysTable } from '@/components/holidays/HolidaysTable';
import { AddHolidayModal } from '@/components/holidays/AddHolidayModal';
import { EditHolidayModal } from '@/components/holidays/EditHolidayModal';
import { DeleteHolidayDialog } from '@/components/holidays/DeleteHolidayDialog';

export function Holidays() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Permission check
  if (!user || !['ADMIN', 'HR'].includes(user.role)) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingHoliday, setDeletingHoliday] = useState<Holiday | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadHolidays = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await holidaysAPI.getAllHolidays();
      // Sort by date
      const sorted = data.sort((a, b) => 
        new Date(a.holiday_date).getTime() - new Date(b.holiday_date).getTime()
      );
      setHolidays(sorted);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to load holidays'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const handleEditClick = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (holiday: Holiday) => {
    setDeletingHoliday(holiday);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Holidays</h1>
          <p className="text-muted-foreground">
            Manage company holidays and events
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Holiday
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Holidays Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Holidays ({holidays.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HolidaysTable
            holidays={holidays}
            isLoading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Add Holiday Modal */}
      <AddHolidayModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={loadHolidays}
      />

      {/* Edit Holiday Modal */}
      <EditHolidayModal
        holiday={editingHoliday}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingHoliday(null);
        }}
        onSuccess={loadHolidays}
      />

      {/* Delete Holiday Dialog */}
      <DeleteHolidayDialog
        holiday={deletingHoliday}
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingHoliday(null);
        }}
        onSuccess={loadHolidays}
      />
    </DashboardLayout>
  );
}