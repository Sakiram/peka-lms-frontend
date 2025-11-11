import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, Dispatch } from '@/store';
import { Button } from '@/components/ui/shadcn/button';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { PendingApprovalsCard } from '@/components/dashboard/PendingApprovalsCard';
import { UpcomingHolidaysCard } from '@/components/dashboard/UpcomingHolidaysCard';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export function Dashboard() {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch.auth.logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.first_name}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovalsCard />
        <UpcomingHolidaysCard />
      </div>
    </DashboardLayout>
  );
}