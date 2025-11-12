import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Badge } from '@/components/ui/shadcn/badge';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area';
import { Calendar } from 'lucide-react';
import { holidaysAPI } from '@/api/endpoints/holidays';
import type { Holiday } from '@/types/holidays';
import { format } from 'date-fns';
import * as _ from "@/constants/en.json";

interface HolidaysCalendarModalProps {
  open: boolean;
  onClose: () => void;
}

export function HolidaysCalendarModal({ open, onClose }: HolidaysCalendarModalProps) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (open) {
      loadAllHolidays();
    }
  }, [open]);

  const loadAllHolidays = async () => {
    try {
      const data = await holidaysAPI.getCurrentHolidays();
      const sorted = data.sort((a, b) => 
        new Date(a.holiday_date).getTime() - new Date(b.holiday_date).getTime()
      );
      setHolidays(sorted);
    } catch (error) {
      console.error('Failed to load all holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthColor = (monthIndex: number) => {
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
      'bg-pink-50 border-pink-200 text-pink-900 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-100',
      'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
      'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-100',
      'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
      'bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100',
      'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
      'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-100',
      'bg-teal-50 border-teal-200 text-teal-900 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-100',
      'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-100',
      'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100',
      'bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-100',
    ];
    return colors[monthIndex] || colors[0];
  };

  const getMonthHeaderColor = (monthIndex: number) => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-pink-500 text-white',
      'bg-green-500 text-white',
      'bg-purple-500 text-white',
      'bg-yellow-500 text-white',
      'bg-orange-500 text-white',
      'bg-red-500 text-white',
      'bg-indigo-500 text-white',
      'bg-teal-500 text-white',
      'bg-rose-500 text-white',
      'bg-amber-500 text-white',
      'bg-cyan-500 text-white',
    ];
    return colors[monthIndex] || colors[0];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[70vw] w-auto max-h-[90vh]"
        style={{maxWidth: '80vw', width: '80vw'}}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Calendar className="h-5 w-5 md:h-6 md:w-6" />
            {_.holidays.holidays} {selectedYear}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(90vh-180px)] mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-2">
              {holidays.map((holiday) => {
                const date = new Date(holiday.holiday_date);
                const monthIndex = date.getMonth();
                const monthName = format(date, 'MMMM');
                const dayName = format(date, 'EEEE');
                const dayNumber = format(date, 'dd');

                return (
                  <div
                    key={holiday.id}
                    className={`rounded-lg border-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${getMonthColor(monthIndex)}`}
                  >
                    <div className={`text-center font-bold py-1.5 md:py-2 text-xs md:text-sm ${getMonthHeaderColor(monthIndex)}`}>
                      {monthName.toUpperCase()}
                    </div>

                    <div className="p-2 md:p-3 lg:p-4">
                      <div className="text-center mb-2 md:mb-3">
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold leading-none mb-1">
                          {dayNumber}
                        </div>
                        <div className="text-[10px] md:text-xs font-medium opacity-75 uppercase">
                          {dayName}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="font-semibold text-xs md:text-sm leading-tight mb-1.5 md:mb-2 line-clamp-2">
                          {holiday.name}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 justify-center">
                          {holiday.recurring && (
                            <Badge variant="outline" className="text-[10px] md:text-xs px-1 py-0">
                              {_.holidays.recurring}
                            </Badge>
                          )}
                          {holiday.is_upcoming && (
                            <Badge variant="secondary" className="text-[10px] md:text-xs px-1 py-0">
                              {_.holidays.upcoming}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {holidays.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-4 opacity-50" />
                <p className="text-base md:text-lg font-medium">{_.holidays.noHolidays}</p>
                <p className="text-xs md:text-sm">{_.holidays.noHolidaysTxt}</p>
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}