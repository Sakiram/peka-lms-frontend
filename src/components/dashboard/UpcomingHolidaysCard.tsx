import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
import { Calendar, PartyPopper } from 'lucide-react';
import { holidaysAPI, type Holiday } from '@/api/endpoints/holidays';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { HolidaysCalendarModal } from './HolidaysCalenderModal';

export function UpcomingHolidaysCard() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const data = await holidaysAPI.getUpcomingHolidays();
      setHolidays(data);
    } catch (error) {
      console.error('Failed to load holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (date: string) => {
    const targetDate = startOfDay(new Date(date));
    const today = startOfDay(new Date());
    const diff = differenceInDays(targetDate, today);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `in ${diff-1} days`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Holidays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Holidays
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <PartyPopper className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming holidays in the next 30 days</p>
            </div>
          ) : (
            <div className="space-y-3">
              {holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <span className="text-xs font-medium text-primary">
                        {format(new Date(holiday.holiday_date), 'MMM')}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {format(new Date(holiday.holiday_date), 'dd')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{holiday.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(holiday.holiday_date), 'EEEE')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {getDaysUntil(holiday.holiday_date)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <HolidaysCalendarModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}