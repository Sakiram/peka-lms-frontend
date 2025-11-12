import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { RootState, Dispatch } from '@/store';
import { UserProfileModal } from '@/components/users/UserProfileModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { Button } from '@/components/ui/shadcn/button';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  FileText,
  Menu,
  X,
  LogOut,
  FileCheck,
  FilePlus2,
} from 'lucide-react';
import { useState } from 'react';
import { ApplyLeaveModal } from '@/components/leaves/ApplyLeaveModal';
import * as _ from '@/constants/en.json';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

export function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [applyLeaveModalOpen, setApplyLeaveModalOpen] = useState(false);

  // Define menu items with role-based access
  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'],
      },
      {
        label: 'Leaves',
        path: '/leaves',
        icon: <FileText className="h-5 w-5" />,
        roles: ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER'],
      },
      {
        label: 'Holidays',
        path: '/holidays',
        icon: <Calendar className="h-5 w-5" />,
        roles: ['ADMIN', 'HR'],
      },
      {
        label: 'Leave Types',
        path: '/leave-types',
        icon: <FilePlus2 className="h-5 w-5" />,
        roles: ['ADMIN', 'HR'],
      },
      {
        label: 'Leave Requests',
        path: '/leave-requests',
        icon: <FileCheck className="h-5 w-5" />,
        roles: ['ADMIN', 'HR', 'MANAGER'],
      },
      {
        label: 'Organization',
        path: '/organization',
        icon: <Building2 className="h-5 w-5" />,
        roles: ['ADMIN', 'HR'],
      },
    ];
  }, []);

  const visibleMenuItems = useMemo(() => {
    if (!user) return [];
    return menuItems.filter((item) => item.roles.includes(user.role));
  }, [user, menuItems]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await dispatch.auth.logout();
    navigate('/login');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-1 left-1 z-50 h-6 w-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">{user?.organization?.org_name}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.role || 'User'}
          </p>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
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
          <Button
            onClick={() => {
              setApplyLeaveModalOpen(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-start  gap-3 rounded-lg transition-colors w-full bg- text-foreground hover:bg-muted"
          >
            <FilePlus2 className="h-5 w-5" />
            <span className="font-medium">{_.leaves.applyLeave}</span>
          </Button>
        </nav>

        {/* User Info & Logout Section */}
        <div className="border-t border-border bg-card p-4">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2 mb-3 w-full hover:bg-muted p-2 rounded-lg transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage  src={user?.profile_pic_url ? `${user.profile_pic_url}?t=${Date.now()}` : undefined} alt="Profile" />
              <AvatarFallback className="text-sm font-bold">
                {user?.first_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </button>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {_.login.logout}
          </Button>
        </div>
      </aside>

      <UserProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <ApplyLeaveModal
        open={applyLeaveModalOpen}
        onClose={() => setApplyLeaveModalOpen(false)}
        onSuccess={() => {
          // Optional: refresh leaves or show success message
          setApplyLeaveModalOpen(false);
        }}
      />
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}