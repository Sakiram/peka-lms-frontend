import type { User } from '@/api/endpoints/users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId: string; // Add current user ID
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 w-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground w-full">
        <p>No users found</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'destructive',
      HR: 'default',
      MANAGER: 'secondary',
      EMPLOYEE: 'outline',
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Name</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="whitespace-nowrap">Username</TableHead>
            <TableHead className="whitespace-nowrap">Role</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Join Date</TableHead>
            <TableHead className="whitespace-nowrap">Manager</TableHead>
            <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;

            return (
              <TableRow key={user.id} className={isCurrentUser ? 'bg-muted/50' : ''}>
                <TableCell className="font-medium whitespace-nowrap">
                  {user.first_name} {user.last_name}
                  {isCurrentUser && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                <TableCell className="whitespace-nowrap">{user.username}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={getRoleColor(user.role) as any}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={getStatusColor(user.status) as any}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(user.join_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.manager?.username || '-'}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {/* Hide delete button for current user */}
                    {!isCurrentUser && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}