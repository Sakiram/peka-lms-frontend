import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert';
import { Building2, AlertCircle } from 'lucide-react';
import { usersAPI, type User } from '@/api/endpoints/users';
import { UsersFilters, type FilterValues } from '@/components/ui/layout/UserFilters';
import { UsersTable } from '@/components/ui/layout/UserTable';
import { UsersPagination } from '@/components/ui/layout/UserPagination';

export function Organization() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Permission check
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

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    role: '',
    status: '',
    sortBy: 'username',
    order: 'asc',
  });

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await usersAPI.getUsers({
        page,
        limit,
        role: filters.role || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        search: filters.search || undefined,
      });

      setUsers(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(
        err.response?.data?.message ||
        'Failed to load users. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  // Load users on mount and when filters/pagination change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization</h1>
        <p className="text-muted-foreground">
          Manage employees and organizational settings
        </p>
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
          {/* Filters */}
          <UsersFilters
            onFiltersChange={handleFiltersChange}
            isLoading={loading}
          />

          {/* Users Table */}
          <div className="w-full overflow-auto">
            <UsersTable users={users} isLoading={loading} />
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <UsersPagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}

          {/* Empty State */}
          {!loading && users.length === 0 && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No employees found</p>
              <p className="text-sm">Try adjusting your filters or search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}