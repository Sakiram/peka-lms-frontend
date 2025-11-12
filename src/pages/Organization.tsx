import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Building2, AlertCircle, UserPlus } from 'lucide-react';
import { usersAPI } from '@/api/endpoints/users';
import type { User } from '@/types/users';
import { UsersFilters, type FilterValues } from '@/components/users/UserFilters';
import { UsersTable } from '@/components/users/UserTable';
import { UsersPagination } from '@/components/users/UserPagination';
import { EditUserModal } from '@/components/users/EditUserModal';
import { DeleteUserDialog } from '@/components/users/DeleteUserDialog';
import { InviteUserModal } from '@/components/ui/layout/InviteUserModal';
import { Button } from '@/components/ui/shadcn/button';

export function Organization() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || user.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only admins can access this page.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Managers state
  const [managers, setManagers] = useState<User[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    role: '',
    status: '',
  });

  const [sortBy, setSortBy] = useState('username');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await usersAPI.getUsers({
        page,
        limit,
        role: filters.role || undefined,
        status: filters.status || undefined,
        sortBy,
        order,
        search: filters.search || undefined,
      });

      setUsers(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to load users. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters, sortBy, order]);

  const loadManagers = useCallback(async () => {
    try {
      setLoadingManagers(true);
      const data = await usersAPI.getManagers();
      setManagers(data);
    } catch (err) {
      console.error('Failed to load managers:', err);
    } finally {
      setLoadingManagers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadManagers();
  }, [loadUsers, loadManagers]);

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

   const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };
  
  const handleEditClick = (selectedUser: User) => {
    setEditingUser(selectedUser);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (selectedUser: User) => {
    setDeletingUser(selectedUser);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    loadUsers();
  };

  return (
    <DashboardLayout>
      {/* Header with Invite Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organization</h1>
          <p className="text-muted-foreground">
            Manage employees and organizational settings
          </p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Employees ({total})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UsersFilters
            onFiltersChange={handleFiltersChange}
            isLoading={loading}
          />

          <div className="w-full overflow-auto">
            <UsersTable
              users={users}
              isLoading={loading}
              currentUserId={user.id}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
            />
          </div>

          {users.length > 0 && (
            <UsersPagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          )}

          {!loading && users.length === 0 && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No employees found</p>
              <p className="text-sm">Try adjusting your filters or search</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditUserModal
        user={editingUser}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={handleRefresh}
        managers={managers}
        isLoadingManagers={loadingManagers}
      />

      {/* Delete Dialog */}
      <DeleteUserDialog
        user={deletingUser}
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingUser(null);
        }}
        onSuccess={handleRefresh}
      />

      {/* Invite Modal - Add this */}
      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={handleRefresh}
        managers={managers}
        isLoadingManagers={loadingManagers}
      />
    </DashboardLayout>
  );
}