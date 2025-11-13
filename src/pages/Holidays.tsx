import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Calendar, AlertCircle, CalendarPlus, CalendarDays } from 'lucide-react';
import { holidaysAPI } from '@/api/endpoints/holidays';
import type { Holiday } from '@/types/holidays';
import { HolidaysTable } from '@/components/holidays/HolidaysTable';
import { AddHolidayModal } from '@/components/holidays/AddHolidayModal';
import { EditHolidayModal } from '@/components/holidays/EditHolidayModal';
import { DeleteHolidayDialog } from '@/components/holidays/DeleteHolidayDialog';
import * as _ from '@/constants/en.json';

export function Holidays() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showAllYears, setShowAllYears] = useState(false);
  const currentYear = new Date().getFullYear();

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

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingHoliday, setDeletingHoliday] = useState<Holiday | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadHolidays = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await holidaysAPI.getAllHolidays(showAllYears);
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
  }, [showAllYears]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{_.holidays.holidays}</h1>
          <p className="text-muted-foreground">
            {_.holidays.description}
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          {_.holidays.addHoliday}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 mb-4">
        <Button
          variant={!showAllYears ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAllYears(false)}
        >
          <Calendar className="h-4 w-4 mr-1" />
          {currentYear}
        </Button>
        <Button
          variant={showAllYears ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAllYears(true)}
        >
          <CalendarDays className="h-4 w-4 mr-1" />
          {_.holidays.allYears}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {showAllYears ? 'All Holidays' : `Holidays ${currentYear}`} ({holidays.length})
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

      <AddHolidayModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={loadHolidays}
      />

      <EditHolidayModal
        holiday={editingHoliday}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingHoliday(null);
        }}
        onSuccess={loadHolidays}
      />

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