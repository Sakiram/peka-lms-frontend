import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { PendingApprovalsCard } from '@/components/dashboard/PendingApprovalsCard';
import { UpcomingHolidaysCard } from '@/components/dashboard/UpcomingHolidaysCard';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import * as _ from '@/constants/en.json';

export function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{_.dashboard_title}</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.first_name}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovalsCard />
        <UpcomingHolidaysCard />
      </div>
    </DashboardLayout>
  );
}