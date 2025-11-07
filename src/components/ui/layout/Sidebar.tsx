import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/shadcn/button';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[]; // Which roles can see this
}

export function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Toggle sidebar on mobile

  // Define menu items with role-based access
  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'], // All roles
      },
      {
        label: 'Leaves',
        path: '/leaves',
        icon: <FileText className="h-5 w-5" />,
        roles: ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'], // All roles
      },
      {
        label: 'Holidays',
        path: '/holidays',
        icon: <Calendar className="h-5 w-5" />,
        roles: ['ADMIN', 'HR'], // Only ADMIN and HR
      },
      {
        label: 'Organization',
        path: '/organization',
        icon: <Building2 className="h-5 w-5" />,
        roles: ['ADMIN'], // Only ADMIN
      },
    ];
  }, []);

  // Filter menu items based on user role
  const visibleMenuItems = useMemo(() => {
    if (!user) return [];
    return menuItems.filter((item) => item.roles.includes(user.role));
  }, [user, menuItems]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">LMS</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.role || 'User'}
          </p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close on mobile after click
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              {user?.first_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}