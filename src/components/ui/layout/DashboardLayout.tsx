import { Sidebar } from '@/components/ui/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <div className="w-full min-h-screen px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}