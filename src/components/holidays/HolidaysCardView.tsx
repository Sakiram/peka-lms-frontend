// components/holidays/HolidaysCardView.tsx
import type { Holiday } from '@/types/holidays';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Edit2, Trash2, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import { getDaysUntil } from '@/lib/utils';
import * as _ from '@/constants/en.json';

interface HolidaysCardViewProps {
  holidays: Holiday[];
  isLoading: boolean;
  onEdit: (holiday: Holiday) => void;
  onDelete: (holiday: Holiday) => void;
}

export function HolidaysCardView({
  holidays,
  isLoading,
  onEdit,
  onDelete,
}: HolidaysCardViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (holidays.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{_.holidays.noHolidays}</p>
      </div>
    );
  }

  const getCardBorderColor = (date: string) => {
    const diff = differenceInCalendarDays(new Date(date), new Date());
    if (diff === 0) return 'border-l-4 border-l-green-500';
    if (diff > 0 && diff <= 7) return 'border-l-4 border-l-orange-500';
    if (diff < 0) return 'opacity-60';
    return '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {holidays.map((holiday) => {
        const daysUntil = getDaysUntil(holiday.holiday_date);
        const borderClass = getCardBorderColor(holiday.holiday_date);

        return (
          <Card key={holiday.id} className={`relative ${borderClass}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{holiday.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(holiday.holiday_date), 'MMMM dd, yyyy')}
                  </div>
                </div>
                {daysUntil !== 'Past' && (
                  <Badge variant={daysUntil === 'Today' ? 'default' : 'secondary'}>
                    {daysUntil}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {holiday.recurring ? (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {_.holidays.recurring}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3" />
                        {_.holidays.variable}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(holiday)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(holiday)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}