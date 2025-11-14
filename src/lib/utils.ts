import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, startOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 export const getDaysUntil = (date: string) => {
    const targetDate = startOfDay(new Date(date));
    const today = startOfDay(new Date());
    const diff = differenceInDays(targetDate, today);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0) return 'Past';
    return `in ${diff-1} days`;
  };